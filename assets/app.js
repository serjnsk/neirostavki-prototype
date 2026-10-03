/* =====================================================================
   Нейроставки — общий UI: шапка/подвал, карточка события, строка списка,
   тост, фон, делегирование кликов
   ===================================================================== */
const $ = s => document.querySelector(s);
const LOGO_MARK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#EFF02A" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="12" r="2.4" fill="#EFF02A" stroke="none"/><circle cx="18" cy="6" r="2.4" fill="#EFF02A" stroke="none"/><circle cx="18" cy="18" r="2.4" fill="#EFF02A" stroke="none"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8"/></svg>';

function headerHTML(active){
  const nav = [['events', 'События', 'index.html#events'], ['football', 'Футбол', '#'], ['hockey', 'Хоккей', '#'], ['tennis', 'Теннис', '#']];
  return `<header class="top"><div class="wrap top-in">
    <a class="logo" href="index.html"><span class="mark">${LOGO_MARK}</span><span class="word">Нейроставки</span></a>
    <nav class="nav">
      ${nav.map(n => `<a href="${n[2]}" class="${n[0] === active ? 'active' : ''}" ${n[2] === '#' ? 'data-soon' : ''}>${n[1]}</a>`).join('')}
      <a href="#" data-soon>Ещё <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></a>
      <span class="nav-sep"></span>
      <a href="#" data-soon>Букмекеры</a><a href="#" data-soon>Как мы считаем</a>
    </nav>
    <div class="top-actions"><a class="btn ghost" href="#" data-soon>Войти</a><a class="btn primary" href="#" data-soon>Начать бесплатно</a></div>
  </div></header>`;
}
function footerHTML(){
  return `<footer><div class="wrap foot-in">
    <div class="foot-l"><span class="age">18+</span><p>Нейроставки — аналитический сервис. Мы не принимаем ставки и не являемся букмекером. Прогноз — оценка модели, а не гарантия результата. Прототип: данные демонстрационные.</p></div>
    <div class="foot-links"><a href="#" data-soon>Как мы считаем</a><a href="#" data-soon>Букмекеры</a><a href="#" data-soon>Ответственная игра</a><a href="#" data-soon>Контакты</a></div>
  </div></footer>`;
}
function mountChrome(active){
  const h = $('#site-header'), f = $('#site-footer');
  if (h) h.outerHTML = headerHTML(active);
  if (f) f.outerHTML = footerHTML();
}

/* ---------- кусочки ---------- */
const sportChip = s => `<span class="sport-chip">${ICONS[s]}${SPORTS[s].n}</span>`;
const bkLogo = b => `<span class="bk-logo" style="--c:${b.c}${b.ink ? ';color:' + b.ink : ''}">${b.m}</span>`;
const logo = t => `<img src="${t.l}" alt="" loading="lazy" data-ini="${esc(t.s.slice(0, 2).toUpperCase())}">`;
function seg(probs, cls, n){
  return `<div class="bar ${cls || ''}">${probs.map((p, i) => {
    const c = n === 2 && i === 1 ? 2 : i;
    return `<i class="s${c}" style="flex:${(p * 100).toFixed(1)}">${p >= .14 ? fPct(p) : ''}</i>`;
  }).join('')}</div>`;
}
function sparkSVG(h){
  const w = 220, hh = 44, p = 5;
  const mn = Math.min(...h), mx = Math.max(...h), r = (mx - mn) || .01;
  const pts = h.map((v, i) => [p + i * (w - 2 * p) / (h.length - 1), hh - p - (v - mn) / r * (hh - 2 * p)]);
  const line = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
  const area = line + ` L${pts[pts.length - 1][0].toFixed(1)} ${hh} L${pts[0][0].toFixed(1)} ${hh} Z`;
  const e = pts[pts.length - 1];
  return `<svg viewBox="0 0 ${w} ${hh}" aria-hidden="true"><path d="${area}" fill="#EFF02A" opacity=".45"/><path d="${line}" fill="none" stroke="#0B0B0A" stroke-width="1.6"/><circle cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="3" fill="#0B0B0A"/><circle cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="5.5" fill="none" stroke="#0B0B0A" stroke-width="1" opacity=".25"/></svg>`;
}
const valBadge = (a, withLabel) => a.strength === 'none' ? 'нет валуя' : (withLabel ? 'Валуй ' : '') + fEV(a.val[a.pick]);

