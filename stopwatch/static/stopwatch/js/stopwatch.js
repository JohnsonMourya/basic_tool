const LAPS_KEY = 'stopwatch_laps';
const ELAPSED_KEY = 'stopwatch_elapsed';

let elapsed = 0;
let running = false;
let interval = null;
let laps = [];
let lastLapTime = 0;

const display = document.getElementById('timeDisplay');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
// const addBtn = document.getElementById('addMinBtn');
// const subBtn = document.getElementById('subMinBtn');
const lapBtn = document.getElementById('lapBtn');
const lapList = document.getElementById('lapList');
const lapSection = document.getElementById('lapSection');
const clearLapsBtn = document.getElementById('clearLapsBtn');

function formatTime(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  const pad = (n, w) => String(n).padStart(w, '0');
  return pad(min, 2) + ':' + pad(sec, 2) + '.' + pad(cs, 2);
}

function updateDisplay() {
  display.textContent = formatTime(elapsed);
}

function saveLaps() {
  localStorage.setItem(LAPS_KEY, JSON.stringify(laps));
}

function loadLaps() {
  try {
    const saved = localStorage.getItem(LAPS_KEY);
    if (saved) {
      laps = JSON.parse(saved);
      if (laps.length) {
        lastLapTime = laps[laps.length - 1].totalTime;
        lapSection.classList.remove('d-none');
        renderLaps();
      }
    }
  } catch {}
}

function tick() {
  elapsed += 10;
  updateDisplay();
}

function start() {
  if (interval) return;
  running = true;
  interval = setInterval(tick, 10);
  playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
  playBtn.classList.remove('btn-success');
  playBtn.classList.add('btn-warning');
  playBtn.title = 'Pause';
  lapBtn.disabled = false;
}

function pause() {
  running = false;
  if (interval) { clearInterval(interval); interval = null; }
  playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
  playBtn.classList.remove('btn-warning');
  playBtn.classList.add('btn-success');
  playBtn.title = 'Start';
  lapBtn.disabled = true;
}

function reset() {
  elapsed = 0;
  laps = [];
  lastLapTime = 0;
  localStorage.removeItem(LAPS_KEY);
  updateDisplay();
  renderLaps();
  lapSection.classList.add('d-none');
}

// function addMinute() {
//   elapsed += 60000;
//   updateDisplay();
// }
//
// function subMinute() {
//   elapsed = Math.max(0, elapsed - 60000);
//   updateDisplay();
// }

function recordLap() {
  const lapTime = elapsed - lastLapTime;
  laps.push({ lap: laps.length + 1, lapTime, totalTime: elapsed });
  lastLapTime = elapsed;
  saveLaps();
  lapSection.classList.remove('d-none');
  renderLaps();
}

function clearLaps() {
  laps = [];
  lastLapTime = 0;
  localStorage.removeItem(LAPS_KEY);
  lapSection.classList.add('d-none');
  renderLaps();
}

function renderLaps() {
  if (!laps.length) return;
  lapList.innerHTML = laps.map(l =>
    '<div class="d-flex justify-content-between px-4 py-1 small border-bottom border-opacity-10">' +
    '<span class="text-secondary-emphasis">Lap ' + l.lap + '</span>' +
    '<span class="font-monospace">' + formatTime(l.lapTime) + '</span>' +
    '<span class="font-monospace text-secondary-emphasis">' + formatTime(l.totalTime) + '</span>' +
    '</div>'
  ).join('');
}

loadLaps();
updateDisplay();

playBtn.addEventListener('click', () => {
  if (running) pause(); else start();
});

stopBtn.addEventListener('click', () => {
  pause();
  reset();
});

resetBtn.addEventListener('click', reset);
// addBtn.addEventListener('click', addMinute);
// subBtn.addEventListener('click', subMinute);
lapBtn.addEventListener('click', recordLap);
clearLapsBtn.addEventListener('click', clearLaps);
