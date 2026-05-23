let interval = null;
let remaining = 0;
let running = false;

// ---------- utils ----------
const feelGoods = [
  'Great focus session!',
  'You crushed that sprint!',
  'Productivity level: awesome!',
  'One pomodoro closer to done!',
  'Nice work — keep it up!',
  'You are on fire today!',
  'Another block crushed!',
  'Laser focus achieved!',
];

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showDoneModal(title, msg, icon) {
  document.getElementById('doneIcon').textContent = icon || '⏰';
  document.getElementById('doneTitle').textContent = title;
  document.getElementById('doneMsg').textContent = msg || '';
  const modal = new bootstrap.Modal(document.getElementById('doneModal'));
  modal.show();
}

// ---------- timer state ----------
function timerTick() {
  remaining = Math.max(0, remaining - 10);
  const done = remaining <= 0;
  renderTime();
  if (done) {
    stop();
    beep();
    showDoneModal("Time's up!", '', '⏰');
  }
}

function formatTime(ms) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n, w) => String(n).padStart(w, '0');
  return (h > 0 ? pad(h, 2) + ':' : '') + pad(m, 2) + ':' + pad(s, 2);
}

// ---------- pomodoro state ----------
let pomoPhase = 'work'; // work | short | long
let pomoCount = 0; // completed work sessions
let pomoRunning = false;

// ---------- UI refs ----------
const display = document.getElementById('timerDisplay');
const timerSection = document.getElementById('timerSection');
const pomoSec = document.getElementById('pomoSection');
const pauseBtn = document.getElementById('pauseBtn');
const statusEl = document.getElementById('pomoStatus');
const countEl = document.getElementById('pomoCount');
const phaseEl = document.getElementById('pomoPhaseLabel');

// ---------- switch mode ----------
function switchMode(mode) {
  stop();
  timerSection.classList.toggle('d-none', mode !== 'timer');
  pomoSec.classList.toggle('d-none', mode !== 'pomo');
  document.querySelectorAll('.tm-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.tmMode === mode));
  if (mode === 'timer') resetTimer();
  if (mode === 'pomo') resetPomo();
}

// ---------- timer ----------
function startTimer() {
  const h = parseInt(document.getElementById('hrs').value) || 0;
  const m = parseInt(document.getElementById('mins').value) || 0;
  const s = parseInt(document.getElementById('secs').value) || 0;
  const total = (h * 3600 + m * 60 + s) * 1000;
  if (total <= 0) return;

  if (!running && remaining === 0) remaining = total;
  if (remaining <= 0) return;

  running = true;
  interval = setInterval(timerTick, 10);
  pauseBtn.textContent = 'Pause';
  pauseBtn.classList.remove('btn-success');
  pauseBtn.classList.add('btn-warning');
  document.getElementById('startBtn').disabled = true;
}

function stop() {
  running = false;
  if (interval) { clearInterval(interval); interval = null; }
  pauseBtn.textContent = 'Resume';
  pauseBtn.classList.remove('btn-warning');
  pauseBtn.classList.add('btn-success');
  document.getElementById('startBtn').disabled = false;
}

function resetTimer() {
  stop();
  remaining = 0;
  renderTime();
}

function renderTime() {
  display.textContent = formatTime(remaining);
}

document.getElementById('startBtn').addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => {
  if (running) stop(); else startTimer();
});
document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.querySelectorAll('.timer-input').forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') startTimer(); });
  inp.addEventListener('input', () => {
    if (!running) {
      const h = parseInt(document.getElementById('hrs').value) || 0;
      const m = parseInt(document.getElementById('mins').value) || 0;
      const s = parseInt(document.getElementById('secs').value) || 0;
      remaining = (h * 3600 + m * 60 + s) * 1000;
      renderTime();
    }
  });
});

// ---------- pomodoro ----------
function getPomoTimes() {
  return {
    work: (parseInt(document.getElementById('pomoWork').value) || 25) * 60000,
    short: (parseInt(document.getElementById('pomoShort').value) || 5) * 60000,
    long: (parseInt(document.getElementById('pomoLong').value) || 15) * 60000,
  };
}