/* ---------- подсказки: иконка «i» + плавающий тултип (не обрезается контейнерами) ---------- */
const INFO_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.3v3.9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="4.9" r=".95" fill="currentColor"/></svg>';
const infoBtn = tip => `<button class="info" type="button" data-tip="${esc(tip)}" aria-label="Пояснение: ${esc(tip)}">${INFO_SVG}</button>`;
let tipEl = null, tipFor = null, tipPinned = false;
function tipShow(el){
  if (!tipEl){ tipEl = document.createElement('div'); tipEl.className = 'tipbox'; tipEl.setAttribute('role', 'tooltip'); document.body.appendChild(tipEl); }
  tipFor = el; tipEl.textContent = el.dataset.tip;
  tipEl.style.left = '0px'; tipEl.style.top = '0px'; tipEl.classList.add('show');
  const r = el.getBoundingClientRect(), w = tipEl.offsetWidth, h = tipEl.offsetHeight;
  const left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2));
  let top = r.top - h - 8; if (top < 8) top = r.bottom + 8;
  tipEl.style.left = left + 'px'; tipEl.style.top = top + 'px';
}
function tipHide(){ if (tipEl) tipEl.classList.remove('show'); tipFor = null; tipPinned = false; }
const tipTarget = e => e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
document.addEventListener('mouseover', e => { const t = tipTarget(e); if (t && t !== tipFor && !tipPinned) tipShow(t); });
document.addEventListener('mouseout', e => { const t = tipTarget(e); if (t && t === tipFor && !tipPinned && !(e.relatedTarget && t.contains(e.relatedTarget))) tipHide(); });
document.addEventListener('focusin', e => { const t = tipTarget(e); if (t && !tipPinned) tipShow(t); });
document.addEventListener('focusout', e => { const t = tipTarget(e); if (t && t === tipFor && !tipPinned) tipHide(); });
addEventListener('scroll', () => { if (tipFor) tipHide(); }, {passive: true, capture: true});
addEventListener('resize', () => { if (tipFor) tipHide(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && tipFor) tipHide(); });
const evUrl = ev => `event.html?id=${ev.id}`;

