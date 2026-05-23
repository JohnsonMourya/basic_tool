const HISTORY_KEY = 'calc_history';
const MAX_HISTORY = 50;
const PRECEDENCE = { '+': 1, '−': 1, '-': 1, '×': 2, '*': 2, '÷': 2, '/': 2, '^': 3 };
const RIGHT_ASSOC = { '^': true };

// ---------- tokenizer ----------
function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === ' ') { i++; continue; }

    // number
    if (/[\d.]/.test(ch)) {
      let num = '';
      while (i < expr.length && /[\d.]/.test(expr[i])) { num += expr[i]; i++; }
      if (num === '.') return { error: 'Syntax Error' };
      tokens.push({ t: 'num', v: parseFloat(num) });
      continue;
    }

    // constants
    if (ch === 'π') { tokens.push({ t: 'num', v: Math.PI }); i++; continue; }
    if (ch === 'e' && !/[a-z]/i.test(expr[i + 1] || '')) {
      tokens.push({ t: 'num', v: Math.E }); i++; continue;
    }

    // functions
    const fn = expr.slice(i).match(/^(sin|cos|tan|log|ln|sqrt)\b/i);
    if (fn) {
      tokens.push({ t: 'fn', v: fn[1].toLowerCase() });
      i += fn[0].length;
      continue;
    }

    // factorial
    if (ch === '!') { tokens.push({ t: 'post', v: '!' }); i++; continue; }

    // operators / parens
    const map = {
      '+': { t: 'op', v: '+' },
      '−': { t: 'op', v: '-' },
      '-': { t: 'op', v: '-' },
      '×': { t: 'op', v: '*' },
      '*': { t: 'op', v: '*' },
      '÷': { t: 'op', v: '/' },
      '/': { t: 'op', v: '/' },
      '^': { t: 'op', v: '^' },
      '(': { t: 'lp', v: '(' },
      ')': { t: 'rp', v: ')' },
    };
    if (map[ch]) { tokens.push(map[ch]); i++; continue; }

    // binary operators
    const bin = expr.slice(i).match(/^(AND|OR|XOR|NOT|<<|>>)\b/i);
    if (bin) {
      tokens.push({ t: 'op', v: bin[1].toLowerCase() });
      i += bin[0].length;
      continue;
    }

    i++;
  }
  return tokens;
}

// ---------- shunting-yard ----------
function toRPN(tokens, usePEMDAS) {
  const out = [];
  const ops = [];
  let prev = null;

  const prec = (op) => PRECEDENCE[op] || (op === 'and' || op === 'or' || op === 'xor' ? 0 : 5);
  const isRight = (op) => RIGHT_ASSOC[op];

  for (const tok of tokens) {
    if (tok.t === 'num') {
      out.push(tok);
      prev = 'num';
    } else if (tok.t === 'fn') {
      ops.push(tok);
      prev = 'fn';
    } else if (tok.t === 'post') {
      out.push(tok);
      prev = 'post';
    } else if (tok.t === 'lp') {
      ops.push(tok);
      prev = 'lp';
    } else if (tok.t === 'rp') {
      while (ops.length && ops[ops.length - 1].t !== 'lp') {
        out.push(ops.pop());
      }
      if (!ops.length) return { error: 'Mismatched parentheses' };
      ops.pop();
      if (ops.length && ops[ops.length - 1].t === 'fn') out.push(ops.pop());
      prev = 'rp';
    } else if (tok.t === 'op') {
      // unary minus detection
      if (tok.v === '-' && (prev === null || prev === 'lp' || prev === 'op')) {
        ops.push({ t: 'unary', v: '-' });
        prev = 'op';
        continue;
      }
      const p = prec(tok.v);
      while (
        ops.length &&
        ops[ops.length - 1].t !== 'lp' &&
        (isRight(tok.v) ? prec(ops[ops.length - 1].v) > p : prec(ops[ops.length - 1].v) >= p)
      ) {
        out.push(ops.pop());
      }
      ops.push(tok);
      prev = 'op';
    }
  }

  while (ops.length) {
    const op = ops.pop();
    if (op.t === 'lp' || op.t === 'rp') return { error: 'Mismatched parentheses' };
    out.push(op);
  }
  return out;
}

