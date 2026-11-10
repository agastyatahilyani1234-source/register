(function () {
  'use strict';

  var KEY = 'examtracker.v1';
  var NON_STUDY = { break: 1, recall: 1 };
  var LAST_DAY = '2026-12-06';
  // Most extra catch-up minutes a day can take on top of its own plan.
  var CAP = { 'Diwali sprint': 90, 'Light day': 45, 'School day': 30, 'Weekend': 120, 'Study day': 120 };

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
        day = { date: rest[0], label: rest[1], kind: rest[2], note: '', tip: '', items: [], week: week };
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

  // Put the two daily Maths slots right after the recall block of each day.
  function addMaths(days) {
    days.forEach(function (d) {
      var slots = [];
      [['add', 'ma'], ['intl', 'mi']].forEach(function (pair) {
        var m = MATHS[pair[0]];
        var idx = -1, k = 0;
        days.forEach(function (x) {
          if (!CAP[x.kind] || x.date < m.from || x.date > m.to) return;
          if (x.date === d.date) idx = k;
          k++;
        });
        if (idx >= 0) {
          slots.push({ id: d.date + ':' + pair[1], name: m.name, min: (d.kind === 'School day' && m.school) ? m.school : m.min, text: '', type: 'topic' });
        }
      });
      if (!slots.length) return;
      slots.push({ id: d.date + ':mb', name: 'Break', min: 15, text: '', type: 'break' });
      var at = d.items.length && d.items[0].type === 'recall' ? 1 : 0;
      Array.prototype.splice.apply(d.items, [at, 0].concat(slots));
    });
  }

  var DAYS = parsePlan(PLAN_TEXT);
  addMaths(DAYS);
  var DAY_BY_DATE = {};
  var ITEM_BY_ID = {};
  DAYS.forEach(function (d) {
    DAY_BY_DATE[d.date] = d;
    d.items.forEach(function (it) {
      it.o = { name: it.name, min: it.min, text: it.text };
      ITEM_BY_ID[it.id] = it;
    });
  });

  // ---------- state ----------
  function loadState() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* storage unavailable */ }
    if (!s || !s.done) s = { done: { '2026-11-09:0': true } }; // Biology Topic 1 was already done
    return normalize(s);
  }
  function normalize(s) {
    s.dropped = s.dropped || {};
    s.deferred = s.deferred || {};
    s.clearBy = s.clearBy || {};
    s.assign = s.assign || {};
    s.pin = s.pin || {};
    s.edits = s.edits || {};
    return s;
  }
  var state = loadState();
  var hist = [];
  var menu = null;

  // Every change goes through mutate so the Undo button can step back.
  function mutate(label, fn) {
    hist.push({ label: label, snap: JSON.stringify(state) });
    if (hist.length > 60) hist.shift();
    fn();
    save();
    render();
  }
  function applyEdits() {
    Object.keys(ITEM_BY_ID).forEach(function (id) {
      var it = ITEM_BY_ID[id];
      var e = state.edits[id] || {};
      it.name = e.name != null ? e.name : it.o.name;
      it.text = e.text != null ? e.text : it.o.text;
      it.min = e.min != null ? e.min : it.o.min;
    });
  }
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
    if (window.__TODAY) return toDate(window.__TODAY); // test hook
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function isoOf(d) {
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function addDays(iso, n) {
    var d = toDate(iso);
    return isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
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
  function shortDate(iso) {
    return toDate(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // ---------- moves made by hand ----------
  function origDate(it) { return it.id.split(':')[0]; }
  // The day you moved an item to, if that is still a valid later day.
  function pinDate(it, day) {
    var p = state.pin[it.id];
    var T = isoOf(todayDate());
    return p && p >= T && p !== day.date && DAY_BY_DATE[p] ? p : null;
  }
  // Moved off its own day by you or by "move the rest of today".
  function shifted(it, day) { return !!state.deferred[it.id] || !!pinDate(it, day); }
  function effectiveDate(it) { return SCHED.moved[it.id] || origDate(it); }
  function itemsOnDay(date) {
    var d = DAY_BY_DATE[date];
    var out = [];
    if (d) d.items.forEach(function (it) {
      if (NON_STUDY[it.type] || isDone(it) || (SCHED.moved[it.id] && SCHED.moved[it.id] !== date)) return;
      out.push(it);
    });
    (SCHED.byDay[date] || []).forEach(function (e) { if (!isDone(e.it)) out.push(e.it); });
    return out;
  }
  function setPin(it, date) {
    if (date < isoOf(todayDate())) return;
    if (origDate(it) === date) delete state.pin[it.id]; else state.pin[it.id] = date;
    delete state.deferred[it.id];
    delete state.assign[it.id];
  }

  // ---------- catch-up engine ----------
  function accepts(ex, it) {
    if (ex.only === 'listen') return it.type === 'listen';
    if (ex.skip === 'listen' && it.type === 'listen') return false;
    if (ex.match && it.type === 'topic') return ex.match.test(it.text);
    return true;
  }

  // Last day an item may be done, from the exam table (3 days before the paper for topics).
  function deadlineOf(it, origIso) {
    var c = EXAMS.filter(function (e) { return e.subject === it.name && accepts(e, it); })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (!c.length) return LAST_DAY;
    var ex;
    if (/^Past paper/.test(it.text)) {
      ex = c.filter(function (e) { return e.date > origIso; })[0] || c[c.length - 1];
      return addDays(ex.date, -1);
    }
    ex = c.filter(function (e) { return e.doneBy && e.doneBy >= origIso; })[0] ||
      c.filter(function (e) { return e.date > origIso; })[0] || c[c.length - 1];
    return ex.doneBy || addDays(ex.date, -1);
  }

  // Moves every missed item to a later day. Rules:
  // 1. Never past the item's Done by date.
  // 2. Spread across days, least loaded first, so no day is doubled up.
  // 3. Each day takes only a capped amount of extra work.
  // 4. Every item is promised a clear-by date: 5 days after it was first missed
  //    for a small backlog (up to 5 h), 7 days for a larger one.
  function buildSchedule() {
    var T = isoOf(todayDate());
    var s = { moved: {}, byDay: {}, extra: {}, overdue: [], total: 0, clearBy: null, overMin: 0, unplaced: [] };
    var capDays = DAYS.filter(function (d) { return d.date >= T && CAP[d.kind]; });
    capDays.forEach(function (d) { s.extra[d.date] = 0; });

    function minDateOf(id) {
      var dd = state.deferred[id];
      var m = dd ? addDays(dd, 1) : T;
      return m > T ? m : T;
    }
    DAYS.forEach(function (d) {
      d.items.forEach(function (it) {
        if (NON_STUDY[it.type] || isDone(it) || state.dropped[it.id]) return;
        var pd = pinDate(it, d);
        if (pd) {
          (s.byDay[pd] = s.byDay[pd] || []).push({ it: it, from: d, pinned: true });
          s.moved[it.id] = pd;
          if (s.extra[pd] != null) s.extra[pd] += it.min;
          return;
        }
        if (d.date >= T && !state.deferred[it.id]) return;
        s.overdue.push({ it: it, from: d, minDate: minDateOf(it.id) });
        s.total += it.min;
      });
    });

    var windowDays = s.total <= 300 ? 4 : 6;
    s.overdue.forEach(function (e) {
      if (!state.clearBy[e.it.id]) state.clearBy[e.it.id] = addDays(T, windowDays);
    });

    function place(e, d) {
      s.moved[e.it.id] = d.date;
      (s.byDay[d.date] = s.byDay[d.date] || []).push(e);
      s.extra[d.date] += e.it.min;
      state.assign[e.it.id] = d.date;
      if (!s.clearBy || d.date > s.clearBy) s.clearBy = d.date;
    }

    // Keep earlier placements that are still valid so ticking a box does not shuffle the plan.
    var fresh = [];
    s.overdue.forEach(function (e) {
      var a = state.assign[e.it.id];
      var d = a && a >= e.minDate && capDays.filter(function (x) { return x.date === a; })[0];
      if (d) place(e, d); else fresh.push(e);
    });

    fresh.forEach(function (e) {
      var dl = deadlineOf(e.it, e.from.date);
      var cb = state.clearBy[e.it.id];
      e.dl = cb < dl ? cb : dl;
    });
    fresh.sort(function (a, b) {
      return a.dl < b.dl ? -1 : a.dl > b.dl ? 1 : (a.from.date < b.from.date ? -1 : a.from.date > b.from.date ? 1 : 0);
    });
    fresh.forEach(function (e) {
      var later = capDays.filter(function (d) { return d.date >= e.minDate; });
      var elig = later.filter(function (d) { return d.date <= e.dl; });
      if (!elig.length) elig = later.slice(0, 1);
      if (!elig.length) { s.unplaced.push(e); return; }
      var fits = elig.filter(function (d) { return s.extra[d.date] + e.it.min <= CAP[d.kind]; });
      var pool = fits.length ? fits : elig;
      var best = pool[0];
      pool.forEach(function (d) {
        var r = (s.extra[d.date] + e.it.min) / CAP[d.kind];
        var rb = (s.extra[best.date] + e.it.min) / CAP[best.kind];
        if (r < rb) best = d;
      });
      if (!fits.length) s.overMin += e.it.min;
      place(e, best);
    });

    Object.keys(s.byDay).forEach(function (k) {
      s.byDay[k].sort(function (a, b) { return a.from.date < b.from.date ? -1 : a.from.date > b.from.date ? 1 : 0; });
    });
    save();
    return s;
  }

  var SCHED = null;
  var confirmDefer = false;

  // Items still to do today (base plan and catch-up that landed on today).
  function pendingToday(day) {
    var out = [];
    day.items.concat(catchUp(day).map(function (e) { return e.it; })).forEach(function (it) {
      if (NON_STUDY[it.type] || isDone(it) || state.dropped[it.id] || state.deferred[it.id]) return;
      if (it.id.split(':')[0] === day.date && pinDate(it, day)) return;
      out.push(it);
    });
    return out;
  }

  // ---------- day maths ----------
  function catchUp(day) { return SCHED.byDay[day.date] || []; }

  function dayStats(day, withCatch) {
    var all = day.items.filter(function (it) { return isDone(it) || !shifted(it, day); });
    if (withCatch) catchUp(day).forEach(function (e) { all.push(e.it); });
    var total = 0, done = 0, left = 0, practice = 0, catchMin = 0;
    all.forEach(function (it) {
      if (it.type === 'break') return;
      if (it.type === 'recall') { if (!isDone(it)) left++; return; }
      total += it.min;
      if (it.type === 'practice' || it.type === 'listen' || /^Past paper/.test(it.text)) practice += it.min;
      if (isDone(it)) done += it.min; else left++;
    });
    if (withCatch) catchUp(day).forEach(function (e) { catchMin += e.it.min; });
    var hasWork = all.some(function (it) { return it.type !== 'break'; });
    return { total: total, done: done, complete: hasWork && left === 0, hasWork: hasWork, practice: practice, catchMin: catchMin };
  }

  function daySubjects(day) {
    var out = [];
    day.items.filter(function (it) { return isDone(it) || !shifted(it, day); })
      .concat(catchUp(day).map(function (e) { return e.it; })).forEach(function (it) {
      if (NON_STUDY[it.type] || out.indexOf(it.name) >= 0) return;
      out.push(it.name);
    });
    return out;
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
    function allDone(d) {
      return d.items.every(function (it) { return it.type === 'break' || isDone(it); });
    }
    var ts = DAYS[i].date === iso ? dayStats(DAYS[i], false) : null;
    if (ts && ts.hasWork && !allDone(DAYS[i])) i--;
    var n = 0;
    for (; i >= 0; i--) {
      var s = dayStats(DAYS[i], false);
      if (!s.hasWork) continue;
      if (!allDone(DAYS[i])) break;
      n++;
    }
    return n;
  }

  function subjectNames() {
    var out = [];
    DAYS.forEach(function (d) {
      d.items.forEach(function (it) {
        if (NON_STUDY[it.type]) return;
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
        if (!accepts(ex, it)) return;
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
    var txt = next ? 'Next: ' + next.name + ' in ' + dayLabel(daysBetween(today, toDate(next.date))) : 'All exams are behind you.';
    if (SCHED.total) txt += ' · Backlog ' + fmt(SCHED.total);
    el.textContent = txt;
  }

  function backlogBanner() {
    if (!SCHED.total) return '';
    var h = '<div class="catch"><strong>Backlog: ' + fmt(SCHED.total) + ' across ' + SCHED.overdue.length + ' items.</strong> ' +
      'It is spread over the next days and clears by ' + esc(SCHED.clearBy ? shortDate(SCHED.clearBy) : 'the end of the plan') + '.';
    if (SCHED.overMin) {
      h += ' <span class="warn">' + fmt(SCHED.overMin) + ' does not fit the catch-up room before its deadline, so some days run heavy. Drop what is least useful.</span>';
    }
    if (SCHED.unplaced.length) {
      h += ' <span class="warn">' + SCHED.unplaced.length + ' items have no day left. Drop them or do them in the free days.</span>';
    }
    return h + '</div>';
  }

  function rowHtml(it, opts) {
    opts = opts || {};
    var cls = 'row ' + (it.type === 'break' ? 'break ' : '') + (isDone(it) ? 'done' : '');
    var tag = '';
    if (it.type === 'practice') tag = '<span class="tag">practice</span>';
    else if (it.type === 'listen') tag = '<span class="tag">listening</span>';
    else if (it.type === 'recall') tag = '<span class="tag">recall</span>';
    if (it.min > 90 && !NON_STUDY[it.type]) tag += '<span class="tag">take a break every 90 min</span>';
    if (opts.from) tag += '<span class="tag tag-moved">from ' + esc(opts.from) + '</span>';
    if (!isDone(it) && opts.movedTo) tag += '<span class="tag tag-moved">moved to ' + esc(opts.movedTo) + '</span>';
    if (!isDone(it) && opts.dropped) tag += '<span class="tag">dropped</span>';
    var name = it.type === 'recall' ? 'Recall' : it.name;
    var body = it.text ? '<br>' + esc(it.text) : '';
    var drop = opts.drop ? '<button class="linkbtn" data-drop="' + esc(it.id) + '">Drop</button>' : '';
    if (!NON_STUDY[it.type] && !isDone(it)) drop += '<button class="linkbtn" data-menu="' + esc(it.id) + '">Edit</button>';
    var sheet = menu && menu.id === it.id ? sheetHtml(it) : '';
    return '<li class="' + cls + '"><label><input type="checkbox" data-id="' + esc(it.id) + '"' + (isDone(it) ? ' checked' : '') + '>' +
      '<span class="txt"><span class="sub">' + esc(name) + '</span>' + tag + body + '</span></label>' +
      '<span class="min">' + it.min + ' min' + drop + '</span></li>' + sheet;
  }

  function sheetHtml(it) {
    var T = isoOf(todayDate());
    var cur = effectiveDate(it);
    var days = DAYS.filter(function (d) { return d.date >= T; });
    function opts(sel) {
      return days.map(function (d) {
        return '<option value="' + d.date + '"' + (d.date === sel ? ' selected' : '') + '>' + esc(shortDate(d.date)) + ' (' + esc(d.kind) + ')</option>';
      }).join('');
    }
    var swDay = menu.swDay;
    if (!swDay) {
      var other = days.filter(function (d) { return d.date !== cur; })[0];
      swDay = other ? other.date : cur;
    }
    var cands = itemsOnDay(swDay).filter(function (x) { return x.id !== it.id; });
    var candOpts = cands.length ? cands.map(function (x) {
      return '<option value="' + esc(x.id) + '">' + esc(x.name) + ', ' + x.min + ' min' + (x.text ? ', ' + esc(x.text.slice(0, 40)) : '') + '</option>';
    }).join('') : '<option value="">Nothing to swap with on this day</option>';
    var pinned = state.pin[it.id] ? '<button class="textbtn" data-act="pinreset">Put back where the plan had it</button>' : '';
    var edited = state.edits[it.id] ? '<button class="textbtn" data-act="edreset">Reset wording and time</button>' : '';
    return '<li class="sheet"><div class="sheet-in">' +
      '<h3>Move, swap or edit</h3>' +
      '<label class="fl">Move to another day</label>' +
      '<div class="actions"><select id="mv-day">' + opts(cur) + '</select><button class="textbtn solid" data-act="mv">Move</button></div>' +
      '<label class="fl">Swap with another item</label>' +
      '<div class="actions"><select id="sw-day">' + opts(swDay) + '</select></div>' +
      '<div class="actions"><select id="sw-item">' + candOpts + '</select><button class="textbtn solid" data-act="sw">Swap</button></div>' +
      '<label class="fl">Change this topic</label>' +
      '<input id="ed-name" type="text" value="' + esc(it.name) + '" aria-label="Subject">' +
      '<input id="ed-text" type="text" value="' + esc(it.text) + '" aria-label="Topic details" placeholder="Topic details">' +
      '<input id="ed-min" type="number" min="5" max="600" step="5" value="' + it.min + '" aria-label="Minutes">' +
      '<div class="actions"><button class="textbtn solid" data-act="ed">Save changes</button>' + edited + pinned + '<button class="textbtn" data-act="close">Close</button></div>' +
      '</div></li>';
  }

  function renderToday() {
    var day = DAYS[selected];
    var st = dayStats(day, true);
    var iso = isoOf(todayDate());
    var isToday = day.date === iso;
    var isPast = day.date < iso;
    var dd = toDate(day.date);
    var quote = QUOTES[(dd.getDate() + dd.getMonth() * 3) % QUOTES.length];
    var hours = st.hasWork ? fmt(st.total) : 'Free';
    var subs = daySubjects(day);

    var html = '<div class="daynav">' +
      '<button class="iconbtn" data-nav="-1" aria-label="Previous day"' + (selected === 0 ? ' disabled' : '') + '>&lsaquo;</button>' +
      '<div class="title"><h2>' + esc(day.label) + (isToday ? ' (today)' : '') + '</h2>' +
      '<p class="muted">' + esc(day.kind) + ' &middot; ' + hours + (st.catchMin ? ' &middot; includes ' + fmt(st.catchMin) + ' catch-up' : '') + '</p></div>' +
      (isToday ? '' : '<button class="textbtn" data-nav="today">Today</button>') +
      '<button class="iconbtn" data-nav="1" aria-label="Next day"' + (selected === DAYS.length - 1 ? ' disabled' : '') + '>&rsaquo;</button>' +
      '</div>';

    if (day.note) html += '<p class="note exam">' + esc(day.note) + '</p>';
    if (subs.length) html += '<p class="note muted">' + esc(subs.join(', ')) + '. Study ' + fmt(st.total - st.practice) + ', practice ' + fmt(st.practice) + '.</p>';
    if (day.tip) html += '<p class="note">' + esc(day.tip) + '</p>';
    if (isToday || !isPast) html += backlogBanner();
    if (isToday) {
      var rest = pendingToday(day);
      if (rest.length) {
        var restMin = rest.reduce(function (n, it) { return n + it.min; }, 0);
        if (confirmDefer) {
          html += '<div class="catch">Move ' + rest.length + ' unticked items (' + fmt(restMin) + ') to later days? They are spread over the next days, each before its Done by date.' +
            '<div class="actions"><button class="textbtn solid" data-defer="yes">Yes, move them</button><button class="textbtn" data-defer="no">Cancel</button></div></div>';
        } else {
          html += '<div class="actions"><button class="textbtn" data-defer="ask">Move the rest of today to later days</button></div>';
        }
      }
    }

    if (st.hasWork) {
      html += '<div class="stat"><span>' + fmt(st.done) + ' of ' + fmt(st.total) + '</span><span>' + pct(st.done, st.total) + '%</span></div>' +
        '<div class="bar"><i style="width:' + pct(st.done, st.total) + '%"></i></div>';
      var hasDef = day.items.some(function (it) { return state.deferred[it.id] && !isDone(it); });
      if (st.complete && hasDef) html += '<div class="banner">The rest of today is moved to later days. Rest up.</div>';
      else if (st.complete) html += '<div class="banner">Day done. Close the books, and be in bed early.</div>';
      else html += '<div class="quote">' + esc(quote) + '</div>';

      html += '<ul class="list">';
      day.items.forEach(function (it) {
        var mv = SCHED.moved[it.id];
        html += rowHtml(it, { movedTo: (isPast || shifted(it, day)) && mv && mv !== day.date && shortDate(mv), dropped: isPast && state.dropped[it.id] });
      });
      html += '</ul>';

      var cu = catchUp(day);
      if (cu.length) {
        html += '<h2>Moved here from other days</h2><p class="muted">Placed by the planner or by you. Planner moves stay before their Done by date.</p><ul class="list">';
        cu.forEach(function (e) { html += rowHtml(e.it, { from: shortDate(e.from.date).replace(/^\w+ /, ''), drop: true }); });
        html += '</ul>';
      }
    } else {
      html += '<div class="quote">No new topics. Use the time for past papers, Maths and the topics your practice slots showed were weak.</div>';
    }
    view.innerHTML = html;
  }

  function renderPlan() {
    var iso = isoOf(todayDate());
    var html = backlogBanner();
    var lastWeek = null;
    DAYS.forEach(function (d, i) {
      if (d.week !== lastWeek) {
        lastWeek = d.week;
        html += '<div class="week"><h2>' + esc(d.week.title) + '</h2><p class="muted">' + esc(d.week.range) + ' &middot; ' + esc(d.week.note) + '</p></div>';
      }
      var st = dayStats(d, true);
      var p = st.hasWork ? pct(st.done, st.total) + '%' : '';
      var extra = st.catchMin ? ' &middot; +' + fmt(st.catchMin) + ' catch-up' : '';
      html += '<button class="dayrow' + (d.date === iso ? ' today' : '') + (st.complete ? ' full' : '') + '" data-day="' + i + '">' +
        '<span class="d">' + esc(d.label) + '</span><span class="k">' + esc(d.kind) + ' &middot; ' + (st.hasWork ? fmt(st.total) : 'Free') + extra + '</span><span class="p">' + p + '</span></button>';
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
      var meta = shortDate(e.date);
      if (e.doneBy) {
        var m = daysBetween(today, toDate(e.doneBy));
        meta += ' &middot; done by ' + shortDate(e.doneBy) + (m >= 0 ? ' (' + dayLabel(m) + ' left)' : '') +
          (e.planned ? ' &middot; planned ' + esc(e.planned) + ', ' + e.spare + ' spare' : '');
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
      var st = dayStats(d, false);
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
      '<div class="card"><div class="big">' + streak() + '</div><p class="muted">day streak</p></div>' +
      '<div class="card"><div class="big">' + fmt(SCHED.total) + '</div><p class="muted">backlog' + (SCHED.clearBy ? ', clears by ' + esc(shortDate(SCHED.clearBy)) : '') + '</p></div></div>';

    var dropped = [];
    DAYS.forEach(function (d) { d.items.forEach(function (it) { if (state.dropped[it.id]) dropped.push({ it: it, d: d }); }); });
    if (dropped.length) {
      html += '<h2>Dropped</h2>';
      dropped.forEach(function (x) {
        html += '<div class="card"><div class="head"><span class="name">' + esc(x.it.name) + ' &middot; ' + x.it.min + ' min</span>' +
          '<button class="linkbtn" data-restore="' + esc(x.it.id) + '">Restore</button></div><p class="muted meta">' + esc(x.d.label) + '. ' + esc(x.it.text) + '</p></div>';
      });
    }

    html += '<h2>By subject</h2>';
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
    applyEdits();
    SCHED = buildSchedule();
    window.__SCHED = SCHED; // read by tests
    if (tab === 'today') renderToday();
    else if (tab === 'plan') renderPlan();
    else if (tab === 'exams') renderExams();
    else renderProgress();
    renderTop();
    var ub = document.getElementById('undo');
    if (ub) {
      ub.disabled = !hist.length;
      document.getElementById('undo-note').textContent = hist.length ? hist[hist.length - 1].label : '';
    }
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
    if (e.target.id === 'sw-day') {
      menu.swDay = e.target.value;
      render();
      return;
    }
    var id = e.target.getAttribute('data-id');
    if (!id) return;
    var checked = e.target.checked;
    var it0 = ITEM_BY_ID[id];
    mutate((checked ? 'Ticked ' : 'Unticked ') + (it0 ? it0.name : 'item'), function () {
      if (checked) state.done[id] = true; else delete state.done[id];
    });
  });

  document.getElementById('undo').addEventListener('click', function () {
    var h = hist.pop();
    if (!h) return;
    state = normalize(JSON.parse(h.snap));
    menu = null;
    save();
    render();
  });

  view.addEventListener('click', function (e) {
    var df = e.target.closest('[data-defer]');
    if (df) {
      var act = df.getAttribute('data-defer');
      if (act === 'ask') confirmDefer = true;
      else if (act === 'no') confirmDefer = false;
      else {
        var tday = DAYS[selected];
        var iso0 = isoOf(todayDate());
        confirmDefer = false;
        mutate('Moved the rest of today', function () {
          pendingToday(tday).forEach(function (it) {
            state.deferred[it.id] = iso0;
            delete state.assign[it.id];
            delete state.pin[it.id];
          });
        });
        return;
      }
      render();
      return;
    }
    var drop = e.target.closest('[data-drop]');
    if (drop) {
      var did = drop.getAttribute('data-drop');
      mutate('Dropped ' + (ITEM_BY_ID[did] ? ITEM_BY_ID[did].name : 'item'), function () { state.dropped[did] = true; });
      return;
    }
    var restore = e.target.closest('[data-restore]');
    if (restore) {
      var rid = restore.getAttribute('data-restore');
      mutate('Restored ' + (ITEM_BY_ID[rid] ? ITEM_BY_ID[rid].name : 'item'), function () {
        delete state.dropped[rid];
        delete state.assign[rid];
      });
      return;
    }
    var mb = e.target.closest('[data-menu]');
    if (mb) {
      var mid = mb.getAttribute('data-menu');
      menu = menu && menu.id === mid ? null : { id: mid };
      render();
      return;
    }
    var act = e.target.closest('[data-act]');
    if (act && menu) {
      var a0 = act.getAttribute('data-act');
      var cur = ITEM_BY_ID[menu.id];
      var val = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
      if (a0 === 'close') { menu = null; render(); return; }
      if (a0 === 'mv') {
        var to = val('mv-day');
        menu = null;
        mutate('Moved ' + cur.name, function () { setPin(cur, to); });
        return;
      }
      if (a0 === 'sw') {
        var other = ITEM_BY_ID[val('sw-item')];
        if (!other) return;
        var da = effectiveDate(cur), db = effectiveDate(other);
        menu = null;
        mutate('Swapped ' + cur.name + ' and ' + other.name, function () { setPin(cur, db); setPin(other, da); });
        return;
      }
      if (a0 === 'ed') {
        var nm = val('ed-name').trim(), tx = val('ed-text').trim(), mn = parseInt(val('ed-min'), 10);
        if (!nm || !(mn > 0)) return;
        menu = null;
        mutate('Edited ' + cur.name, function () {
          var o = cur.o;
          if (nm === o.name && tx === o.text && mn === o.min) delete state.edits[cur.id];
          else state.edits[cur.id] = { name: nm, text: tx, min: mn };
        });
        return;
      }
      if (a0 === 'edreset') { menu = null; mutate('Reset ' + cur.name, function () { delete state.edits[cur.id]; }); return; }
      if (a0 === 'pinreset') {
        menu = null;
        mutate('Put back ' + cur.name, function () { delete state.pin[cur.id]; delete state.assign[cur.id]; });
        return;
      }
    }
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