/* ---------- карточка события ---------- */
function frontHTML(ev, sel){
  const a = analyze(ev), d = parse(ev.dt);
  if (sel == null) sel = a.pick;
  const off = offersFor(ev, a, sel);
  const cell = (i, extra) => `<td class="${i === sel ? 'sel' : ''} ${extra || ''}">`;
  const hdr = a.labels.map((l, i) => `<th data-i="${i}" class="${i === sel ? 'sel' : ''}" title="Показать, где брать ${l}">${l}<small>${esc(a.subs[i])}</small></th>`).join('');
  const rowP = a.labels.map((l, i) => cell(i) + fPct(ev.p[i]) + '</td>').join('');
  const rowF = a.labels.map((l, i) => cell(i) + fO(a.fair[i]) + '</td>').join('');
  const rowB = a.labels.map((l, i) => cell(i) + fO(a.best[i].o) + `<small>${a.best[i].bk.name}</small></td>`).join('');
  const rowV = a.labels.map((l, i) => cell(i, a.val[i] >= .02 ? 'pos' : 'neg') + fEV(a.val[i]) + '</td>').join('');
  return `<div class="face front">
    <div class="c-top">${sportChip(ev.sport)}<span class="league" title="${esc(ev.league)} · ${esc(ev.sub)}">${esc(ev.league)} · ${esc(ev.sub)}</span><span class="val-badge ${a.strength}">${valBadge(a, true)}</span><span class="flip-ico" title="Карточка переворачивается: на обороте — почему">${FLIP_ICON}</span></div>
    <div class="c-teams">
      <div class="team">${logo(ev.t1)}<b>${esc(ev.t1.n)}</b></div>
      <div class="when"><b>${timeStr(d)}</b><span class="day">${dayLabel(d)}</span><span>${fullDate(d)}</span></div>
      <div class="team">${logo(ev.t2)}<b>${esc(ev.t2.n)}</b></div>
    </div>
    <div class="c-venue" title="${esc(ev.venue)}">${esc(ev.venue)}</div>
    <div class="c-bars">
      <div class="bar-row"><span>Мы</span>${seg(ev.p, '', a.n)}</div>
      <div class="bar-row"><span>Рынок</span>${seg(a.mkt, 'thin', a.n)}</div>
    </div>
    <table class="c-table">
      <thead><tr><th></th>${hdr}</tr></thead>
      <tbody>
        <tr><th>Вероятность</th>${rowP}</tr>
        <tr><th><span data-tip="${TIP_FAIR}" tabindex="0">Наш кэф</span></th>${rowF}</tr>
        <tr><th>Лучший кэф</th>${rowB}</tr>
        <tr><th><span data-tip="${TIP_VAL}" tabindex="0">Валуй</span></th>${rowV}</tr>
      </tbody>
    </table>
    <div class="c-where">
      <div class="c-label"><span>Где брать <b>${a.labels[sel]}</b> · 7 БК</span><span>наша цена <b>${fO(a.fair[sel])}</b></span></div>
      <ul class="bk-list">${off.list.map((o, i) => `<li class="${i === 0 ? 'best' : ''}">${bkLogo(o.bk)}<span>${o.bk.name}</span><b>${fO(o.o)}</b><span class="ev ${o.ev > 0 ? '' : 'neg'}" title="Валуй при этом кэфе">${fEV(o.ev)}</span></li>`).join('')}</ul>
      <div class="c-spread"><span>Разброс ${fO(off.min)}–${fO(off.max)}</span><span>выбор БК стоит до ${Math.round(off.cost * 100)}% выигрыша</span></div>
    </div>
    <div class="c-foot"><button class="btn-card why" data-flip type="button">${FLIP_ICON}Почему?</button><a class="btn-card more" href="${evUrl(ev)}">Полный обзор →</a></div>
  </div>`;
}
function backHTML(ev){
  const a = analyze(ev), pick = a.pick, h = a.hist;
  const who = pickName(ev, a);
  const first = h[0], last = h[h.length - 1];
  const dir = last > first + .005 ? 'up' : last < first - .005 ? 'down' : 'flat';
  const interp = dir === 'up'
    ? `Кэф на ${a.labels[pick]} вырос с открытия: рынок сдвигается против нашей оценки — валуй растёт, но это сигнал перепроверить факторы.`
    : dir === 'down'
    ? `Кэф на ${a.labels[pick]} снижается: рынок подтягивается к нашей оценке — окно для ставки закрывается.`
    : `Линия стабильна с открытия: рынок и модель расходятся, но никто не двигается.`;
  const wf = `<ul class="wf">
    <li class="base"><span>Рынок: консенсус 7 БК без маржи</span><span class="pp n">${fPct1(a.mktR)}</span></li>
    ${a.factors.map(f => `<li><span>${esc(f.t)}</span><span class="pp ${f.pp >= 0 ? 'pos' : 'neg'}">${fPP(f.pp)}</span></li>`).join('')}
    <li class="total"><span>Наша оценка · ${a.labels[pick]}</span><span class="pp n">${fPct1(a.pR)}</span></li></ul>`;
  return `<div class="face back">
    <div class="b-head"><button class="b-back" data-flip type="button">← К прогнозу</button><span class="league">${esc(ev.t1.s)} — ${esc(ev.t2.s)}</span></div>
    <div><div class="b-label">Почему такая оценка${infoBtn('Начинаем с вероятности, которую закладывает рынок, и показываем, на сколько процентных пунктов каждый найденный фактор сдвинул нашу оценку')}</div><div class="b-title">${fPct(ev.p[pick])} на ${a.labels[pick]} — ${esc(who)}</div></div>
    ${wf}
    <div><div class="b-label">Движение линии · ${a.labels[pick]}</div><div class="spark">${sparkSVG(h)}<div class="v"><b>${fO(first)} → ${fO(last)}</b>с открытия</div></div><div class="hint">${interp}</div></div>
    <div><div class="b-label">${plural(a.src.length, ['источник', 'источника', 'источников'])}</div><div class="src">${a.src.map(s => `<span>${esc(s)}</span>`).join('')}</div></div>
    <div class="b-foot"><span class="upd-s">Обновлено ${ev.upd || UPDATED}${infoBtn('Пересчитываем оценку при каждом изменении линии и при появлении новостей')}</span><a class="btn-card more" href="${evUrl(ev)}">Полный обзор →</a></div>
  </div>`;
}
const cardHTML = ev => `<article class="card" data-id="${ev.id}"><div class="card-inner">${frontHTML(ev)}${backHTML(ev)}</div></article>`;