// ---------- RPN evaluator ----------
const BIN_OPS = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => { if (b === 0) throw new Error('Division by zero'); return a / b; },
  '/': (a, b) => { if (b === 0) throw new Error('Division by zero'); return a / b; },
  '^': (a, b) => Math.pow(a, b),
  'and': (a, b) => (a & b) >>> 0,
  'or': (a, b) => (a | b) >>> 0,
  'xor': (a, b) => (a ^ b) >>> 0,
};

const UNARY_OPS = {
  '-': (a) => -a,
  'not': (a) => ~a >>> 0,
};

const FUNCTIONS = {
  sin: (a) => Math.sin(a),
  cos: (a) => Math.cos(a),
  tan: (a) => Math.tan(a),
  log: (a) => Math.log10(a),
  ln: (a) => Math.log(a),
  sqrt: (a) => { if (a < 0) throw new Error('Invalid input'); return Math.sqrt(a); },
};

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input');
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function evalRPN(rpn, mode) {
  const stack = [];
  for (const tok of rpn) {
    if (tok.error) return tok;
    if (tok.t === 'num') {
      stack.push(tok.v);
    } else if (tok.t === 'post') {
      const a = stack.pop();
      if (a === undefined) return { error: 'Syntax Error' };
      stack.push(factorial(a));
    } else if (tok.t === 'fn') {
      const a = stack.pop();
      if (a === undefined) return { error: 'Syntax Error' };
      try { stack.push(FUNCTIONS[tok.v](a)); } catch (e) { return { error: e.message }; }
    } else if (tok.t === 'unary') {
      const a = stack.pop();
      if (a === undefined) return { error: 'Syntax Error' };
      stack.push(-a);
    } else if (tok.t === 'op') {
      if (mode === 'binary' && (tok.v === 'and' || tok.v === 'or' || tok.v === 'xor')) {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) return { error: 'Syntax Error' };
        stack.push(BIN_OPS[tok.v](a, b));
      } else {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) return { error: 'Syntax Error' };
        try { stack.push(BIN_OPS[tok.v](a, b)); } catch (e) { return { error: e.message }; }
      }
    }
  }
  if (stack.length !== 1) return { error: 'Syntax Error' };
  return { value: stack[0] };
}

// ---------- evaluate ----------
function evaluate(expr, mode) {
  const tokens = tokenize(expr);
  if (tokens.error) return tokens;
  const rpn = toRPN(tokens);
  if (rpn.error) return rpn;
  return evalRPN(rpn, mode);
}

// ---------- history ----------
function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}

function addHistory(entry) {
  const h = getHistory();
  h.unshift(entry);
  if (h.length > MAX_HISTORY) h.length = MAX_HISTORY;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// ---------- format ----------
function formatResult(v) {
  if (v === undefined || v === null || (typeof v === 'number' && !isFinite(v))) return 'Error';
  if (typeof v === 'number') {
    if (Number.isInteger(v) && Math.abs(v) < 1e15) return String(v);
    const s = v.toPrecision(12);
    const n = parseFloat(s);
    return String(n);
  }
  return String(v);
}

function toBinary(v) {
  if (!Number.isInteger(v) || v < 0) return String(v);
  return (v >>> 0).toString(2);
}

// ---------- UI logic ----------
let currentMode = 'base';
let currentOrderLabel = 'BODMAS';
let preventInputLoop = false;

function insertAtCursor(input, text) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const before = input.value.substring(0, start);
  const after = input.value.substring(end);
  input.value = before + text + after;
  const pos = start + text.length;
  input.setSelectionRange(pos, pos);
  input.focus();
}

