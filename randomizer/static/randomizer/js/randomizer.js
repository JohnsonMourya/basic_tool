// ---------- state ----------
let mode = 'number';
let pickerMode = 'shuffle';

// ---------- helpers ----------
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getItems() {
  const raw = document.getElementById('pickerInput').value;
  return raw.split(',').map(s => s.trim().replace(/-/g, ' ')).filter(Boolean);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ---------- show/hide sections ----------
function showSection(id) {
  document.querySelectorAll('.mode-section, .picker-section').forEach(el => el.classList.add('d-none'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('d-none');
}

// ---------- mode switching ----------
function switchMode(m) {
  mode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  showSection('section-' + m);
}

function switchPicker(pm) {
  pickerMode = pm;
  document.querySelectorAll('.picker-btn').forEach(b => b.classList.toggle('active', b.dataset.picker === pm));
  document.querySelectorAll('.picker-section').forEach(el => el.classList.add('d-none'));
  document.getElementById('picker-' + pm).classList.remove('d-none');
  document.getElementById('pickerResult').innerHTML = '';
}

// ---------- number picker ----------
document.getElementById('pickNumberBtn').addEventListener('click', () => {
  const min = parseInt(document.getElementById('numMin').value);
  const max = parseInt(document.getElementById('numMax').value);
  const result = document.getElementById('numResult');

  if (isNaN(min) || isNaN(max)) { result.textContent = 'Enter both numbers'; return; }
  if (min > max) { result.textContent = 'Min must be ≤ Max'; return; }

  result.textContent = rand(min, max);
});

// enter key triggers pick
document.getElementById('numMax').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('pickNumberBtn').click();
});

// ---------- coin flip ----------
document.getElementById('flipBtn').addEventListener('click', () => {
  const coin = document.getElementById('coin');
  const result = document.getElementById('coinResult');
  const side = pick(['heads', 'tails']);

  coin.classList.remove('flip-anim');
  void coin.offsetWidth; // force reflow to restart animation
  coin.classList.add('flip-anim');

  setTimeout(() => {
    coin.textContent = side === 'heads' ? 'H' : 'T';
    coin.style.backgroundColor = side === 'heads' ? '#ffc107' : '#6c757d';
    coin.style.color = '#fff';
    result.textContent = side.charAt(0).toUpperCase() + side.slice(1);
  }, 600);
});

// ---------- picker input info ----------
function countItems() {
  const items = getItems();
  const info = document.getElementById('itemCount');
  info.textContent = items.length + ' item' + (items.length !== 1 ? 's' : '');
}

document.getElementById('pickerInput').addEventListener('input', countItems);

// ---------- shuffle ----------
document.getElementById('shuffleBtn').addEventListener('click', () => {
  const items = getItems();
  if (items.length < 2) { document.getElementById('pickerResult').innerHTML = '<div class="text-secondary-emphasis small mt-2">Add at least 2 items</div>'; return; }
  const shuffled = shuffle(items);
  document.getElementById('pickerResult').innerHTML =
    '<div class="fw-medium mb-1 small text-secondary-emphasis">Shuffled order</div>' +
    shuffled.map(s => '<div class="py-1 px-3 border-bottom border-opacity-10 small">' + s + '</div>').join('');
});

// ---------- spin wheel ----------
document.getElementById('spinBtn').addEventListener('click', async () => {
  const items = getItems();
  if (items.length < 2) { document.getElementById('pickerResult').innerHTML = '<div class="text-secondary-emphasis small mt-2">Add at least 2 items</div>'; return; }

  const resultDiv = document.getElementById('pickerResult');
  resultDiv.innerHTML = '<div class="fw-medium mb-2 small text-secondary-emphasis">Spinning...</div>' +
    items.map((s, i) => '<div class="spin-item py-1 px-3 border-bottom border-opacity-10 small" data-idx="' + i + '">' + s + '</div>').join('');

  const spinItems = resultDiv.querySelectorAll('.spin-item');
  let current = 0;
  const rounds = rand(3, 6);
  const totalSteps = rounds * items.length + rand(0, items.length - 1);

  for (let step = 0; step <= totalSteps; step++) {
    spinItems.forEach(el => el.classList.remove('highlight'));
    spinItems[current].classList.add('highlight');
    const delay = 50 + (step / totalSteps) * 200;
    await sleep(delay);
    current = (current + 1) % items.length;
  }

  const winner = items[(current - 1 + items.length) % items.length];
  resultDiv.innerHTML = '<div class="fw-medium mb-1 small text-secondary-emphasis">Winner</div>' +
    '<div class="fs-4 fw-bold py-2">' + winner + '</div>';
});

// ---------- button bindings ----------
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});
document.querySelectorAll('.picker-btn').forEach(btn => {
  btn.addEventListener('click', () => switchPicker(btn.dataset.picker));
});

// ---------- drop lottery ----------
document.getElementById('dropBtn').addEventListener('click', async () => {
  const items = getItems();
  if (items.length < 2) { document.getElementById('pickerResult').innerHTML = '<div class="text-secondary-emphasis small mt-2">Add at least 2 items</div>'; return; }

  let pool = shuffle(items);
  const resultDiv = document.getElementById('pickerResult');
  resultDiv.innerHTML = '<div class="fw-medium mb-2 small text-secondary-emphasis">Dropping...</div>';

  function renderPool() {
    resultDiv.innerHTML = '<div class="fw-medium mb-2 small text-secondary-emphasis">Dropping...</div>' +
      pool.map((s, i) => '<div class="drop-item py-1 px-3 border-bottom border-opacity-10 small" data-idx="' + i + '">' + s + '</div>').join('');
  }

  renderPool();

  while (pool.length > 1) {
    await sleep(300);
    // remove one random item
    const removeIdx = rand(0, pool.length - 1);
    pool = pool.filter((_, i) => i !== removeIdx);
    renderPool();
  }

  await sleep(400);
  resultDiv.innerHTML = '<div class="fw-medium mb-1 small text-secondary-emphasis">Last one standing</div>' +
    '<div class="fs-4 fw-bold py-2">' + pool[0] + '</div>';
});