/* ---------- строка списка ---------- */
function rowHTML(ev){
  const a = analyze(ev), d = parse(ev.dt), best = a.best[a.pick];
  const badge = a.strength === 'none' ? 'нет валуя' : a.labels[a.pick] + ' ' + fEV(a.val[a.pick]);
  const dl = dayLabel(d);
  return `<a class="row" href="${evUrl(ev)}">
    <div class="r-time"><b>${timeStr(d)}</b><span>${dl === 'Сегодня' || dl === 'Завтра' ? dl.toLowerCase() : shortDate(d)}</span></div>
    <div class="r-ev"><div class="r-logos">${logo(ev.t1)}${logo(ev.t2)}</div><div class="r-names"><b>${esc(ev.t1.n)} — ${esc(ev.t2.n)}</b><span>${ICONS[ev.sport]}${esc(ev.league)} · ${esc(ev.sub)}</span></div></div>
    <div class="r-prob">${seg(ev.p, 'mini', a.n)}<div class="lg">${a.labels.map((l, i) => `<span class="${i === a.pick ? 'pk' : ''}">${l} <b>${fPct(ev.p[i])}</b></span>`).join('')}</div></div>
    <div class="r-val"><span class="val-badge ${a.strength}">${badge}</span><span class="l">${STRENGTH_LABEL[a.strength]}</span></div>
    <div class="r-bk">${bkLogo(best.bk)}<div><b>${fO(best.o)}</b> <span>${best.bk.name}</span><small>наша цена ${fO(a.fair[a.pick])} · разброс ${fO(offersFor(ev, a, a.pick).min)}–${fO(best.o)}</small></div></div>
    <span class="r-go">→</span></a>`;
}

/* ---------- тост и общие клики ---------- */
let toastT;
function toast(msg){ const el = $('#toast'); if (!el) return; el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2400); }
document.addEventListener('click', e => {
  const t = e.target;
  const inf = t.closest('.info');
  if (inf){ e.preventDefault(); if (tipPinned && tipFor === inf) tipHide(); else { tipShow(inf); tipPinned = true; } return; }
  if (tipPinned) tipHide();
  const th = t.closest('.c-table thead th[data-i]');
  if (th){ const card = th.closest('.card'); const ev = EVENTS.find(x => x.id == card.dataset.id); card.querySelector('.front').outerHTML = frontHTML(ev, +th.dataset.i); return; }
  const soon = t.closest('[data-soon]');
  if (soon){ e.preventDefault(); toast(soon.dataset.soon || 'В прототипе пока только главная и страница события'); return; }
  if (t.closest('a, button, [data-tip], input, select, label')){ if (t.closest('a[href="#"]')) e.preventDefault(); if (t.closest('[data-flip]')) t.closest('.card').classList.toggle('flipped'); return; }
  const face = t.closest('.face'); if (face){ face.closest('.card').classList.toggle('flipped'); }
});
// логотип не загрузился → инициалы
document.addEventListener('error', e => { const img = e.target; if (img.tagName === 'IMG' && img.dataset.ini){ const s = document.createElement('span'); s.className = 'ini'; s.textContent = img.dataset.ini; img.replaceWith(s); } }, true);
// живой счётчик, как у Ramp
function startCounter(el, start){ let n = start || 1284; setInterval(() => { n += 1 + Math.floor(Math.random() * 3); el.textContent = n.toLocaleString('ru-RU'); el.classList.add('tick'); setTimeout(() => el.classList.remove('tick'), 500); }, 3800); }

