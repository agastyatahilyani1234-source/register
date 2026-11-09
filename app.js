(function () {
  'use strict';

  var KEY = 'examtracker.v1';
  var NON_STUDY = { break: 1, recall: 1 };

  // ---------- plan parsing ----------
  function parsePlan(text) {
    var days = [];
    var day = null;
    var week = null;
    text.split('\n').forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;
      var c = line.charAt(0);
      var rest = line.slice(1).split('|').map(function (s) { return s.trim(); });
      if (c === '@') { week = { title: rest[0], range: rest[1], note: rest[2] }; return; }
      if (c === '#') {
        day = { date: rest[0], label: rest[1], kind: rest[2], hours: rest[3], note: '', tip: '', items: [], week: week };
        days.push(day);
        return;
      }
      if (c === '!') { day.note = line.slice(1).trim(); return; }
      if (c === '~') { day.tip = line.slice(1).trim(); return; }
      var p = line.split('|').map(function (s) { return s.trim(); });
      var name = p[0];
      var min = parseInt(p[1], 10);
      var txt = p[2] || '';
      var type;
      if (/break$/i.test(name)) type = 'break';
      else if (name === 'Recall') { type = 'recall'; txt = "Yesterday's topics, no notes"; }
      else if (txt === 'practice') { type = 'practice'; txt = "Exam-style practice on today's topics"; }
      else if (txt === 'listen') { type = 'listen'; txt = 'Paper 2 listening practice (your own recordings, each played twice)'; }
      else type = 'topic';
      day.items.push({ id: day.date + ':' + day.items.length, name: name, min: min, text: txt, type: type });
    });
    return days;
  }

  var DAYS = parsePlan(PLAN_TEXT);

  // ---------- state ----------
  function loadState() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.done) return s;
    } catch (e) { /* storage unavailable */ }
    // Biology Topic 1 was already done when the plan was made.
    return { done: { '2026-11-09:0': true } };
  }
  var state = loadState();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function isDone(item) { return !!state.done[item.id]; }

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function toDate(iso) {
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function todayDate() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function isoOf(d) {
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function daysBetween(a, b) { return Math.round((b - a) / 864e5); }
  function fmt(min) {
    var h = Math.floor(min / 60);
    var m = min % 60;
    if (!h) return m + ' min';
    return m ? h + ' h ' + m + ' min' : h + ' h';
  }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
  function dayLabel(n) {
    if (n === 0) return 'today';
    if (n === 1) return '1 day';
    return n + ' days';
  }

  function dayStats(day) {
    var total = 0, done = 0, left = 0;
    day.items.forEach(function (it) {
      if (NON_STUDY[it.type]) { if (!isDone(it) && it.type === 'recall') left++; return; }
      total += it.min;
      if (isDone(it)) done += it.min; else left++;
    });
    var hasWork = day.items.some(function (it) { return it.type !== 'break'; });
    return { total: total, done: done, complete: hasWork && left === 0, hasWork: hasWork };
  }

  function currentDayIndex() {
    var iso = isoOf(todayDate());
    var idx = -1;
    DAYS.forEach(function (d, i) { if (d.date === iso) idx = i; });
    if (idx >= 0) return idx;
    return iso < DAYS[0].date ? 0 : DAYS.length - 1;
  }

  function streak() {
    var iso = isoOf(todayDate());
    var i = -1;
    DAYS.forEach(function (d, k) { if (d.date <= iso) i = k; });
    if (i < 0) return 0;
    var todayStats = DAYS[i].date === iso ? dayStats(DAYS[i]) : null;
    if (todayStats && todayStats.hasWork && !todayStats.complete) i--;
    var n = 0;
    for (; i >= 0; i--) {
      var s = dayStats(DAYS[i]);
      if (!s.hasWork) continue;
      if (!s.complete) break;
      n++;
    }
    return n;
  }

  function subjectNames() {
    var out = [];
    DAYS.forEach(function (d) {
      d.items.forEach(function (it) {
        if (it.type === 'break' || it.type === 'recall') return;
        if (out.indexOf(it.name) < 0) out.push(it.name);
      });
    });
    return out;
  }

  function examProgress(ex) {
    var total = 0, done = 0;
    DAYS.forEach(function (d) {
      d.items.forEach(function (it) {
        if (it.name !== ex.subject || NON_STUDY[it.type]) return;
        if (ex.only === 'listen') { if (it.type !== 'listen') return; }
        else if (ex.skip === 'listen' && it.type === 'listen') return;
        else if (ex.match && !(it.type === 'topic' && ex.match.test(it.text))) return;
        total += it.min;
        if (isDone(it)) done += it.min;
      });
    });
    return { total: total, done: done };
  }

  // ---------- views ----------
  var selected = currentDayIndex();
  var tab = 'today';
  var view = document.getElementById('view');

  function renderTop() {
    document.getElementById('streak-num').textContent = streak();
    var today = todayDate();
    var next = null;
    EXAMS.forEach(function (e) {
      if (!next && toDate(e.date) >= today) next = e;
    });
    var el = document.getElementById('next-exam');
    if (!next) { el.textContent = 'All exams are behind you.'; return; }
    var n = daysBetween(today, toDate(next.date));
    el.textContent = 'Next: ' + next.name + ' in ' + dayLabel(n);
  }

  function renderToday() {
    var day = DAYS[selected];
    var st = dayStats(day);
    var iso = isoOf(todayDate());
    var isToday = day.date === iso;
    var quote = QUOTES[(toDate(day.date).getDate() + toDate(day.date).getMonth() * 3) % QUOTES.length];

    var html = '<div class="daynav">' +
      '<button class="iconbtn" data-nav="-1" aria-label="Previous day"' + (selected === 0 ? ' disabled' : '') + '>&lsaquo;</button>' +
      '<div class="title"><h2>' + esc(day.label) + (isToday ? ' (today)' : '') + '</h2>' +
      '<p class="muted">' + esc(day.kind) + ' &middot; ' + esc(day.hours) + '</p></div>' +
      (isToday ? '' : '<button class="textbtn" data-nav="today">Today</button>') +
      '<button class="iconbtn" data-nav="1" aria-label="Next day"' + (selected === DAYS.length - 1 ? ' disabled' : '') + '>&rsaquo;</button>' +
      '</div>';

    if (day.note) {
      html += '<p class="note' + (/^Exams? /.test(day.note) ? ' exam' : ' muted') + '">' + esc(day.note) + '</p>';
    }
    if (day.tip) html += '<p class="note">' + esc(day.tip) + '</p>';

    if (st.hasWork) {
      html += '<div class="stat"><span>' + fmt(st.done) + ' of ' + fmt(st.total) + '</span><span>' + pct(st.done, st.total) + '%</span></div>' +
        '<div class="bar"><i style="width:' + pct(st.done, st.total) + '%"></i></div>';
      if (st.complete) {
        html += '<div class="banner">Day done. Close the books, and be in bed early.</div>';
      } else {
        html += '<div class="quote">' + esc(quote) + '</div>';
      }
      html += '<ul class="list">';
      day.items.forEach(function (it) {
        var cls = 'row ' + (it.type === 'break' ? 'break ' : '') + (isDone(it) ? 'done' : '');
        var tag = it.type === 'practice' ? '<span class="tag">practice</span>' : it.type === 'listen' ? '<span class="tag">listening</span>' : it.type === 'recall' ? '<span class="tag">recall</span>' : '';
        var name = it.type === 'recall' ? 'Recall' : it.name;
        html += '<li class="' + cls + '"><label><input type="checkbox" data-id="' + esc(it.id) + '"' + (isDone(it) ? ' checked' : '') + '>' +
          '<span class="txt"><span class="sub">' + esc(name) + '</span>' + tag +
          (it.text && it.type !== 'recall' ? '<br>' + esc(it.text) : it.type === 'recall' ? '<br>' + esc(it.text) : '') + '</span></label>' +
          '<span class="min">' + it.min + ' min</span></li>';
      });
      html += '</ul>';
    } else {
      html += '<div class="quote">No new topics. Use the time for past papers, Maths and the topics your practice slots showed were weak.</div>';
    }
    view.innerHTML = html;
  }

  function renderPlan() {
    var iso = isoOf(todayDate());
    var html = '';
    var lastWeek = null;
    DAYS.forEach(function (d, i) {
      if (d.week !== lastWeek) {
        lastWeek = d.week;
        html += '<div class="week"><h2>' + esc(d.week.title) + '</h2><p class="muted">' + esc(d.week.range) + ' &middot; ' + esc(d.week.note) + '</p></div>';
      }
      var st = dayStats(d);
      var p = st.hasWork ? pct(st.done, st.total) + '%' : '';
      html += '<button class="dayrow' + (d.date === iso ? ' today' : '') + (st.complete ? ' full' : '') + '" data-day="' + i + '">' +
        '<span class="d">' + esc(d.label) + '</span><span class="k">' + esc(d.kind) + ' &middot; ' + esc(d.hours) + '</span><span class="p">' + p + '</span></button>';
    });
    html += '<details><summary>Rules for every day</summary><ol>' +
      RULES.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ol></details>';
    view.innerHTML = html;
  }

  function renderExams() {
    var today = todayDate();
    var html = '<h2 style="margin-top:0">Exam countdown</h2>';
    EXAMS.slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; }).forEach(function (e) {
      var n = daysBetween(today, toDate(e.date));
      var past = n < 0;
      var meta = toDate(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      if (e.doneBy) {
        var m = daysBetween(today, toDate(e.doneBy));
        meta += ' &middot; done by ' + toDate(e.doneBy).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) +
          (m >= 0 ? ' (' + dayLabel(m) + ' left)' : '') + ' &middot; planned ' + esc(e.planned) + ', ' + e.spare + ' spare';
      } else if (!e.subject) {
        meta += ' &middot; not in this plan';
      }
      html += '<div class="card' + (past ? ' past' : '') + '"><div class="head"><span class="name">' + esc(e.name) + '</span>' +
        '<span class="days">' + (past ? 'done' : dayLabel(n)) + '</span></div><p class="muted meta">' + meta + '</p>';
      if (e.subject) {
        var pr = examProgress(e);
        html += '<div class="bar"><i style="width:' + pct(pr.done, pr.total) + '%"></i></div>' +
          '<p class="muted" style="margin-top:6px">Syllabus ' + pct(pr.done, pr.total) + '% (' + fmt(pr.done) + ' of ' + fmt(pr.total) + ')</p>';
      }
      html += '</div>';
    });
    view.innerHTML = html;
  }

  function renderProgress() {
    var total = 0, done = 0, daysDone = 0, daysTotal = 0;
    var bySub = {};
    DAYS.forEach(function (d) {
      var st = dayStats(d);
      if (st.hasWork) { daysTotal++; if (st.complete) daysDone++; }
      d.items.forEach(function (it) {
        if (NON_STUDY[it.type]) return;
        var s = bySub[it.name] || (bySub[it.name] = { total: 0, done: 0 });
        s.total += it.min;
        total += it.min;
        if (isDone(it)) { s.done += it.min; done += it.min; }
      });
    });
    var html = '<h2 style="margin-top:0">Overall</h2>' +
      '<div class="stat"><span class="big">' + pct(done, total) + '%</span><span class="muted" style="align-self:flex-end">' + fmt(done) + ' of ' + fmt(total) + '</span></div>' +
      '<div class="bar"><i style="width:' + pct(done, total) + '%"></i></div>' +
      '<div class="grid"><div class="card"><div class="big">' + daysDone + '/' + daysTotal + '</div><p class="muted">days completed</p></div>' +
      '<div class="card"><div class="big">' + streak() + '</div><p class="muted">day streak</p></div></div>' +
      '<h2>By subject</h2>';
    subjectNames().forEach(function (n) {
      var s = bySub[n];
      html += '<div class="card"><div class="head"><span class="name">' + esc(n) + '</span><span class="muted">' + pct(s.done, s.total) + '%</span></div>' +
        '<div class="bar" style="margin-top:8px"><i style="width:' + pct(s.done, s.total) + '%"></i></div>' +
        '<p class="muted" style="margin-top:6px">' + fmt(s.done) + ' of ' + fmt(s.total) + '</p></div>';
    });
    view.innerHTML = html;
  }

  function render() {
    var y = window.scrollY;
    if (tab === 'today') renderToday();
    else if (tab === 'plan') renderPlan();
    else if (tab === 'exams') renderExams();
    else renderProgress();
    renderTop();
    window.scrollTo(0, y);
  }

  // ---------- events ----------
  document.getElementById('tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    tab = b.getAttribute('data-tab');
    Array.prototype.forEach.call(this.children, function (c) { c.classList.toggle('on', c === b); });
    window.scrollTo(0, 0);
    render();
  });

  view.addEventListener('change', function (e) {
    var id = e.target.getAttribute('data-id');
    if (!id) return;
    if (e.target.checked) state.done[id] = true; else delete state.done[id];
    save();
    render();
  });

  view.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-nav]');
    if (nav) {
      var v = nav.getAttribute('data-nav');
      selected = v === 'today' ? currentDayIndex() : Math.max(0, Math.min(DAYS.length - 1, selected + parseInt(v, 10)));
      render();
      return;
    }
    var row = e.target.closest('[data-day]');
    if (row) {
      selected = parseInt(row.getAttribute('data-day'), 10);
      tab = 'today';
      Array.prototype.forEach.call(document.getElementById('tabs').children, function (c) {
        c.classList.toggle('on', c.getAttribute('data-tab') === 'today');
      });
      window.scrollTo(0, 0);
      render();
    }
  });

  render();
})();
