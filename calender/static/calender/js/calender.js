let curYear, curMonth;
let selectedDate = null;
const today = new Date();
const todayStr = dateStr(today);

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function dateStr(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }

function populateYearSelect() {
  const sel = document.getElementById('calYear');
  const base = today.getFullYear();
  sel.innerHTML = '';
  for (let y = base - 25; y <= base + 25; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    sel.appendChild(opt);
  }
}

function render() {
  document.getElementById('calMonth').textContent = monthNames[curMonth];
  document.getElementById('calYear').value = curYear;

  const grid = document.getElementById('calGrid');
  const first = new Date(curYear, curMonth, 1).getDay();
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

  let html = '';
  dayNames.forEach(d => { html += '<div class="cal-weekday">' + d + '</div>'; });

  for (let i = 0; i < first; i++) html += '<div></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = curYear + '-' + String(curMonth+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    const isToday = ds === todayStr;
    html += '<div class="cal-day' + (isToday ? ' cal-today' : '') + '" data-date="' + ds + '">' +
      '<span class="cal-day-num">' + d + '</span></div>';
  }

  grid.innerHTML = html;

  if (selectedDate) {
    const el = grid.querySelector('[data-date="' + selectedDate + '"]');
    if (el) el.classList.add('cal-selected');
  }
}

function loadEvents(dateStr) {
  const container = document.getElementById('eventsContainer');
  const list = document.getElementById('eventsList');
  const header = document.getElementById('eventsHeader');
  const parts = dateStr.split('-');
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  header.textContent = dateStr;
  list.innerHTML = '<div class="text-secondary-emphasis small py-2">Loading...</div>';
  container.classList.remove('d-none');

  fetch('https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/' + month + '/' + day)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      const events = data.events || [];
      if (!events.length) {
        list.innerHTML = '<div class="text-secondary-emphasis small py-2">No major events found for this day.</div>';
        return;
      }
      list.innerHTML = events.slice(0, 6).map(e => {
        const url = e.pages && e.pages[0] && e.pages[0].content_urls && e.pages[0].content_urls.desktop
          ? e.pages[0].content_urls.desktop.page : null;
        return '<div class="event-row">' +
          '<span class="event-year">' + e.year + '</span>' +
          '<span class="event-text">' + e.text.replace(/`([^`]+)`/g, '<i>$1</i>') + '</span>' +
          (url ? '<a href="' + url + '" target="_blank" class="event-link" title="Wikipedia">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/></svg>' +
            '</a>' : '') +
          '</div>';
      }).join('');
    })
    .catch(() => {
      list.innerHTML = '<div class="text-secondary-emphasis small py-2">Could not load historical events.</div>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  curYear = today.getFullYear();
  curMonth = today.getMonth();
  selectedDate = todayStr;
  populateYearSelect();
  render();
  loadEvents(todayStr);

  function navigateTo(y, m) {
    curYear = y;
    curMonth = m;
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    const oldDay = selectedDate ? parseInt(selectedDate.split('-')[2]) : today.getDate();
    const day = Math.min(oldDay, daysInMonth);
    const ds = curYear + '-' + String(curMonth+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
    document.getElementById('calYear').value = curYear;
    selectedDate = ds;
    render();
    loadEvents(ds);
  }

  document.getElementById('prevBtn').addEventListener('click', () => {
    let y = curYear, m = curMonth - 1;
    if (m < 0) { m = 11; y--; }
    navigateTo(y, m);
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    let y = curYear, m = curMonth + 1;
    if (m > 11) { m = 0; y++; }
    navigateTo(y, m);
  });

  document.getElementById('todayBtn').addEventListener('click', () => {
    navigateTo(today.getFullYear(), today.getMonth());
  });

  document.getElementById('calYear').addEventListener('change', function() {
    navigateTo(parseInt(this.value), curMonth);
  });

  document.getElementById('calGrid').addEventListener('click', e => {
    const day = e.target.closest('.cal-day');
    if (!day) return;
    selectedDate = day.dataset.date;
    document.querySelectorAll('.cal-day.cal-selected').forEach(el => el.classList.remove('cal-selected'));
    day.classList.add('cal-selected');
    loadEvents(selectedDate);
  });
});