/* ---------- фон: точечная сетка с волнами, точки разбегаются от курсора ---------- */
function initBackground(){
  const c = document.getElementById('bg'); if (!c) return;
  const x = c.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STEP = 20, R = 170, PUSH = 46, BUCKETS = 7;
  let W, H, dots = [], mx = -1e4, my = -1e4, t = 0, last = 0;
  function build(){ dots = []; for (let py = STEP / 2; py < H; py += STEP) for (let px = STEP / 2; px < W; px += STEP) dots.push({x: px, y: py, ox: 0, oy: 0, vx: 0, vy: 0}); }
  function resize(){ const dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); build(); }
  function hash(i, j){ let n = (i * 374761393 + j * 668265263) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967295; }
  const sm = v => v * v * (3 - 2 * v);
  function noise(px, py){ const i = Math.floor(px), j = Math.floor(py), fx = sm(px - i), fy = sm(py - j); const a = hash(i, j), b = hash(i + 1, j), cc = hash(i, j + 1), d = hash(i + 1, j + 1); return a + (b - a) * fx + (cc - a) * fy + (a - b - cc + d) * fx * fy; }
  function draw(now){
    if (now - last < 30){ requestAnimationFrame(draw); return; } last = now; t += .016;
    x.clearRect(0, 0, W, H);
    const paths = []; for (let b = 0; b < BUCKETS; b++) paths.push(new Path2D());
    for (let k = 0; k < dots.length; k++){
      const d = dots[k];
      const dx = d.x - mx, dy = d.y - my, dist = Math.sqrt(dx * dx + dy * dy);
      let tx = 0, ty = 0, near = 0;
      if (dist < R && dist > .5){ near = 1 - dist / R; const f = near * near * PUSH; tx = dx / dist * f; ty = dy / dist * f; }
      d.vx += (tx - d.ox) * .14; d.vy += (ty - d.oy) * .14; d.vx *= .76; d.vy *= .76; d.ox += d.vx; d.oy += d.vy;
      const n1 = noise(d.x / 260 + t * .12, d.y / 260 + t * .05);
      const n2 = noise(d.x / 90 - t * .05, d.y / 90 + t * .08) * .35;
      const band = .5 + .5 * Math.sin((n1 + n2) * 9.5 - t * 1.6);
      let w = band * band * band + near * .55; if (w > 1) w = 1;
      const b = Math.min(BUCKETS - 1, Math.floor(w * BUCKETS));
      const r = 1.05 + (b / (BUCKETS - 1)) * .9, cx = d.x + d.ox, cy = d.y + d.oy;
      paths[b].moveTo(cx + r, cy); paths[b].arc(cx, cy, r, 0, 6.2832);
    }
    for (let b = 0; b < BUCKETS; b++){ x.fillStyle = 'rgba(11,11,10,' + (.10 + (b / (BUCKETS - 1)) * .36).toFixed(3) + ')'; x.fill(paths[b]); }
    if (!reduce && !document.hidden) requestAnimationFrame(draw);
  }
  resize(); addEventListener('resize', () => { resize(); if (reduce) draw(1e9); });
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, {passive: true});
  document.documentElement.addEventListener('mouseleave', () => { mx = my = -1e4; });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(draw); });
  requestAnimationFrame(draw);
}