function startPomo() {
  if (pomoRunning) return;
  if (remaining <= 0) {
    const t = getPomoTimes();
    remaining = t[pomoPhase];
  }
  running = true;
  pomoRunning = true;
  interval = setInterval(pomoTick, 10);
  document.getElementById('pomoStartBtn').textContent = 'Running...';
  document.getElementById('pomoStartBtn').disabled = true;
  document.getElementById('pomoPauseBtn').textContent = 'Pause';
  document.getElementById('pomoPauseBtn').classList.remove('btn-success');
  document.getElementById('pomoPauseBtn').classList.add('btn-warning');
}

function pomoTick() {
  remaining = Math.max(0, remaining - 10);
  renderTime();
  if (remaining <= 0) {
    beep();
    if (pomoPhase === 'work') {
      const msg = pick(feelGoods) + ' Time for a ' + (pomoCount % 4 === 3 ? 'long' : 'short') + ' break.';
      showDoneModal('Pomodoro Complete!', msg, '🎉');
    } else {
      showDoneModal('Break Over!', 'Back to focus.', '⏳');
    }
    pomoRunning = false;
    running = false;
    if (interval) { clearInterval(interval); interval = null; }
    advancePomo();
  }
}

function advancePomo() {
  const t = getPomoTimes();
  if (pomoPhase === 'work') {
    pomoCount++;
    pomoPhase = (pomoCount % 4 === 0) ? 'long' : 'short';
  } else {
    pomoPhase = 'work';
  }
  remaining = t[pomoPhase];
  renderTime();
  updatePomoUI();
  // auto-start next phase
  pomoRunning = false;
  running = false;
  document.getElementById('pomoStartBtn').textContent = 'Start';
  document.getElementById('pomoStartBtn').disabled = false;
  // brief delay then auto-start
  setTimeout(() => startPomo(), 500);
}

function pausePomo() {
  if (interval) { clearInterval(interval); interval = null; }
  running = false;
  pomoRunning = false;
  document.getElementById('pomoStartBtn').textContent = 'Resume';
  document.getElementById('pomoStartBtn').disabled = false;
  document.getElementById('pomoPauseBtn').textContent = 'Pause';
  document.getElementById('pomoPauseBtn').classList.remove('btn-warning');
  document.getElementById('pomoPauseBtn').classList.add('btn-success');
}

function resetPomo() {
  if (interval) { clearInterval(interval); interval = null; }
  running = false;
  pomoRunning = false;
  pomoPhase = 'work';
  pomoCount = 0;
  const t = getPomoTimes();
  remaining = t.work;
  renderTime();
  updatePomoUI();
  document.getElementById('pomoStartBtn').textContent = 'Start';
  document.getElementById('pomoStartBtn').disabled = false;
  document.getElementById('pomoPauseBtn').textContent = 'Pause';
  document.getElementById('pomoPauseBtn').classList.remove('btn-warning');
  document.getElementById('pomoPauseBtn').classList.add('btn-success');
}

function updatePomoUI() {
  const phases = { work: 'Work', short: 'Short Break', long: 'Long Break' };
  phaseEl.textContent = phases[pomoPhase] || 'Work';
  phaseEl.className = 'badge ' + (pomoPhase === 'work' ? 'bg-danger' : 'bg-success');
  countEl.textContent = pomoCount + ' / 4';
  statusEl.textContent = pomoPhase === 'work' ? 'Focus' : 'Break';
  statusEl.className = 'fw-bold ' + (pomoPhase === 'work' ? 'text-danger' : 'text-success');
}

document.getElementById('pomoStartBtn').addEventListener('click', startPomo);
document.getElementById('pomoPauseBtn').addEventListener('click', () => {
  if (running) pausePomo(); else startPomo();
});
document.getElementById('pomoResetBtn').addEventListener('click', resetPomo);

document.querySelectorAll('.pomo-input').forEach(inp => {
  inp.addEventListener('change', () => {
    if (!pomoRunning) resetPomo();
  });
});

// ---------- init ----------
document.querySelectorAll('.tm-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => switchMode(btn.dataset.tmMode));
});
switchMode('timer');