function calcBtnClick(text) {
  const input = document.getElementById('calcExpr');
  if (text === '=') { evaluateExpr(); return; }
  if (text === 'AC') { input.value = ''; updateResult(); input.focus(); return; }
  if (text === 'C') {
    const s = input.value;
    const pos = input.selectionStart;
    if (pos > 0) {
      input.value = s.substring(0, pos - 1) + s.substring(pos);
      input.setSelectionRange(pos - 1, pos - 1);
    }
    updateResult();
    input.focus();
    return;
  }
  if (text === 'CE') { input.value = ''; updateResult(); input.focus(); return; }
  insertAtCursor(input, text);
  updateResult();
}

function updateResult() {
  const input = document.getElementById('calcExpr');
  const display = document.getElementById('calcResult');
  const expr = input.value.trim();
  if (!expr) { display.textContent = ''; return; }
  const result = evaluate(expr, currentMode);
  let text;
  if (result.error) {
    text = result.error;
    display.className = 'calc-result text-danger';
  } else {
    text = '= ' + formatResult(result.value);
    if (currentMode === 'binary' && result.value !== undefined) {
      const bin = toBinary(result.value);
      if (bin !== text) text += '  (' + bin + ')';
    }
    display.className = 'calc-result';
  }
  display.textContent = text;
}

function evaluateExpr() {
  const input = document.getElementById('calcExpr');
  const expr = input.value.trim();
  if (!expr) return;
  const result = evaluate(expr, currentMode);
  if (result.error) {
    document.getElementById('calcResult').textContent = result.error;
    return;
  }
  addHistory({ expr, result: result.value, mode: currentMode });
  renderHistory();
  input.value = formatResult(result.value);
  document.getElementById('calcResult').textContent = '';
  input.focus();
}

function renderHistory() {
  const container = document.getElementById('calcHistory');
  const items = getHistory();
  if (!items.length) {
    container.innerHTML = '<div class="text-secondary-emphasis small text-center py-3">No history</div>';
    return;
  }
  container.innerHTML = items.map(e =>
    '<div class="history-item d-flex justify-content-between align-items-center px-3 py-2" data-expr="' +
    e.expr.replace(/"/g, '&quot;') + '">' +
    '<span class="small text-secondary-emphasis">' + escapeHtml(e.expr) + '</span>' +
    '<span class="fw-medium">= ' + formatResult(e.result) + '</span>' +
    '</div>'
  ).join('');
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function switchMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('baseControls').style.display = mode === 'base' ? '' : 'none';
  document.getElementById('sciControls').style.display = mode === 'scientific' ? '' : 'none';
  document.getElementById('binaryControls').style.display = mode === 'binary' ? '' : 'none';
  document.getElementById('opSection').style.display = mode === 'binary' ? 'none' : '';
  document.getElementById('calcExpr').value = '';
  document.getElementById('calcResult').textContent = '';
  document.getElementById('calcExpr').focus();
}

function switchOrder(label) {
  currentOrderLabel = label;
  document.getElementById('orderBtn').textContent = label;
  updateResult();
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('calcExpr');

  // keyboard handling
  input.addEventListener('input', () => { if (!preventInputLoop) updateResult(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); evaluateExpr(); }
  });

  // button clicks
  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => calcBtnClick(btn.dataset.value));
  });

  // mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  // order switcher
  const orderBtn = document.getElementById('orderBtn');
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      switchOrder(currentOrderLabel === 'BODMAS' ? 'PEMDAS' : 'BODMAS');
    });
  }

  // history click to restore expression
  document.getElementById('calcHistory').addEventListener('click', (e) => {
    const item = e.target.closest('.history-item');
    if (item) {
      input.value = item.dataset.expr;
      updateResult();
      input.focus();
    }
  });

  // clear history
  document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
    clearHistory();
    renderHistory();
  });

  renderHistory();
  input.focus();
});
