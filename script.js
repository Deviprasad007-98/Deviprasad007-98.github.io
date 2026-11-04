/* =========================================================
   Dr. Deviprasad Sahoo — interactive portfolio
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const strip = (h) => h.replace(/<[^>]+>/g, "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- Theme ---------------- */
  const root = document.documentElement;
  const themeSwitch = $("#themeSwitch");
  const themeListeners = [];
  function storedTheme() { try { return localStorage.getItem("ds-theme"); } catch { return null; } }
  function applyTheme(t) {
    root.dataset.theme = t;
    themeSwitch.checked = t === "dark";
    themeListeners.forEach((fn) => fn(t));
  }
  applyTheme(root.dataset.theme || storedTheme() || "dark");
  themeSwitch.addEventListener("change", () => {
    const t = themeSwitch.checked ? "dark" : "light";
    try { localStorage.setItem("ds-theme", t); } catch {}
    applyTheme(t);
  });

  /* ---------------- Dynamic island ---------------- */
  const island = $("#island");
  const islandToggle = $("#islandToggle");
  islandToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = island.classList.toggle("open");
    islandToggle.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", (e) => {
    if (!island.contains(e.target) || e.target.closest(".island-menu a")) {
      island.classList.remove("open");
      islandToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* Active section tracking */
  const label = $("#islandLabel");
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const name = en.target.dataset.section;
      label.textContent = name;
      $$(".island-menu a").forEach((a) => a.classList.toggle("active", a.dataset.label === name));
      const tabName = name === "Lab" ? "Research" : name === "Skills" ? "Career" : name === "Honours" ? "Papers" : name;
      $$(".tabbar a").forEach((a) => a.classList.toggle("active", a.dataset.tab === tabName));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("[data-section]").forEach((s) => secObs.observe(s));

  /* ---------------- iOS slider fill ---------------- */
  function paintSlider(r) {
    const p = ((r.value - r.min) / (r.max - r.min)) * 100;
    r.style.setProperty("--fill-pct", p + "%");
  }
  $$('input[type="range"]').forEach((r) => { paintSlider(r); r.addEventListener("input", () => paintSlider(r)); });

  /* ---------------- Render content from data.js ---------------- */
  const sheet = $("#sheet"), backdrop = $("#sheetBackdrop"), sheetBody = $("#sheetBody");
  let lastFocus = null;
  function openSheet(html) {
    lastFocus = document.activeElement;
    sheetBody.innerHTML = html;
    sheet.hidden = false; backdrop.hidden = false;
    document.body.classList.add("sheet-open");
    sheet.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => { sheet.classList.add("show"); backdrop.classList.add("show"); $("#sheetClose").focus(); }));
  }
  function closeSheet() {
    sheet.classList.remove("show"); backdrop.classList.remove("show");
    document.body.classList.remove("sheet-open");
    setTimeout(() => { sheet.hidden = true; backdrop.hidden = true; }, 450);
    if (lastFocus) lastFocus.focus();
  }
  $("#sheetClose").addEventListener("click", closeSheet);
  backdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
  // swipe-down to dismiss
  let sy = null;
  sheet.addEventListener("touchstart", (e) => { if (sheet.scrollTop <= 0) sy = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener("touchmove", (e) => {
    if (sy === null) return;
    const dy = e.touches[0].clientY - sy;
    if (dy > 0) sheet.style.transform = `translate(-50%, ${dy}px)`;
  }, { passive: true });
  sheet.addEventListener("touchend", (e) => {
    if (sy === null) return;
    const dy = e.changedTouches[0].clientY - sy;
    sheet.style.transform = ""; sy = null;
    if (dy > 110) closeSheet();
  });

  function timelineList(el, items) {
    el.innerHTML = items.map((it, i) => `
      <li><button class="row" data-i="${i}">
        <span class="app-icon sm ${it.color}">${it.icon}</span>
        <span class="row-main">
          <span class="row-title">${esc(it.role)}${it.current ? '<span class="now-badge">NOW</span>' : ""}</span>
          <span class="row-sub" style="display:block">${esc(it.org)}</span>
        </span>
        <span class="row-meta">${esc(it.when)}</span>
        <span class="chev">›</span>
      </button></li>`).join("");
    el.addEventListener("click", (e) => {
      const b = e.target.closest(".row"); if (!b) return;
      const it = items[+b.dataset.i];
      openSheet(`
        <span class="app-icon ${it.color}">${it.icon}</span>
        <h3 id="sheetTitle">${esc(it.role)}</h3>
        <div class="sb-meta">${esc(it.org)}<br/><strong>${esc(it.when)}</strong></div>
        ${it.points.length ? `<ul>${it.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : `<p class="muted">Degree completed.</p>`}`);
    });
  }
  timelineList($("#expList"), window.EXPERIENCE);
  timelineList($("#eduList"), window.EDUCATION);

  /* Skills */
  const skillTabs = $("#skillTabs"), skillPanel = $("#skillPanel");
  skillTabs.innerHTML = window.SKILLS.map((s, i) => `<button role="tab" class="${i === 0 ? "active" : ""}" data-i="${i}">${s.tab}</button>`).join("");
  function showSkills(i) {
    $$("button", skillTabs).forEach((b) => b.classList.toggle("active", +b.dataset.i === i));
    skillPanel.innerHTML = window.SKILLS[i].items.map((s, k) => `<span class="skill-chip" style="animation-delay:${k * 40}ms">${esc(s)}</span>`).join("");
  }
  skillTabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showSkills(+b.dataset.i); });
  showSkills(0);

  /* Publications — all counts computed from data.js */
  const P = window.PUBLICATIONS.map((p, i) => ({ ...p, id: i }));
  const SCH = window.SCHOLAR || {};
  const isJournal = (p) => p.type === "article" || p.type === "review";
  const stats = {
    total: P.length,
    first: P.filter((p) => p.first).length,
    journal: P.filter(isJournal).length,
    journalFirst: P.filter((p) => p.first && isJournal(p)).length,
    reviews: P.filter((p) => p.type === "review").length,
    proc: P.filter((p) => p.type === "proc").length,
    chapters: P.filter((p) => p.type === "chapter").length,
    topCited: Math.max(...P.map((p) => p.cites || 0))
  };

  // hero widgets
  const setCount = (id, v) => { const el = $(id); if (el) el.dataset.count = v; };
  setCount("#wPubs", stats.total);
  setCount("#wFirst", stats.first);
  $("#wFirstFoot").textContent = `of ${stats.total} publications`;
  $("#wRing").style.setProperty("--p", (stats.first / stats.total).toFixed(3));
  $("#wPubsFoot").textContent = `${stats.journal} journal · ${stats.proc} proc. · ${stats.chapters} chapters`;
  if (SCH.citations) { setCount("#wCites", SCH.citations); $("#wCitesFoot").textContent = `Google Scholar · ${SCH.asOf}`; }
  if (SCH.hIndex) { setCount("#wH", SCH.hIndex); $("#wHFoot").textContent = `i10-index ${SCH.i10Index}`; }
  $("#interests").innerHTML = (SCH.interests || []).map((t) => `<span>${esc(t)}</span>`).join("");

  // section summary + stat tiles
  $("#pubHeadline").textContent = `${stats.total} publications`;
  $("#pubSummary").textContent =
    `${stats.first} as first author (${stats.journalFirst} of ${stats.journal} journal papers) · ${stats.reviews} reviews · ` +
    `${stats.proc} conference proceedings · ${stats.chapters} book chapters. ` +
    (SCH.underReview ? `${SCH.underReview} more manuscripts are under review.` : "");
  const tiles = [
    [stats.total, "Publications"], [stats.first, "First-author"], [SCH.citations, "Citations"],
    [SCH.hIndex, "h-index"], [SCH.i10Index, "i10-index"], [SCH.cumulativeIF, "Cumulative IF"]
  ].filter((t) => t[0] !== undefined);
  $("#pubStats").innerHTML = tiles.map(([v, l]) => `<div class="ps glass"><strong>${esc(v)}</strong><span>${l}</span></div>`).join("") +
    `<p class="ps-note">Metrics from Google Scholar (${esc(SCH.asOf || "")}).</p>`;

  let pubFilter = "all", pubQuery = "", pubSort = "cites", chartMode = "pubs";
  const typeBadge = { review: '<span class="badge b-review">Review</span>', proc: '<span class="badge b-proc">Proceedings</span>', chapter: '<span class="badge b-chapter">Chapter</span>', article: "" };
  const citeLabel = (p) => (p.cites == null ? "" : `<span class="cites" title="Google Scholar citations">${p.cites}<small>cited</small></span>`);

  function drawBars(list) {
    let years, vals, unit;
    if (chartMode === "cites") {
      years = Object.keys(SCH.perYear || {}).map(Number);
      vals = years.map((y) => SCH.perYear[y]);
      unit = `${SCH.citations} total`;
    } else {
      const ys = list.map((p) => p.year).filter(Boolean);
      const y0 = Math.min(2020, ...ys), y1 = Math.max(...ys, 2020);
      years = []; for (let y = y0; y <= y1; y++) years.push(y);
      vals = years.map((y) => list.filter((p) => p.year === y).length);
      unit = `${list.length} shown`;
    }
    const max = Math.max(1, ...vals);
    $("#pubCount").textContent = unit;
    $("#pubBars").innerHTML = years.map((y, i) => `
      <div class="bar"><div class="bar-fill ${chartMode === "cites" ? "alt" : ""}" style="height:${Math.max(3, (vals[i] / max) * 82)}%"><span>${vals[i] || ""}</span></div><span class="bar-year">${y}</span></div>`).join("");
  }

  function renderPubs() {
    const q = pubQuery.trim().toLowerCase();
    const list = P.filter((p) =>
      (pubFilter === "all" || (pubFilter === "first" ? p.first : p.type === pubFilter)) &&
      (!q || (strip(p.title) + " " + p.venue + " " + p.authors + " " + p.year).toLowerCase().includes(q)));
    list.sort(pubSort === "cites"
      ? (a, b) => (b.cites ?? -1) - (a.cites ?? -1) || (b.year ?? 9999) - (a.year ?? 9999)
      : (a, b) => (b.year ?? 9999) - (a.year ?? 9999) || (b.cites ?? -1) - (a.cites ?? -1));
    $("#pubList").innerHTML = list.length ? list.map((p, n) => `
      <li><button class="row" data-id="${p.id}">
        <span class="pub-num">${String(n + 1).padStart(2, "0")}</span>
        <span class="row-main">
          <span class="row-title">${p.title}</span>
          <span class="row-sub" style="display:block">${p.first ? '<span class="badge b-first">1st author</span>' : ""}${typeBadge[p.type]}<span class="pub-venue">${esc(p.venue)}</span> · ${esc(p.details)}${p.year ? " · " + p.year : ""}</span>
        </span>
        ${citeLabel(p)}
        <span class="chev">›</span>
      </button></li>`).join("") : `<li class="empty">No publications match “${esc(pubQuery)}”.</li>`;
    drawBars(list);
  }
  const segBind = (sel, fn) => $(sel).addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$(sel + " button").forEach((x) => x.classList.toggle("active", x === b));
    fn(b); renderPubs();
  });
  segBind("#pubTabs", (b) => (pubFilter = b.dataset.f));
  segBind("#pubSort", (b) => (pubSort = b.dataset.s));
  segBind("#chartMode", (b) => (chartMode = b.dataset.m));
  $("#pubSearch").addEventListener("input", (e) => { pubQuery = e.target.value; renderPubs(); });
  $("#pubList").addEventListener("click", (e) => {
    const b = e.target.closest(".row"); if (!b) return;
    const p = P[+b.dataset.id];
    const generic = /^Chapter in/.test(p.title);
    const q = generic ? `Sahoo ${p.venue}` : strip(p.title);
    openSheet(`
      <span class="app-icon i-red">❡</span>
      <h3 id="sheetTitle">${p.title}</h3>
      <div class="sb-meta">${esc(p.authors).replace(/Sahoo D/g, "<strong>Sahoo D</strong>")}</div>
      <p><span class="pub-venue">${esc(p.venue)}</span> · ${esc(p.details)}${p.year ? " · " + p.year : ""}</p>
      <p>${p.first ? '<span class="badge b-first">1st author</span>' : ""}${typeBadge[p.type] || ""}${p.cites != null ? `<span class="badge b-proc">Cited by ${p.cites}</span>` : ""}</p>
      <div class="sb-actions">${p.doi ? `<a class="btn btn-primary" target="_blank" rel="noopener" href="https://doi.org/${esc(p.doi)}">Open article ↗</a>` : ""}<a class="btn btn-tinted" target="_blank" rel="noopener" href="https://scholar.google.com/scholar?q=${encodeURIComponent(q)}">Find on Google Scholar ↗</a></div>`);
  });
  renderPubs();

  /* Awards — iOS notifications */
  $("#awardStack").innerHTML = window.AWARDS.map((a) => `
    <div class="notif glass reveal">
      <span class="app-icon sm ${a.color}">${a.icon}</span>
      <div style="flex:1">
        <div class="notif-head"><span>${esc(a.app)}</span><span>${esc(a.when)}</span></div>
        <div class="notif-title">${esc(a.title)}</div>
        <div class="notif-text">${esc(a.text)}</div>
      </div>
    </div>`).join("");

  $("#talkList").innerHTML = window.TALKS.map((t) => `
    <li><div class="row" style="cursor:default">
      <span class="app-icon sm ${t.color}">${t.icon}</span>
      <span class="row-main"><span class="row-title">${esc(t.title)}</span><span class="row-sub" style="display:block">${esc(t.where)} · ${esc(t.kind)}</span></span>
    </div></li>`).join("");

  // profile links → vertical contact sidebar in the hero
  const railItem = (l) => `
    <a class="cr-item" href="${esc(l.url)}" target="_blank" rel="noopener" aria-label="${esc(l.name)}">
      <span class="app-icon sm ${l.color}">${l.icon}</span><span class="cr-tip">${esc(l.name)} ↗</span>
    </a>`;
  const links = window.PROFILE_LINKS.filter((l) => l.url), isScholar = (l) => /scholar/i.test(l.name);
  const railTop = $("#railTop"), railLinks = $("#railLinks");
  if (railTop) railTop.innerHTML = links.filter(isScholar).map(railItem).join("");      // Google Scholar first
  if (railLinks) railLinks.innerHTML = links.filter((l) => !isScholar(l)).map(railItem).join("");

  $("#year").textContent = new Date().getFullYear();

  /* ---------------- Reveal + counters ---------------- */
  function countUp(el) {
    const target = +el.dataset.count, prefix = el.dataset.prefix || "";
    const dur = reduceMotion ? 1 : 1600, t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = prefix + Math.round(target * e).toLocaleString("en");
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      $$("[data-count]", en.target).forEach(countUp);
      $$(".ring", en.target).forEach((r) => r.classList.add("go"));
      revObs.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (el.closest(".widgets") ? (i % 6) * 70 : 0) + "ms"; revObs.observe(el); });

  /* ---------------- 3D tilt ---------------- */
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateZ(0)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------------- Physics helpers ---------------- */
  const LN2 = Math.log(2);
  const T0 = 2.67; // optical period at 800 nm, fs

  /* =========================================================
     3D hero: femtosecond pulse → birefringent crystal → SHG
     (glow halos, translucent field ribbons, beam core, sparks, nebula)
     ========================================================= */
  (function hero3D() {
    const canvas = $("#pulseCanvas");
    if (!window.THREE) { canvas.remove(); return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); }
    catch { canvas.remove(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 400);
    camera.position.set(0, 1.4, 18);
    const world = new THREE.Group(); scene.add(world);
    world.scale.setScalar(0.68); // overall size of the pulse + crystal scene (1 = original)
    world.position.y = 0.9;      // lift the scene upwards (larger = higher)
    const stage = $(".hero-stage");

    const cep = $("#cepRange"), dur = $("#durRange"), shgSw = $("#shgSwitch"), envSw = $("#envSwitch");
    if (cep) cep.addEventListener("input", () => ($("#cepOut").textContent = (+cep.value).toFixed(2) + "π"));
    dur.addEventListener("input", () => ($("#durOut").textContent = (+dur.value).toFixed(1) + " fs"));

    // ---- soft-glow shader (points get a gaussian falloff; meshes use per-vertex alpha) ----
    const glowMats = [];
    function glowMat(size, isPoints, alpha = 1) {
      const m = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uSize: { value: size }, uPR: { value: renderer.getPixelRatio() }, uPoints: { value: isPoints ? 1 : 0 }, uAlpha: { value: alpha } },
        vertexShader: `
          attribute vec3 aColor; attribute float aAlpha; varying vec3 vC; varying float vA;
          uniform float uSize; uniform float uPR;
          void main(){ vC=aColor; vA=aAlpha; vec4 mv=modelViewMatrix*vec4(position,1.0);
            gl_PointSize=uSize*uPR*(300.0/-mv.z); gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `
          varying vec3 vC; varying float vA; uniform float uPoints; uniform float uAlpha;
          void main(){ float a=vA*uAlpha;
            if(uPoints>0.5){ float d=length(gl_PointCoord-0.5)*2.0; if(d>1.0) discard; a*=exp(-d*d*3.2); }
            if(a<0.002) discard; gl_FragColor=vec4(vC,a); }`
      });
      glowMats.push(m); return m;
    }
    function buf(n) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      g.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      g.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(n), 1));
      return g;
    }
    function ribbon(n) { // strip between the axis (even vertices) and the field curve (odd vertices)
      const g = buf(2 * n), idx = [];
      for (let i = 0; i < n - 1; i++) { const a = 2 * i, b = a + 1, c = a + 2, d = a + 3; idx.push(a, b, d, a, d, c); }
      g.setIndex(idx); return g;
    }

    const N = 1100, X0 = -13, X1 = 13, LAMBDA = 1.25, K = (2 * Math.PI) / LAMBDA, AMP = 1.7;
    const C = (h) => new THREE.Color(h);
    const R1 = C("#ff2d55"), R2 = C("#ff9f0a"), R3 = C("#ffe27a"), V1 = C("#7d5cff"), V2 = C("#64d2ff"), V3 = C("#e8f6ff");
    const mix3 = (a, b, c, t) => (t < 0.5 ? a.clone().lerp(b, t * 2) : b.clone().lerp(c, (t - 0.5) * 2));

    const fundG = buf(N), shgG = buf(N), envG = buf(N * 2), coreG = buf(N);
    const fundR = ribbon(N), shgR = ribbon(N);
    world.add(
      new THREE.Mesh(fundR, glowMat(0, false, 0.55)),
      new THREE.Mesh(shgR, glowMat(0, false, 0.6)),
      new THREE.Points(coreG, glowMat(0.75, true, 0.45)),   // bright beam core
      new THREE.Points(fundG, glowMat(1.15, true, 0.12)),   // halo (fake bloom)
      new THREE.Points(shgG, glowMat(0.95, true, 0.14)),
      new THREE.Points(fundG, glowMat(0.24, true, 1)),      // crisp field line
      new THREE.Points(shgG, glowMat(0.2, true, 1)),
      new THREE.Points(envG, glowMat(0.08, true, 1))
    );
    const axisMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.18 });
    world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(X0 - 4, 0, 0), new THREE.Vector3(X1 + 4, 0, 0)]), axisMat));

    // ---- birefringent crystal ----
    const crystal = new THREE.Group();
    const cBox = new THREE.BoxGeometry(1.1, 3.6, 3.6);
    const cMesh = new THREE.Mesh(cBox, new THREE.MeshBasicMaterial({ color: 0x5e5ce6, transparent: true, opacity: 0.1, depthWrite: false }));
    const cGlow = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.3, 3.3), new THREE.MeshBasicMaterial({ color: 0x8f7bff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    const cEdges = new THREE.LineSegments(new THREE.EdgesGeometry(cBox), new THREE.LineBasicMaterial({ color: 0xb3a8ff, transparent: true, opacity: 0.85 }));
    const latPts = [];
    for (let i = -1; i <= 1; i++) for (let j = -3; j <= 3; j++) for (let k = -3; k <= 3; k++) latPts.push(i * 0.4, j * 0.5, k * 0.5);
    const latG = new THREE.BufferGeometry(); latG.setAttribute("position", new THREE.Float32BufferAttribute(latPts, 3));
    const lattice = new THREE.Points(latG, new THREE.PointsMaterial({ color: 0xcfc8ff, size: 0.07, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
    crystal.add(cMesh, cGlow, cEdges, lattice);
    crystal.rotation.x = 0.35;
    world.add(crystal);

    // ---- sparks emitted by the crystal during frequency doubling ----
    const SP = 320, spG = buf(SP), spV = new Float32Array(SP * 3), spLife = new Float32Array(SP);
    world.add(new THREE.Points(spG, glowMat(0.32, true, 1)));
    let spNext = 0;
    function spawn(n) {
      const p = spG.attributes.position.array, c = spG.attributes.aColor.array;
      for (let k = 0; k < n; k++) {
        const i = spNext; spNext = (spNext + 1) % SP;
        p[i * 3] = (Math.random() - 0.5) * 0.8; p[i * 3 + 1] = (Math.random() - 0.5) * 2.8; p[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
        const th = Math.random() * Math.PI * 2, sp = 0.6 + Math.random() * 1.6;
        spV[i * 3] = 0.8 + Math.random() * 1.8; spV[i * 3 + 1] = Math.cos(th) * sp; spV[i * 3 + 2] = Math.sin(th) * sp;
        spLife[i] = 1;
        const col = mix3(V1, V2, V3, Math.random());
        c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
      }
    }

    // ---- background: stars + nebula ----
    const S = 900, sp = new Float32Array(S * 3);
    for (let i = 0; i < S; i++) { sp[i * 3] = (Math.random() - 0.5) * 80; sp[i * 3 + 1] = (Math.random() - 0.5) * 44; sp[i * 3 + 2] = -Math.random() * 50 - 4; }
    const starG = new THREE.BufferGeometry(); starG.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.08, transparent: true, opacity: 0.7, color: 0xffffff, depthWrite: false });
    const stars = new THREE.Points(starG, starMat); scene.add(stars);
    function softTex(hex) {
      const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, hex); g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
    }
    const nebula = [["rgba(94,92,230,0.9)", -14, 4, 34], ["rgba(255,45,85,0.7)", 12, -3, 30], ["rgba(100,210,255,0.6)", 2, 7, 26]].map(([col, x, y, s]) => {
      const m = new THREE.SpriteMaterial({ map: softTex(col), transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false });
      const sprite = new THREE.Sprite(m); sprite.position.set(x, y, -34); sprite.scale.set(s, s, 1); scene.add(sprite); return sprite;
    });

    function onTheme(t) {
      const dark = t === "dark";
      glowMats.forEach((m) => { m.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending; m.needsUpdate = true; });
      axisMat.color.set(dark ? 0xffffff : 0x000000);
      starMat.color.set(dark ? 0xffffff : 0x5856d6); starMat.opacity = dark ? 0.7 : 0.3;
      cEdges.material.color.set(dark ? 0xb3a8ff : 0x5856d6);
      nebula.forEach((n) => (n.visible = dark));
    }
    themeListeners.push(onTheme); onTheme(root.dataset.theme);

    // ---- interaction: drag to rotate (inertia) + parallax ----
    let rotY = -0.42, rotX = 0.1, vY = 0, vX = 0, dragging = false, px = 0, py = 0, mx = 0, my = 0;
    canvas.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      vY = (e.clientX - px) * 0.005; vX = (e.clientY - py) * 0.003; px = e.clientX; py = e.clientY;
      rotY += vY; rotX = Math.max(-0.8, Math.min(0.9, rotX + vX));
    });
    const endDrag = () => (dragging = false);
    canvas.addEventListener("pointerup", endDrag); canvas.addEventListener("pointercancel", endDrag);
    window.addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });

    // keep the beam centred in the free "stage" area above the intro card
    function frameView() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      const hr = canvas.getBoundingClientRect(), sr = stage ? stage.getBoundingClientRect() : hr;
      const f = Math.min(0.5, Math.max(0.12, (sr.top + sr.height / 2 - hr.top) / h));
      camera.setViewOffset(w, h, 0, (0.5 - f) * h, w, h);
      const stageFrac = Math.max(0.25, Math.min(1, (sr.height || h) / h));
      const mobile = w < 760;
      world.scale.setScalar(mobile ? 0.5 : 0.68); // smaller scene on phones (desktop 0.68)
      camera.position.z = (mobile ? 30 : w < 1080 ? 22 : 18) / Math.sqrt(stageFrac * 1.6);
      camera.updateProjectionMatrix();
    }
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      glowMats.forEach((m) => (m.uniforms.uPR.value = renderer.getPixelRatio()));
      frameView();
    }
    addEventListener("resize", resize); resize();
    if (window.ResizeObserver && stage) new ResizeObserver(frameView).observe(stage);

    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

    const speed = reduceMotion ? 1.2 : 9; // pulse travel speed (scene units per second)
    let xc = X0 - 6, last = performance.now(), tAcc = 0;

    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!visible || document.hidden) return;
      tAcc += dt;

      const phi = cep ? +cep.value * Math.PI : 0, tau = +dur.value; // CEP fixed at 0 when its slider is absent
      const w = (tau / T0) * LAMBDA, a = (2 * LN2) / (w * w), span = Math.max(6, w * 1.6);
      xc += speed * dt;
      if (xc > X1 + span) xc = X0 - span;
      const showShg = shgSw.checked, showEnv = envSw.checked, cryFront = -0.55;
      const xc2 = xc - 0.12 * Math.max(0, xc - cryFront); // SHG walks off (group-velocity mismatch)

      const fp = fundG.attributes.position.array, fc = fundG.attributes.aColor.array, fa = fundG.attributes.aAlpha.array;
      const hp = shgG.attributes.position.array, hc = shgG.attributes.aColor.array, ha = shgG.attributes.aAlpha.array;
      const ep = envG.attributes.position.array, ec = envG.attributes.aColor.array, ea = envG.attributes.aAlpha.array;
      const cp = coreG.attributes.position.array, cc = coreG.attributes.aColor.array, ca = coreG.attributes.aAlpha.array;
      const rp = fundR.attributes.position.array, rc = fundR.attributes.aColor.array, ra = fundR.attributes.aAlpha.array;
      const sp2 = shgR.attributes.position.array, sc = shgR.attributes.aColor.array, sa = shgR.attributes.aAlpha.array;

      for (let i = 0; i < N; i++) {
        const x = X0 + ((X1 - X0) * i) / (N - 1), u = x - xc, e = Math.exp(-a * u * u);
        const after = x > cryFront, depl = after && showShg ? 0.82 : 1;
        const E = AMP * depl * e * Math.cos(K * u + phi);
        const col = mix3(R1, R2, R3, Math.min(1, Math.abs(E) / AMP));
        fp[i * 3] = x; fp[i * 3 + 1] = E; fp[i * 3 + 2] = 0;
        fc[i * 3] = col.r; fc[i * 3 + 1] = col.g; fc[i * 3 + 2] = col.b; fa[i] = Math.min(1, e * 1.25);
        // ribbon (axis → field)
        const j = 2 * i;
        rp[j * 3] = x; rp[j * 3 + 1] = 0; rp[j * 3 + 2] = 0; rp[(j + 1) * 3] = x; rp[(j + 1) * 3 + 1] = E; rp[(j + 1) * 3 + 2] = 0;
        rc[j * 3] = R1.r; rc[j * 3 + 1] = R1.g; rc[j * 3 + 2] = R1.b; rc[(j + 1) * 3] = col.r; rc[(j + 1) * 3 + 1] = col.g; rc[(j + 1) * 3 + 2] = col.b;
        ra[j] = 0.05 * e; ra[j + 1] = 0.5 * e;
        // beam core
        cp[i * 3] = x; cp[i * 3 + 1] = 0; cp[i * 3 + 2] = 0;
        cc[i * 3] = 1; cc[i * 3 + 1] = 0.85; cc[i * 3 + 2] = 0.75; ca[i] = e * e;

        // type-I SHG: orthogonal polarisation (z), carrier 2ω, envelope ∝ e²
        const u2 = x - xc2, e2 = Math.exp(-2 * a * u2 * u2);
        const ramp = Math.min(1, Math.max(0, (x - cryFront) / 1.1)), on = showShg && after;
        const E2 = on ? AMP * 0.8 * ramp * e2 * Math.cos(2 * (K * u2 + phi)) : 0;
        const col2 = mix3(V1, V2, V3, Math.min(1, Math.abs(E2) / AMP));
        hp[i * 3] = x; hp[i * 3 + 1] = 0; hp[i * 3 + 2] = E2;
        hc[i * 3] = col2.r; hc[i * 3 + 1] = col2.g; hc[i * 3 + 2] = col2.b; ha[i] = on ? Math.min(1, e2 * ramp * 1.4) : 0;
        sp2[j * 3] = x; sp2[j * 3 + 1] = 0; sp2[j * 3 + 2] = 0; sp2[(j + 1) * 3] = x; sp2[(j + 1) * 3 + 1] = 0; sp2[(j + 1) * 3 + 2] = E2;
        sc[j * 3] = V1.r; sc[j * 3 + 1] = V1.g; sc[j * 3 + 2] = V1.b; sc[(j + 1) * 3] = col2.r; sc[(j + 1) * 3 + 1] = col2.g; sc[(j + 1) * 3 + 2] = col2.b;
        sa[j] = on ? 0.05 * e2 * ramp : 0; sa[j + 1] = on ? 0.55 * e2 * ramp : 0;

        // envelope ±
        const eA = showEnv ? 0.5 * e : 0;
        for (let s = 0; s < 2; s++) {
          const k2 = i * 2 + s;
          ep[k2 * 3] = x; ep[k2 * 3 + 1] = (s ? -1 : 1) * AMP * depl * e; ep[k2 * 3 + 2] = 0;
          ec[k2 * 3] = 1; ec[k2 * 3 + 1] = 0.88; ec[k2 * 3 + 2] = 0.45; ea[k2] = eA;
        }
      }
      [fundG, shgG, envG, coreG, fundR, shgR].forEach((g) => { g.attributes.position.needsUpdate = true; g.attributes.aColor.needsUpdate = true; g.attributes.aAlpha.needsUpdate = true; });

      // crystal glows while the pulse is inside; sparks while doubling
      const inside = Math.exp(-(xc * xc) / (0.5 * span));
      cMesh.material.opacity = 0.08 + 0.22 * inside;
      cGlow.material.opacity = 0.35 * inside;
      lattice.material.opacity = 0.4 + 0.6 * inside;
      crystal.rotation.y = Math.sin(tAcc * 0.4) * 0.08;
      if (showShg && inside > 0.25 && !reduceMotion) spawn(Math.round(10 * inside));
      const spp = spG.attributes.position.array, spa = spG.attributes.aAlpha.array;
      for (let i = 0; i < SP; i++) {
        if (spLife[i] <= 0) { spa[i] = 0; continue; }
        spLife[i] -= dt * 0.9;
        spp[i * 3] += spV[i * 3] * dt; spp[i * 3 + 1] += spV[i * 3 + 1] * dt; spp[i * 3 + 2] += spV[i * 3 + 2] * dt;
        spa[i] = Math.max(0, spLife[i]) ** 1.5;
      }
      spG.attributes.position.needsUpdate = true; spG.attributes.aAlpha.needsUpdate = true;

      if (!dragging) { vY *= 0.94; vX *= 0.94; rotY += vY; rotX = Math.max(-0.8, Math.min(0.9, rotX + vX)); }
      world.rotation.y = rotY + mx * 0.25 + (reduceMotion ? 0 : Math.sin(tAcc * 0.15) * 0.08);
      world.rotation.x = rotX + my * 0.12;
      stars.rotation.y = tAcc * 0.01; stars.position.x = -mx * 1.5; stars.position.y = my;
      starMat.opacity = (root.dataset.theme === "dark" ? 0.6 : 0.25) + 0.15 * Math.sin(tAcc * 1.7);
      nebula.forEach((n, i) => { n.material.rotation = tAcc * 0.02 * (i % 2 ? 1 : -1); n.position.x += Math.sin(tAcc * 0.1 + i) * 0.002; });

      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  })();

  /* =========================================================
     Feature card SVG: fundamental + SHG fields
     ========================================================= */
  (function featureSVG() {
    const red = $("#svgRed"), blue = $("#svgBlue");
    if (!red) return;
    let vis = false;
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(red.closest("svg"));
    function path(fn) {
      let d = "";
      for (let x = 0; x <= 300; x += 2) d += (x ? "L" : "M") + x + " " + fn(x).toFixed(2);
      return d;
    }
    function tick(t) {
      requestAnimationFrame(tick);
      if (!vis) return;
      const s = reduceMotion ? 0 : t / 1000;
      red.setAttribute("d", path((x) => { const u = (x - 150) / 45; return 70 - 45 * Math.exp(-u * u) * Math.cos(x / 9 - s * 3); }));
      blue.setAttribute("d", path((x) => { const u = (x - 150) / 32; return 125 - 30 * Math.exp(-u * u) * Math.cos(x / 4.5 - s * 6); }));
    }
    requestAnimationFrame(tick);
  })();

  /* =========================================================
     TIPTOE lab — simulated delay scan
     δN/N(τ) ∝ E_s(τ)  (perturbative regime, sub-cycle gate)
     ========================================================= */
  (function lab() {
    const cv = $("#labCanvas"), ctx = cv.getContext("2d");
    const cepR = $("#labCep"), tauR = $("#labTau"), noiseR = $("#labNoise");
    const TMIN = -20, TMAX = 20, NB = 161, DT = (TMAX - TMIN) / (NB - 1);
    const TAU_S = 7, TAU_D = 5;
    let data = new Array(NB).fill(NaN), mode = "scan", scanIdx = 0, tau = 0, acc = 0, vis = false;

    const Es = (t) => Math.exp((-2 * LN2 * t * t) / (TAU_S * TAU_S)) * Math.cos((2 * Math.PI * t) / T0 + +cepR.value * Math.PI);
    const Ed = (t) => Math.exp((-2 * LN2 * t * t) / (TAU_D * TAU_D)) * Math.cos((2 * Math.PI * t) / T0);
    const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const measure = (t) => Es(t) + gauss() * 0.28 * +noiseR.value;

    cepR.addEventListener("input", () => { $("#labCepOut").textContent = (+cepR.value).toFixed(2) + "π"; data.fill(NaN); scanIdx = 0; });
    noiseR.addEventListener("input", () => { const n = +noiseR.value; $("#labNoiseOut").textContent = n < 0.2 ? "low" : n < 0.6 ? "medium" : "high"; });
    tauR.addEventListener("input", () => {
      tau = +tauR.value; $("#labTauOut").textContent = tau.toFixed(1) + " fs";
      const i = Math.round((tau - TMIN) / DT); data[i] = measure(TMIN + i * DT);
    });
    $("#labMode").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      mode = b.dataset.mode;
      $$("#labMode button").forEach((x) => x.classList.toggle("active", x === b));
      tauR.disabled = mode !== "manual"; paintSlider(tauR);
      if (mode === "manual") { data.fill(NaN); tauR.value = tau.toFixed(1); paintSlider(tauR); } else { data.fill(NaN); scanIdx = 0; }
    });
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(cv);

    function size() {
      const r = cv.getBoundingClientRect(), pr = Math.min(devicePixelRatio, 2);
      cv.width = r.width * pr; cv.height = r.height * pr; ctx.setTransform(pr, 0, 0, pr, 0, 0);
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv); else addEventListener("resize", size);

    let last = performance.now();
    function draw(now) {
      requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!vis) return;
      if (mode === "scan") {
        acc += dt * (reduceMotion ? 8 : 30);
        while (acc >= 1) {
          acc -= 1;
          data[scanIdx] = measure(TMIN + scanIdx * DT);
          tau = TMIN + scanIdx * DT;
          scanIdx++;
          if (scanIdx >= NB) { scanIdx = 0; data.fill(NaN); }
        }
        tauR.value = tau.toFixed(1); paintSlider(tauR); $("#labTauOut").textContent = tau.toFixed(1) + " fs";
      }

      const W = cv.clientWidth, H = cv.clientHeight, padL = 44, padR = 16;
      const X = (t) => padL + ((t - TMIN) / (TMAX - TMIN)) * (W - padL - padR);
      const topH = H * 0.32, botY0 = topH + 18, botH = H - botY0 - 30;
      ctx.clearRect(0, 0, W, H);

      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1;
      ctx.fillStyle = "rgba(235,235,245,0.45)"; ctx.font = "11px -apple-system, Inter, sans-serif"; ctx.textAlign = "center";
      for (let t = TMIN; t <= TMAX; t += 5) {
        ctx.beginPath(); ctx.moveTo(X(t), 8); ctx.lineTo(X(t), H - 26); ctx.stroke();
        if (t < TMAX) ctx.fillText(t, X(t), H - 10);
      }
      ctx.textAlign = "right"; ctx.fillText("τ (fs) →", W - padR, H - 10);
      ctx.save(); ctx.translate(14, botY0 + botH / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText("δN/N  (arb.)", 0, 0); ctx.restore();
      ctx.save(); ctx.translate(14, topH / 2 + 6); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText("fields", 0, 0); ctx.restore();

      // top lane: drive pulse at delay τ (gate) + signal
      const topMid = topH / 2 + 6, topA = topH * 0.42;
      ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(100,210,255,0.45)"; ctx.beginPath();
      for (let px = padL; px <= W - padR; px++) { const t = TMIN + ((px - padL) / (W - padL - padR)) * (TMAX - TMIN); const y = topMid - topA * 0.35 * Es(t); px === padL ? ctx.moveTo(px, y) : ctx.lineTo(px, y); }
      ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = "#ff375f"; ctx.shadowColor = "#ff375f"; ctx.shadowBlur = 10; ctx.beginPath();
      for (let px = padL; px <= W - padR; px++) { const t = TMIN + ((px - padL) / (W - padL - padR)) * (TMAX - TMIN); const y = topMid - topA * Ed(t - tau); px === padL ? ctx.moveTo(px, y) : ctx.lineTo(px, y); }
      ctx.stroke(); ctx.shadowBlur = 0;

      // ionisation gate (sub-cycle window) band through both lanes
      const gx = X(tau), gw = Math.max(6, (X(0.45) - X(0)));
      const grad = ctx.createLinearGradient(gx - gw, 0, gx + gw, 0);
      grad.addColorStop(0, "rgba(255,214,10,0)"); grad.addColorStop(0.5, "rgba(255,214,10,0.28)"); grad.addColorStop(1, "rgba(255,214,10,0)");
      ctx.fillStyle = grad; ctx.fillRect(gx - gw, 6, gw * 2, H - 32);

      // separator
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.beginPath(); ctx.moveTo(padL, topH + 10); ctx.lineTo(W - padR, topH + 10); ctx.stroke();

      // bottom lane: true field + measured points
      const bMid = botY0 + botH / 2, bA = botH * 0.4;
      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.beginPath(); ctx.moveTo(padL, bMid); ctx.lineTo(W - padR, bMid); ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = "#64d2ff"; ctx.beginPath();
      for (let px = padL; px <= W - padR; px++) { const t = TMIN + ((px - padL) / (W - padL - padR)) * (TMAX - TMIN); const y = bMid - bA * Es(t); px === padL ? ctx.moveTo(px, y) : ctx.lineTo(px, y); }
      ctx.stroke();
      ctx.fillStyle = "#ffd60a"; ctx.shadowColor = "#ffd60a"; ctx.shadowBlur = 6;
      for (let i = 0; i < NB; i++) {
        if (Number.isNaN(data[i])) continue;
        ctx.beginPath(); ctx.arc(X(TMIN + i * DT), bMid - bA * data[i], 2.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;

      // readout
      const i0 = Math.round((tau - TMIN) / DT);
      const val = data[i0];
      ctx.textAlign = "left"; ctx.font = "600 12px 'JetBrains Mono', monospace"; ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(`τ = ${tau.toFixed(1)} fs   δN/N = ${Number.isNaN(val) ? "—" : val.toFixed(3)}`, padL + 6, botY0 + 6);
    }
    requestAnimationFrame(draw);
  })();

  /* =========================================================
     IIT Madras — illustrative pump–probe setup (schematic, not to scale)
     30 fs CPA Ti:sapphire @ 800 nm → SHG (400 nm) → THG (266.7 nm), collinear.
     A prism disperses the three colours; tilting a mirror steers one of them
     through an iris onto the sample. The probe reaches the sample through a
     delay stage; τ sets its arrival time relative to the pump.
     ========================================================= */
  (function tas() {
    const cv = $("#tasCanvas");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const tiltR = $("#tasTilt"), tauR = $("#tasTau");
    const BEAMS = [
      { label: "800 nm", eV: "1.55 eV", col: "#ff375f", dev: 0.16 },
      { label: "400 nm", eV: "3.10 eV", col: "#8f7bff", dev: 0.25 },
      { label: "266 nm", eV: "4.65 eV", col: "#e05cff", dev: 0.36 }
    ];
    const PROBE = "#ff9f0a", FONT = "11px -apple-system, Inter, sans-serif";
    const MIRROR_HALF = 52, IRIS_GAP = 6, PERIOD = 3.0, T_PUMP = 1.5, PS_TO_S = 0.12;
    let W = 0, H = 0, g = null, vis = false, last = performance.now(), clock = 0;
    let alpha = 0, target = null, sel = -1;

    const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
    const add = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1]];
    const norm = (a) => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
    const plen = (p) => p.reduce((L, q, i) => (i ? L + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0);
    function pointAt(p, s) {
      if (s < 0) return null;
      for (let i = 1; i < p.length; i++) {
        const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
        if (s <= d) return add(p[i - 1], sub(p[i], p[i - 1]), s / d);
        s -= d;
      }
      return null;
    }

    // where a dispersed ray meets the (infinite) mirror line, and its position s along the mirror
    function hitMirror(b, a) {
      const m = [Math.cos(a), Math.sin(a)], den = cross(b.d, m);
      if (Math.abs(den) < 1e-6) return null;
      const CE = sub(g.C, g.E);
      return { p: add(g.E, b.d, cross(CE, m) / den), s: cross(CE, b.d) / den };
    }
    // full optical path of one colour for the current mirror angle
    function trace(b, a) {
      const h = hitMirror(b, a);
      if (!h || Math.abs(h.s) > MIRROR_HALF) return { pts: [g.E, add(g.E, b.d, 900)], pass: false };
      const n = [-Math.sin(a), Math.cos(a)], dn = b.d[0] * n[0] + b.d[1] * n[1];
      const r = [b.d[0] - 2 * dn * n[0], b.d[1] - 2 * dn * n[1]];
      const den = cross(r, g.plate), IH = sub(g.I, h.p);
      const t = cross(IH, g.plate) / den, s = cross(IH, r) / den;
      if (!(t > 0)) return { pts: [g.E, h.p, add(h.p, r, 400)], pass: false };
      const onPlate = add(h.p, r, t);
      if (Math.abs(s) > IRIS_GAP) return { pts: [g.E, h.p, onPlate], pass: false, blocked: onPlate };
      const SH = sub(g.S, h.p), atSample = add(h.p, r, SH[0] * r[0] + SH[1] * r[1]); // closest point to the sample
      return { pts: [g.E, h.p, atSample, add(atSample, r, 56)], pass: true, sample: atSample, r };
    }

    function layout() {
      const yP = 58, S = [Math.min(W - 140, 470), 250];
      g = { yP, S, laser: [8, yP - 20, 100, 40], BS: [132, yP], SHG: 158, THG: 206, E: [292, yP + 10] };
      g.C = add(g.E, [Math.cos(BEAMS[1].dev), Math.sin(BEAMS[1].dev)], 80); // mirror centred on the middle (400 nm) ray
      g.I = add(g.C, sub(S, g.C), 0.5);
      const u = norm(sub(S, g.C));
      g.plate = [-u[1], u[0]];
      g.yQ = 300; g.ysMin = 322; g.ysMax = H - 18;
      BEAMS.forEach((b) => {
        b.d = [Math.cos(b.dev), Math.sin(b.dev)];
        let a = 0.8; // solve mirror angle that sends this colour to the sample
        for (let k = 0; k < 8; k++) {
          const h = hitMirror(b, a); if (!h) break;
          const o = norm(sub(g.I, h.p)), nn = [o[0] - b.d[0], o[1] - b.d[1]]; // aim through the iris centre
          a = Math.atan2(nn[1], nn[0]) + Math.PI / 2;
        }
        b.alpha = ((a % Math.PI) + Math.PI) % Math.PI; // mirror orientation is defined modulo 180°
      });
      const degs = BEAMS.map((b) => (b.alpha * 180) / Math.PI);
      tiltR.min = (Math.min(...degs) - 8).toFixed(1); tiltR.max = (Math.max(...degs) + 8).toFixed(1);
      if (target === null && sel === -1 && alpha === 0) { alpha = BEAMS[0].alpha; sel = 0; }
      syncTiltSlider();
    }
    function syncTiltSlider() {
      tiltR.value = ((alpha * 180) / Math.PI).toFixed(1); paintSlider(tiltR);
      $("#tasTiltOut").textContent = ((alpha * 180) / Math.PI).toFixed(1) + "°";
    }

    const BASE_W = 620, BASE_H = 420; // design size; narrower cards scale the whole drawing down
    function size() {
      const cw = cv.getBoundingClientRect().width, pr = Math.min(devicePixelRatio, 2);
      if (!cw) return;
      const k = Math.min(1, cw / BASE_W), ch = Math.round(BASE_H * k);
      if (cv.style.height !== ch + "px") cv.style.height = ch + "px";
      W = cw / k; H = BASE_H;
      cv.width = Math.max(1, cw * pr); cv.height = Math.max(1, ch * pr); ctx.setTransform(pr * k, 0, 0, pr * k, 0, 0);
      layout();
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv); else addEventListener("resize", size);
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(cv);

    $("#tasPump").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      target = BEAMS[+b.dataset.i].alpha;
    });
    tiltR.addEventListener("input", () => { target = null; alpha = (+tiltR.value * Math.PI) / 180; $("#tasTiltOut").textContent = (+tiltR.value).toFixed(1) + "°"; });
    tauR.addEventListener("input", () => ($("#tasTauOut").textContent = (+tauR.value).toFixed(2) + " ps"));
    $("#tasTauOut").textContent = (+tauR.value).toFixed(2) + " ps";

    // ---------- drawing helpers ----------
    function line(pts, col, w = 2, glow = 0, alphaV = 1) {
      ctx.save(); ctx.globalAlpha = alphaV; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.shadowColor = col; ctx.shadowBlur = glow;
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
    }
    function label(txt, x, y, col = "rgba(235,235,245,0.6)", align = "center", bold = false) {
      ctx.font = (bold ? "600 " : "") + FONT; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(txt, x, y);
    }
    function box(x, y, w, h, t1, t2, col, on = true) {
      ctx.fillStyle = on ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)";
      ctx.strokeStyle = on ? col : "rgba(255,255,255,0.2)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, 6) : ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke();
      label(t1, x + w / 2, y + (t2 ? h / 2 - 2 : h / 2 + 4), "rgba(255,255,255,0.92)", "center", true);
      if (t2) label(t2, x + w / 2, y + h / 2 + 12, "rgba(255,255,255,0.55)");
    }
    function pulse(p, col, r = 4.5) {
      if (!p) return;
      ctx.save(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fill(); ctx.restore();
    }

    function draw(now) {
      requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!vis || !g) return;
      clock = (clock + dt * (reduceMotion ? 0.35 : 1)) % PERIOD;
      if (target !== null) { // smooth mirror rotation
        alpha += (target - alpha) * Math.min(1, dt * 6);
        if (Math.abs(target - alpha) < 1e-4) { alpha = target; target = null; }
        syncTiltSlider();
      }
      const tau = +tauR.value;
      const { yP, S, BS, E, C, I } = g;
      ctx.clearRect(0, 0, W, H);

      // ---- source + harmonic generation (collinear) ----
      const xL = g.laser[0] + g.laser[2];
      line([[xL, yP], [g.SHG, yP]], BEAMS[0].col, 2.2, 8);
      line([[g.SHG + 30, yP - 2], [g.THG, yP - 2]], BEAMS[0].col, 2, 6);
      line([[g.SHG + 30, yP + 2], [g.THG, yP + 2]], BEAMS[1].col, 2, 6);
      [[-3, 0], [0, 1], [3, 2]].forEach(([o, k]) => line([[g.THG + 30, yP + o], [270, yP + o]], BEAMS[k].col, 1.8, 6));
      line([[270, yP], E], "rgba(255,255,255,0.9)", 2, 6); // inside the prism
      box(...g.laser, "Ti:Sa CPA", "800 nm · 30 fs", BEAMS[0].col);
      box(g.SHG, yP - 14, 30, 28, "SHG", null, BEAMS[1].col);
      box(g.THG, yP - 14, 30, 28, "THG", null, BEAMS[2].col);
      label("ω", g.SHG + 15, yP + 28); label("ω + 2ω", g.THG + 15, yP + 28);
      // beamsplitter
      ctx.save(); ctx.translate(BS[0], BS[1]); ctx.rotate(Math.PI / 4); ctx.fillStyle = "rgba(200,220,255,0.6)"; ctx.fillRect(-11, -2, 22, 4); ctx.restore();
      label("BS", BS[0], yP - 16);
      // prism
      ctx.save(); ctx.beginPath(); ctx.moveTo(260, yP + 30); ctx.lineTo(304, yP + 30); ctx.lineTo(282, yP - 16); ctx.closePath();
      ctx.fillStyle = "rgba(160,200,255,0.12)"; ctx.strokeStyle = "rgba(160,200,255,0.75)"; ctx.lineWidth = 1.3; ctx.fill(); ctx.stroke(); ctx.restore();
      label("prism", 282, yP + 44);

      // ---- dispersion → tilting mirror → iris → sample ----
      sel = -1;
      const traces = BEAMS.map((b, k) => { const tr = trace(b, alpha); if (tr.pass) sel = k; return tr; });
      traces.forEach((tr, k) => {
        const b = BEAMS[k];
        if (tr.pass) line(tr.pts.slice(0, 3), b.col, 2.6, 14);
        else line(tr.pts, b.col, 1.6, 4, 0.55);
        if (tr.pass) line(tr.pts.slice(2), b.col, 1.4, 0, 0.35); // residual pump → beam dump
        if (tr.blocked) { ctx.fillStyle = b.col; ctx.globalAlpha = 0.7; ctx.fillRect(tr.blocked[0] - 2, tr.blocked[1] - 2, 4, 4); ctx.globalAlpha = 1; }
      });
      // mirror
      const m = [Math.cos(alpha), Math.sin(alpha)], nrm = [-Math.sin(alpha), Math.cos(alpha)];
      const m1 = add(C, m, -MIRROR_HALF), m2 = add(C, m, MIRROR_HALF);
      line([m1, m2], "rgba(230,240,255,0.95)", 3.5, 6);
      for (let k = -MIRROR_HALF + 4; k <= MIRROR_HALF; k += 7) { const p = add(C, m, k); line([p, add(add(p, nrm, -6), m, -4)], "rgba(230,240,255,0.35)", 1); }
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(C[0], C[1], 3, 0, 7); ctx.fill();
      label("tilting mirror", C[0] + 34, C[1] - 30, "rgba(235,235,245,0.75)", "left", true);
      label(((alpha * 180) / Math.PI).toFixed(1) + "°", C[0] + 34, C[1] - 17, "rgba(235,235,245,0.5)", "left");
      // iris
      line([add(I, g.plate, IRIS_GAP), add(I, g.plate, 30)], "rgba(255,255,255,0.75)", 3);
      line([add(I, g.plate, -IRIS_GAP), add(I, g.plate, -30)], "rgba(255,255,255,0.75)", 3);
      label("iris", I[0] + 30, I[1] + 4, "rgba(235,235,245,0.6)", "left");

      // ---- probe arm: BS → delay stage → sample → detector ----
      const ys = g.ysMin + ((tau - +tauR.min) / (+tauR.max - +tauR.min)) * (g.ysMax - g.ysMin);
      const det = [W - 52, S[1] - ((W - 52 - S[0]) * (g.yQ - S[1])) / (S[0] - 146)];
      const probePath = [[xL, yP], BS, [BS[0], ys], [BS[0] + 14, ys], [BS[0] + 14, g.yQ], S, det];
      line(probePath.slice(1), PROBE, 1.8, 6, 0.85);
      // retro-reflector on the stage + rail
      line([[BS[0] - 14, g.ysMin - 6], [BS[0] - 14, g.ysMax + 6]], "rgba(255,255,255,0.18)", 2);
      line([[BS[0] - 6, ys - 9], [BS[0] + 7, ys + 4], [BS[0] + 20, ys - 9]], "rgba(255,255,255,0.9)", 2);
      label("delay stage", BS[0] + 30, ys + 4, "rgba(235,235,245,0.75)", "left", true);
      label("τ = " + tau.toFixed(2) + " ps", BS[0] + 30, ys + 17, "rgba(235,235,245,0.5)", "left");
      label("probe", (BS[0] + 14 + S[0]) / 2, g.yQ - (g.yQ - S[1]) / 2 + 16, PROBE, "center", true);
      box(det[0] - 4, det[1] - 15, 50, 30, "detector", null, PROBE);

      // sample
      const sp = [-0.35, 1];
      ctx.save(); ctx.translate(S[0], S[1]); ctx.rotate(Math.atan2(sp[1], sp[0]) - Math.PI / 2);
      ctx.fillStyle = "rgba(191,90,242,0.35)"; ctx.strokeStyle = "rgba(191,90,242,0.95)"; ctx.fillRect(-3, -20, 6, 40); ctx.strokeRect(-3, -20, 6, 40); ctx.restore();
      label("sample (MXene)", S[0] + 14, S[1] + 34, "rgba(235,235,245,0.75)", "left", true);

      // ---- pulses in flight ----
      const pumpLenToS = plen([[xL, yP], [270, yP], E]) + (sel >= 0 ? plen(traces[sel].pts.slice(0, 3)) : 260);
      const v = pumpLenToS / T_PUMP;
      const sPump = v * clock;
      traces.forEach((tr, k) => {
        const full = [[xL, yP], [270, yP], ...tr.pts];
        pulse(pointAt(full, sPump), BEAMS[k].col, 4);
      });
      const probeToS = plen(probePath.slice(0, 6)), tArr = T_PUMP + tau * PS_TO_S;
      const vr = probeToS / tArr;
      pulse(pointAt(probePath, vr * clock), PROBE, 4);
      // excitation / probing flashes at the sample
      if (sel >= 0) {
        const fp = Math.exp(-(((clock - T_PUMP) / 0.07) ** 2)), fr = Math.exp(-(((clock - tArr) / 0.07) ** 2));
        if (fp > 0.02) pulse(S, BEAMS[sel].col, 6 + 14 * fp);
        if (fr > 0.02) pulse(S, PROBE, 4 + 8 * fr);
      }

      // ---- status ----
      ctx.textAlign = "right"; ctx.font = "600 11px 'JetBrains Mono', monospace";
      if (sel >= 0) {
        ctx.fillStyle = BEAMS[sel].col; ctx.fillText(`pump on sample: ${BEAMS[sel].label} · ${BEAMS[sel].eV}`, W - 10, H - 34);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText(Math.abs(tau) < 0.1 ? "τ ≈ 0: pump and probe overlap" : tau > 0 ? `probe arrives ${tau.toFixed(2)} ps after pump` : `probe arrives ${(-tau).toFixed(2)} ps before pump`, W - 10, H - 18);
      } else {
        ctx.fillStyle = "rgba(255,214,10,0.9)"; ctx.fillText("mirror misaligned: no pump through the iris", W - 10, H - 18);
      }
      $$("#tasPump button").forEach((b) => b.classList.toggle("active", +b.dataset.i === sel));
    }
    requestAnimationFrame(draw);
  })();

  /* =========================================================
     CIPET — contact-separation TENG (PVDF nanofibre + 2D nanofillers)
     Peak values exactly as reported in Sahoo et al., Adv. Mater. Technol. 2025, e01141
     (text of Sections 2.3.2; D2/D3 omitted because their values are only given in figures).
     Waveform shape: V–Q–x relation of a contact-separation TENG,
       V_oc ∝ x,   Q_sc ∝ x / (d0 + x)  →  J ∝ dQ_sc/dt,
     normalised to the reported peaks. Animation is slowed ~20× from 1000 rpm.
     ========================================================= */
  (function teng() {
    const cv = $("#tengCanvas");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const MX = "#ff9f0a", HB = "#64d2ff";
    const DEV = [
      { id: "D1", name: "PVDF NF vs Al", bot: "PVDF NF", fill: null, top: "Al", el: "Al", V: 6, J: "20 nA cm⁻²", Jv: 20, s: "1.25 nC cm⁻²", sv: 1.25 },
      { id: "D4", name: "PVDF-MXene NF vs Al", bot: "PVDF-MXene NF", fill: MX, top: "Al", el: "Al", V: 12, J: "80 nA cm⁻²", Jv: 80, s: "4 nC cm⁻²", sv: 4 },
      { id: "D8", name: "PVDF-MXene vs PVDF-hBNNs", bot: "PVDF-MXene NF", fill: MX, top: "PVDF-hBNNs NF", el: "electrode", V: 8, J: "50 nA cm⁻²", Jv: 50, s: "1.5 nC cm⁻²", sv: 1.5 },
      { id: "D5", name: "PVDF-MXene vs PDMS (Al)", bot: "PVDF-MXene NF", fill: MX, top: "PDMS", el: "Al", V: 50, J: "200 nA", Jv: null, s: "4 nC", sv: 4 },
      { id: "D7", name: "PVDF-MXene/ITO-PET vs PDMS", bot: "PVDF-MXene NF", fill: MX, top: "PDMS", el: "ITO-PET", V: 80, J: "250 nA cm⁻²", Jv: 250, s: "5 nC cm⁻²", sv: 5, P: "22 mW m⁻² at 6 MΩ", best: true }
    ];
    const PERIOD = 1.2, D0 = 0.08, WINDOW = 3.6, VMAX = 90, JMAX = 260;
    const FONT = "11px -apple-system, Inter, sans-serif";
    const BASE_W = 620, BASE_H = 420;
    let W = BASE_W, H = BASE_H, vis = false, last = performance.now(), t = 0, ePhase = 0, dev = DEV[4];
    let buf = [];

    // max of dQ/dx-normalised current over one cycle (for normalisation)
    let dqMax = 0;
    for (let k = 0; k <= 2000; k++) {
      const u = k / 2000, xn = 0.5 - 0.5 * Math.cos(2 * Math.PI * u), dx = Math.PI * Math.sin(2 * Math.PI * u);
      dqMax = Math.max(dqMax, Math.abs((D0 / (D0 + xn) ** 2) * dx));
    }

    function size() {
      const cw = cv.getBoundingClientRect().width, pr = Math.min(devicePixelRatio, 2);
      if (!cw) return;
      const k = Math.min(1, cw / BASE_W), ch = Math.round(BASE_H * k);
      if (cv.style.height !== ch + "px") cv.style.height = ch + "px";
      W = cw / k; H = BASE_H;
      cv.width = Math.max(1, cw * pr); cv.height = Math.max(1, ch * pr); ctx.setTransform(pr * k, 0, 0, pr * k, 0, 0);
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv); else addEventListener("resize", size);
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(cv);
    $("#tengDev").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("#tengDev button").forEach((x) => x.classList.toggle("active", x === b));
      dev = DEV[+b.dataset.i]; buf = [];
    });

    const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
    const label = (txt, x, y, col = "rgba(235,235,245,0.6)", align = "left", bold = false) => {
      ctx.font = (bold ? "600 " : "") + FONT; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(txt, x, y);
    };
    function slab(x, y, w, h, kind) {
      if (kind === "Al") { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, "#e5e5ea"); g.addColorStop(1, "#8e8e93"); ctx.fillStyle = g; }
      else if (kind === "ITO-PET") ctx.fillStyle = "rgba(100,210,255,0.45)";
      else ctx.fillStyle = "rgba(174,174,178,0.7)";
      ctx.fillRect(x, y, w, h);
    }
    function fibres(x, y, w, h, base, filler, seed) {
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.fillStyle = base; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1;
      for (let k = 0; k < 10; k++) {
        const yy = y + rnd(seed + k) * h, amp = 2 + rnd(seed + k + 50) * 3, ph = rnd(seed + k + 90) * 6;
        ctx.beginPath();
        for (let xx = x; xx <= x + w; xx += 4) { const yv = yy + amp * Math.sin(xx / 13 + ph); xx === x ? ctx.moveTo(xx, yv) : ctx.lineTo(xx, yv); }
        ctx.stroke();
      }
      if (filler) {
        ctx.fillStyle = filler;
        for (let k = 0; k < 16; k++) {
          ctx.save(); ctx.translate(x + rnd(seed + 200 + k) * w, y + rnd(seed + 300 + k) * h); ctx.rotate(rnd(seed + 400 + k) * 3);
          ctx.fillRect(-4, -1.2, 8, 2.4); ctx.restore();
        }
      }
      ctx.restore();
    }
    function topLayer(x, y, w, h) {
      if (dev.top === "Al") slab(x, y, w, h, "Al");
      else if (dev.top === "PDMS") { ctx.fillStyle = "rgba(191,90,242,0.38)"; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "rgba(191,90,242,0.9)"; ctx.strokeRect(x, y, w, h); }
      else fibres(x, y, w, h, "rgba(100,210,255,0.14)", HB, 7);
    }
    function spring(x, y1, y2) {
      ctx.strokeStyle = "rgba(235,235,245,0.55)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y1);
      const n = 10, dy = (y2 - y1) / n;
      for (let k = 1; k < n; k++) ctx.lineTo(x + (k % 2 ? 7 : -7), y1 + k * dy);
      ctx.lineTo(x, y2); ctx.stroke();
    }

    function draw(now) {
      requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!vis) return;
      t += dt * (reduceMotion ? 0.35 : 1);
      const u = (t % PERIOD) / PERIOD;
      const xn = 0.5 - 0.5 * Math.cos(2 * Math.PI * u);              // normalised separation (0 = contact)
      const dxn = Math.PI * Math.sin(2 * Math.PI * u);                // d(xn)/du (sign = separating / closing)
      const iNorm = ((D0 / (D0 + xn) ** 2) * dxn) / dqMax;           // normalised short-circuit current
      const V = dev.V * xn, J = dev.Jv != null ? dev.Jv * iNorm : null;
      buf.push({ t, V, J });
      while (buf.length && buf[0].t < t - WINDOW) buf.shift();
      ePhase += iNorm * dt * 140;

      ctx.clearRect(0, 0, W, H);

      // ---------------- device cross-section ----------------
      const L = 40, R = 262, w = R - L;
      const gap = 4 + 70 * xn;
      const botEl = [222, 8], botLay = [206, 16];
      const yb = botLay[0] - gap, topLay = [yb - 16, 16];
      const hasTopEl = dev.top !== "Al";
      const topEl = hasTopEl ? [topLay[0] - 8, 8] : null;
      const plateY = (hasTopEl ? topEl[0] : topLay[0]) - 10;
      // frame
      ctx.fillStyle = "rgba(120,120,128,0.35)"; ctx.fillRect(16, 236, 270, 10); ctx.fillRect(16, plateY, 270, 10);
      spring(26, plateY + 10, 236); spring(276, plateY + 10, 236);
      // layers
      slab(L, botEl[0], w, botEl[1], dev.el);
      fibres(L, botLay[0], w, botLay[1], "rgba(255,255,255,0.10)", dev.fill, 1);
      topLayer(L, topLay[0], w, topLay[1]);
      if (hasTopEl) slab(L, topEl[0], w, topEl[1], dev.el === "ITO-PET" ? "ITO-PET" : dev.el);
      // surface charges (count scales with charge density)
      const n = Math.max(3, Math.round(dev.sv * 2.6));
      ctx.font = "700 12px -apple-system, Inter, sans-serif"; ctx.textAlign = "center";
      for (let k = 0; k < n; k++) {
        const cx = L + ((k + 0.5) / n) * w;
        ctx.fillStyle = "#64d2ff"; ctx.fillText("−", cx, botLay[0] + 4);
        ctx.fillStyle = "#ff375f"; ctx.fillText("+", cx, yb + 3);
      }
      // labels
      label(dev.top + (hasTopEl ? " on " + dev.el : ""), L, plateY - 8, "rgba(235,235,245,0.8)", "left", true);
      label(dev.bot + " on " + dev.el, L, 262, "rgba(235,235,245,0.8)", "left", true);
      // press / release arrows
      const pressing = dxn < 0;
      ctx.fillStyle = pressing ? "rgba(255,214,10,0.9)" : "rgba(48,209,88,0.9)";
      [178, 208, 238].forEach((ax) => {
        ctx.beginPath();
        if (pressing) { ctx.moveTo(ax - 6, plateY - 22); ctx.lineTo(ax + 6, plateY - 22); ctx.lineTo(ax, plateY - 6); }
        else { ctx.moveTo(ax - 6, plateY - 6); ctx.lineTo(ax + 6, plateY - 6); ctx.lineTo(ax, plateY - 22); }
        ctx.fill();
      });
      label(pressing ? "pressing" : "releasing", 250, plateY - 10, ctx.fillStyle, "left", true);

      // external circuit: top electrode → load → bottom electrode
      const yTop = hasTopEl ? topEl[0] + 4 : topLay[0] + 8, yBot = botEl[0] + 4, xw = 300;
      const path = [[R, yTop], [xw, yTop], [xw, yBot], [R, yBot]];
      ctx.strokeStyle = "rgba(235,235,245,0.55)"; ctx.lineWidth = 1.5; ctx.beginPath();
      path.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      // load resistor
      ctx.fillStyle = "#05050a"; ctx.fillRect(xw - 7, 192, 14, 22); ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.strokeRect(xw - 7, 192, 14, 22);
      label("R", xw + 11, 207, "rgba(235,235,245,0.8)", "left", true);
      // electrons
      const segs = []; let plen = 0;
      for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segs.push(d); plen += d; }
      const sp = plen / 6;
      ctx.save(); ctx.fillStyle = "#30d158"; ctx.shadowColor = "#30d158"; ctx.shadowBlur = 8 * Math.min(1, Math.abs(iNorm) + 0.2);
      for (let k = 0; k < 6; k++) {
        let s = (((k * sp + ePhase) % plen) + plen) % plen;
        for (let i = 0; i < segs.length; i++) {
          if (s <= segs[i]) { const a = path[i], b = path[i + 1], f = s / segs[i]; ctx.beginPath(); ctx.arc(a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1]), 2.6, 0, 7); ctx.fill(); break; }
          s -= segs[i];
        }
      }
      ctx.restore();
      label("e⁻", xw + 11, 180, "#30d158", "left", true);

      // ---------------- device comparison (reported peak V_oc) ----------------
      const bx = 336, bw = W - bx - 52;
      label("Reported peak Voc (1000 rpm)", bx, 24, "rgba(235,235,245,0.85)", "left", true);
      DEV.forEach((d, i) => {
        const y = 40 + i * 25, on = d === dev;
        label(d.id, bx, y + 10, on ? "#fff" : "rgba(235,235,245,0.5)", "left", true);
        ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(bx + 26, y, bw, 12);
        ctx.fillStyle = on ? MX : "rgba(255,159,10,0.35)"; ctx.fillRect(bx + 26, y, (bw * d.V) / VMAX, 12);
        label(d.V + " V", bx + 30 + (bw * d.V) / VMAX, y + 10, on ? "#fff" : "rgba(235,235,245,0.5)", "left", on);
      });
      // readout for selected device
      const ry = 178;
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(bx - 6, ry - 16, W - bx - 4, 84);
      label(`${dev.id} · ${dev.name}`, bx, ry, "#fff", "left", true);
      label(`Voc ${dev.V} V   ·   J ${dev.J}`, bx, ry + 18, "rgba(235,235,245,0.75)");
      label(`charge density ${dev.s}`, bx, ry + 34, "rgba(235,235,245,0.75)");
      label(dev.P ? `power density ${dev.P}  ★ best device` : "2 × 2 cm² active area", bx, ry + 50, dev.P ? "#ffd60a" : "rgba(235,235,245,0.5)", "left", !!dev.P);

      // ---------------- live traces ----------------
      const sx = 46, sw = W - sx - 10, vTop = 280, vH = 56, jTop = 352, jH = 56;
      const X = (tt) => sx + ((tt - (t - WINDOW)) / WINDOW) * sw;
      ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
      ctx.strokeRect(sx, vTop, sw, vH); ctx.strokeRect(sx, jTop, sw, jH);
      ctx.beginPath(); ctx.moveTo(sx, jTop + jH / 2); ctx.lineTo(sx + sw, jTop + jH / 2); ctx.stroke();
      label("Voc", 8, vTop + 14, MX, "left", true); label("0–90 V", 8, vTop + 28, "rgba(235,235,245,0.4)");
      label("J", 8, jTop + 14, HB, "left", true); label("±260", 8, jTop + 28, "rgba(235,235,245,0.4)"); label("nA/cm²", 8, jTop + 40, "rgba(235,235,245,0.4)");
      function trace(key, y0, h, scale, bipolar, col) {
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.shadowColor = col; ctx.shadowBlur = 6; ctx.beginPath();
        let started = false;
        buf.forEach((p) => {
          if (p[key] == null) return;
          const yy = bipolar ? y0 + h / 2 - (p[key] / scale) * (h / 2) : y0 + h - (p[key] / scale) * h;
          started ? ctx.lineTo(X(p.t), yy) : (ctx.moveTo(X(p.t), yy), (started = true));
        });
        ctx.stroke(); ctx.restore();
      }
      trace("V", vTop, vH, VMAX, false, MX);
      if (dev.Jv != null) trace("J", jTop, jH, JMAX, true, HB);
      else label("current reported as 200 nA (not per cm²) for D5", sx + sw / 2, jTop + jH / 2 + 4, "rgba(235,235,245,0.5)", "center");
      label(`V = ${V.toFixed(1)} V`, sx + sw - 6, vTop + 14, MX, "right", true);
      if (J != null) label(`J = ${J.toFixed(0)} nA/cm²`, sx + sw - 6, jTop + 14, HB, "right", true);
      label("time →", sx + sw, H - 2, "rgba(235,235,245,0.4)", "right");
    }
    requestAnimationFrame(draw);
  })();

  /* =========================================================
     Ph.D. (ICT Mumbai) — illustrative thesis workflow
     ① melt quenching + thermal evaporation → ② annealing / laser / ion irradiation
     → ③ characterisation (UV-Vis-NIR, XRD; plus Raman, FESEM, AFM, EDAX, XPS).
     Purely schematic: trends are for perspective, not thesis data.
     ========================================================= */
  (function phd() {
    const cv = $("#phdCanvas");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const doseR = $("#phdDose"), autoSw = $("#phdAuto");
    const AS = "#bf5af2", SE = "#ff9f0a";
    const COMP = { Ge: { col: "#30d158", edge: 640 }, Sb: { col: "#64d2ff", edge: 700 }, Te: { col: "#ff375f", edge: 760 } };
    const TREAT = {
      anneal: { label: "Annealing temperature (rel.)", col: "#ff9f0a", k: 0.6 },
      laser: { label: "Laser exposure (rel.)", col: "#ff375f", k: 1.0 },
      ion: { label: "Ion fluence (rel.)", col: "#64d2ff", k: 0.8 }
    };
    const STEP_T = 7; // seconds per step in auto-play
    const BASE_W = 620, BASE_H = 420, FONT = "11px -apple-system, Inter, sans-serif";
    let W = BASE_W, H = BASE_H, vis = false, last = performance.now(), t = 0, stepT = 0;
    let step = 0, comp = "Ge", treat = "anneal", auto = true;

    const rnd = (i) => { const x = Math.sin(i * 78.233 + 12.9898) * 43758.5453; return x - Math.floor(x); };
    // amorphous network for step ②: random positions, lattice targets, neighbour bonds
    const FX0 = 60, FX1 = 470, FY0 = 205, FY1 = 315, NA = 72;
    const atoms = [];
    for (let i = 0; i < NA; i++) {
      const col = i % 12, row = Math.floor(i / 12);
      const r = rnd(i + 900);
      atoms.push({
        rx: FX0 + 12 + rnd(i) * (FX1 - FX0 - 24), ry: FY0 + 10 + rnd(i + 300) * (FY1 - FY0 - 20),
        lx: FX0 + 24 + col * ((FX1 - FX0 - 48) / 11), ly: FY0 + 14 + row * ((FY1 - FY0 - 28) / 5),
        type: r < 0.4 ? "As" : r < 0.88 ? "Se" : "X", dx: rnd(i + 500) - 0.5, dy: rnd(i + 700) - 0.5, ph: rnd(i + 1100) * 6.28
      });
    }
    const bonds = [];
    atoms.forEach((a, i) => {
      atoms.map((b, j) => ({ j, d: Math.hypot(a.rx - b.rx, a.ry - b.ry) })).filter((o) => o.j > i).sort((p, q) => p.d - q.d)
        .slice(0, 2).forEach((o) => o.d < 70 && bonds.push([i, o.j, rnd(i * 31 + o.j)]));
    });

    function size() {
      const cw = cv.getBoundingClientRect().width, pr = Math.min(devicePixelRatio, 2);
      if (!cw) return;
      const k = Math.min(1, cw / BASE_W), ch = Math.round(BASE_H * k);
      if (cv.style.height !== ch + "px") cv.style.height = ch + "px";
      W = cw / k; H = BASE_H;
      cv.width = Math.max(1, cw * pr); cv.height = Math.max(1, ch * pr); ctx.setTransform(pr * k, 0, 0, pr * k, 0, 0);
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv); else addEventListener("resize", size);
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(cv);

    function setActive(sel, attr, val) { $$(sel + " button").forEach((b) => b.classList.toggle("active", b.dataset[attr] === String(val))); }
    function stopAuto() { auto = false; autoSw.checked = false; }
    function setStep(s) { step = s; stepT = 0; setActive("#phdStep", "i", s); }
    $("#phdStep").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; stopAuto(); setStep(+b.dataset.i); });
    $("#phdComp").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; comp = b.dataset.c; setActive("#phdComp", "c", comp); });
    $("#phdTreat").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      treat = b.dataset.t; setActive("#phdTreat", "t", treat); $("#phdDoseLabel").textContent = TREAT[treat].label;
    });
    const showDose = () => { $("#phdDoseOut").textContent = Math.round(+doseR.value * 100) + "%"; paintSlider(doseR); };
    doseR.addEventListener("input", () => { stopAuto(); showDose(); });
    autoSw.addEventListener("change", () => { auto = autoSw.checked; stepT = 0; });

    // ---------- helpers ----------
    const label = (txt, x, y, col = "rgba(235,235,245,0.65)", align = "left", bold = false, size = 11) => {
      ctx.font = (bold ? "600 " : "") + size + "px -apple-system, Inter, sans-serif"; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(txt, x, y);
    };
    const atomCol = (a) => (a.type === "As" ? AS : a.type === "Se" ? SE : COMP[comp].col);
    function dot(x, y, r, col, glow = 0) { ctx.save(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = glow; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); }
    function rbox(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }

    function header() {
      const names = ["① Synthesis", "② Post-deposition treatment", "③ Characterisation"];
      const cols = ["#0ab4f0", "#5a9a2e", "#7a35b0"], bw = (W - 40 - 2 * 26) / 3;
      names.forEach((n, i) => {
        const x = 20 + i * (bw + 26), on = i === step;
        ctx.globalAlpha = on ? 1 : 0.35; ctx.fillStyle = cols[i]; rbox(x, 10, bw, 30, 8); ctx.fill();
        label(n, x + bw / 2, 30, "#fff", "center", true, 12); ctx.globalAlpha = 1;
        if (i < 2) { // pink arrow, as on the slide
          const ax = x + bw + 4; ctx.fillStyle = "#ff3d8b"; ctx.beginPath();
          ctx.moveTo(ax, 21); ctx.lineTo(ax + 10, 21); ctx.lineTo(ax + 10, 16); ctx.lineTo(ax + 18, 25); ctx.lineTo(ax + 10, 34); ctx.lineTo(ax + 10, 29); ctx.lineTo(ax, 29); ctx.fill();
        }
      });
      if (auto) { const p = Math.min(1, stepT / STEP_T); ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(20, 46, (W - 40) * p, 2); }
    }

    // ---------- ① synthesis ----------
    function synthesis() {
      const cyc = (t % 6) / 6, c = COMP[comp].col;
      // melt quenching (left)
      label("Melt quenching", 30, 76, "#fff", "left", true, 13);
      const heating = cyc < 0.58, quench = cyc >= 0.58 && cyc < 0.75;
      const fx = 40, fy = 110, fw = 240, fh = 110;
      ctx.fillStyle = "rgba(255,255,255,0.05)"; rbox(fx, fy, fw, fh, 10); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.stroke();
      for (let k = 0; k < 9; k++) { // heating coils
        const x = fx + 18 + k * 25; ctx.strokeStyle = heating ? `rgba(255,${120 + 40 * Math.sin(t * 8 + k)},40,0.9)` : "rgba(255,255,255,0.15)";
        ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, fy + 8); ctx.lineTo(x, fy + 18); ctx.moveTo(x, fy + fh - 18); ctx.lineTo(x, fy + fh - 8); ctx.stroke();
      }
      label(heating ? "rocking furnace · glass melted & homogenised" : "furnace", fx + fw / 2, fy + fh + 16, "rgba(235,235,245,0.6)", "center");
      // water bath
      const bx = 60, by = 290, bw2 = 200, bh = 40;
      ctx.fillStyle = quench ? "rgba(100,210,255,0.45)" : "rgba(100,210,255,0.18)"; rbox(bx, by, bw2, bh, 6); ctx.fill();
      label("ice-water quench", bx + bw2 / 2, by + bh + 16, "rgba(235,235,245,0.6)", "center");
      // ampoule position / rocking
      let ay = fy + fh / 2, ang = 0;
      if (heating) ang = 0.25 * Math.sin(t * 2.4);
      else if (quench) ay = fy + fh / 2 + ((cyc - 0.58) / 0.17) * (by + bh / 2 - fy - fh / 2);
      else ay = by + bh / 2;
      ctx.save(); ctx.translate(fx + fw / 2, ay); ctx.rotate(ang);
      ctx.fillStyle = "rgba(220,235,255,0.12)"; ctx.strokeStyle = "rgba(220,235,255,0.7)"; ctx.lineWidth = 1.5;
      rbox(-70, -13, 140, 26, 13); ctx.fill(); ctx.stroke();
      const g = ctx.createLinearGradient(-50, 0, 30, 0);
      g.addColorStop(0, heating ? "#ff9f0a" : AS); g.addColorStop(0.5, heating ? "#ffd60a" : SE); g.addColorStop(1, c);
      ctx.fillStyle = g; ctx.globalAlpha = heating ? 0.95 : 0.7; rbox(-55, -7, 80, 14, 7); ctx.fill(); ctx.globalAlpha = 1;
      if (heating) { ctx.shadowColor = "#ff9f0a"; ctx.shadowBlur = 18; rbox(-55, -7, 80, 14, 7); ctx.fill(); }
      ctx.restore();
      label(cyc < 0.58 ? "heating" : cyc < 0.75 ? "quenching" : "bulk glass ✓", fx + fw / 2, 98, heating ? "#ff9f0a" : "#64d2ff", "center", true);

      // arrow
      ctx.fillStyle = "#ff3d8b"; ctx.beginPath(); ctx.moveTo(292, 196); ctx.lineTo(306, 196); ctx.lineTo(306, 189); ctx.lineTo(318, 200); ctx.lineTo(306, 211); ctx.lineTo(306, 204); ctx.lineTo(292, 204); ctx.fill();

      // thermal evaporation (right)
      const cx0 = 330, cx1 = W - 20, cm = (cx0 + cx1) / 2;
      label("Thermal evaporation", cx0, 76, "#fff", "left", true, 13);
      ctx.strokeStyle = "rgba(220,235,255,0.5)"; ctx.lineWidth = 1.5; ctx.beginPath();
      ctx.moveTo(cx0 + 10, 340); ctx.lineTo(cx0 + 10, 150); ctx.quadraticCurveTo(cx0 + 10, 92, cm, 92); ctx.quadraticCurveTo(cx1 - 10, 92, cx1 - 10, 150); ctx.lineTo(cx1 - 10, 340); ctx.stroke();
      ctx.fillStyle = "rgba(120,120,128,0.5)"; ctx.fillRect(cx0, 340, cx1 - cx0, 8);
      label("high vacuum", cx1 - 16, 334, "rgba(235,235,245,0.45)", "right");
      // substrate + growing film
      const film = 2 + 10 * ((t % 6) / 6);
      ctx.fillStyle = "rgba(200,220,255,0.35)"; ctx.fillRect(cm - 80, 118, 160, 8);
      ctx.fillStyle = "rgba(191,90,242,0.55)"; ctx.fillRect(cm - 80, 126, 160, film);
      label("substrate · amorphous film grows", cm, 112, "rgba(235,235,245,0.6)", "center");
      // boat
      ctx.fillStyle = "#ff9f0a"; ctx.shadowColor = "#ff9f0a"; ctx.shadowBlur = 16; ctx.fillRect(cm - 26, 312, 52, 7); ctx.shadowBlur = 0;
      label("W boat + bulk glass", cm, 332, "rgba(235,235,245,0.6)", "center");
      // vapour
      for (let k = 0; k < 34; k++) {
        const ph = (t * 0.55 + rnd(k)) % 1, x0 = cm + (rnd(k + 40) - 0.5) * 40, x1 = cm + (rnd(k + 80) - 0.5) * 150;
        const x = x0 + (x1 - x0) * ph, y = 310 - ph * (310 - 128 - film);
        const r3 = rnd(k + 120);
        dot(x, y, 2.4, r3 < 0.4 ? AS : r3 < 0.88 ? SE : c, 6);
      }
    }

    // ---------- ② treatment ----------
    function treatment(dose) {
      const tr = TREAT[treat];
      label(treat === "anneal" ? "Thermal annealing" : treat === "laser" ? "Laser irradiation" : "Ion irradiation", 30, 76, "#fff", "left", true, 13);
      const note = treat === "anneal" ? "heat → network relaxes; at high temperature it partly crystallises"
        : treat === "laser" ? "light → photo-induced bond switching inside the beam"
        : "ions → bonds break, atoms displaced, defects grow with fluence";
      label(note, 30, 94, "rgba(235,235,245,0.6)");
      // substrate
      ctx.fillStyle = "rgba(200,220,255,0.18)"; ctx.fillRect(FX0 - 10, FY1 + 4, FX1 - FX0 + 20, 22);
      label("glass substrate", FX1 + 12, FY1 + 20, "rgba(235,235,245,0.5)");
      label(`${{ Ge: "As–Se–Ge", Sb: "As–Se–Sb", Te: "As–Se–Te" }[comp]} film`, FX1 + 12, FY0 + 12, "rgba(235,235,245,0.75)", "left", true);
      if (treat === "anneal") { // heater glow
        const g = ctx.createLinearGradient(0, FY1 + 26, 0, FY1 + 60);
        g.addColorStop(0, `rgba(255,159,10,${0.15 + 0.6 * dose})`); g.addColorStop(1, "rgba(255,159,10,0)");
        ctx.fillStyle = g; ctx.fillRect(FX0 - 10, FY1 + 26, FX1 - FX0 + 20, 34);
        label(`T ↑ ${Math.round(dose * 100)}%`, FX0, FY1 + 50, "#ff9f0a", "left", true);
      }
      const bx0 = 250, bx1 = 370; // laser beam footprint
      if (treat === "laser") {
        const g = ctx.createLinearGradient(0, 110, 0, FY1);
        g.addColorStop(0, `rgba(255,55,95,${0.05 + 0.35 * dose})`); g.addColorStop(1, `rgba(255,55,95,${0.1 + 0.4 * dose})`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(bx0 + 40, 110); ctx.lineTo(bx1 - 40, 110); ctx.lineTo(bx1, FY1); ctx.lineTo(bx0, FY1); ctx.fill();
        label("laser", (bx0 + bx1) / 2, 124, "#ff375f", "center", true);
      }
      if (treat === "ion") { // incoming ions
        const nIons = Math.round(4 + 14 * dose);
        for (let k = 0; k < nIons; k++) {
          const ph = (t * 0.9 + rnd(k + 2000)) % 1, x = FX0 + rnd(k + 2100) * (FX1 - FX0), y = 110 + ph * (FY0 - 110 + 30);
          ctx.strokeStyle = "rgba(100,210,255,0.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x, y); ctx.stroke();
          dot(x, y, 2.6, "#64d2ff", 10);
        }
        label("H⁺ ions", FX0, 124, "#64d2ff", "left", true);
      }
      // network
      const order = treat === "anneal" ? Math.max(0, dose - 0.25) / 0.75 * 0.85 : 0;
      const jit = treat === "anneal" ? 0.6 + 2.6 * dose : 0.6;
      const pos = atoms.map((a, i) => {
        let x = a.rx + (a.lx - a.rx) * order, y = a.ry + (a.ly - a.ry) * order;
        x += jit * Math.sin(t * 6 + a.ph); y += jit * Math.cos(t * 5 + a.ph);
        if (treat === "ion") { x += a.dx * 16 * dose; y += a.dy * 16 * dose; }
        return [x, y];
      });
      bonds.forEach(([i, j, r]) => {
        let alpha = 0.35;
        if (treat === "ion" && r < 0.45 * dose) return;                       // broken bonds
        const inBeam = treat === "laser" && pos[i][0] > bx0 && pos[i][0] < bx1;
        if (inBeam && r < dose) alpha = 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(t * 10 + r * 20)); // switching
        ctx.strokeStyle = inBeam && r < dose ? `rgba(255,214,10,${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(pos[i][0], pos[i][1]); ctx.lineTo(pos[j][0], pos[j][1]); ctx.stroke();
      });
      atoms.forEach((a, i) => dot(pos[i][0], pos[i][1], a.type === "X" ? 5.5 : 4.5, atomCol(a), 4));
      if (treat === "ion") for (let k = 0; k < Math.round(16 * dose); k++) label("×", FX0 + rnd(k + 3000) * (FX1 - FX0), FY0 + rnd(k + 3100) * (FY1 - FY0), "rgba(255,214,10,0.8)", "center", true, 12);
      const state = treat === "anneal" ? (order > 0.45 ? "partly crystalline" : order > 0 ? "relaxing" : "amorphous")
        : treat === "laser" ? (dose > 0.05 ? "photo-modified region" : "amorphous") : (dose > 0.05 ? "defect-rich" : "amorphous");
      label(`network: ${state}`, W - 20, 76, tr.col, "right", true, 12);
      label("Switch to ③ to see how the optical response changes", W / 2, H - 14, "rgba(235,235,245,0.45)", "center");
    }

    // ---------- ③ characterisation ----------
    function characterisation(dose) {
      const sh = TREAT[treat].k * dose, e0 = COMP[comp].edge, eT = e0 + 70 * sh, n0 = 2.6, nT = n0 + 0.15 * sh, d = 900;
      const Tm = (lam, edge, n) => (1 / (1 + Math.exp((edge - lam) / 28))) * (0.78 + 0.14 * Math.cos((4 * Math.PI * n * d) / lam));
      // UV-Vis-NIR
      const px = 46, py = 70, pw = 360, ph = 250, L0 = 500, L1 = 2500;
      label("UV-Vis-NIR transmission", px, py - 6, "#fff", "left", true, 12);
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.strokeRect(px, py, pw, ph);
      const X = (l) => px + ((l - L0) / (L1 - L0)) * pw, Y = (v) => py + ph - v * ph;
      [1000, 1500, 2000].forEach((l) => label(l, X(l), py + ph + 14, "rgba(235,235,245,0.45)", "center"));
      label("λ (nm)", px + pw, py + ph + 14, "rgba(235,235,245,0.45)", "right");
      label("T", px - 14, py + 12, "rgba(235,235,245,0.45)", "center");
      function curve(edge, n, col, dash) {
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; if (dash) ctx.setLineDash([5, 5]); ctx.beginPath();
        for (let l = L0; l <= L1; l += 4) { const x = X(l), y = Y(Tm(l, edge, n)); l === L0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); ctx.restore();
      }
      curve(e0, n0, "rgba(255,255,255,0.35)", true);
      curve(eT, nT, TREAT[treat].col, false);
      label("as-deposited", X(2380), Y(0.97), "rgba(235,235,245,0.55)", "right");
      label("treated", X(2380), Y(0.6), TREAT[treat].col, "right", true);
      // edge marker
      ctx.strokeStyle = "rgba(255,214,10,0.7)"; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(X(eT), py); ctx.lineTo(X(eT), py + ph); ctx.stroke(); ctx.setLineDash([]);
      label("absorption edge", X(eT) + 4, py + 16, "#ffd60a");

      // XRD
      const qx = 430, qy = 70, qw = W - qx - 16, qh = 110;
      label("XRD", qx, qy - 6, "#fff", "left", true, 12);
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.strokeRect(qx, qy, qw, qh);
      const cryst = treat === "anneal" ? Math.max(0, dose - 0.45) * 1.8 : 0;
      const I = (th) => 0.42 * Math.exp(-(((th - 17) / 4.5) ** 2)) + 0.22 * Math.exp(-(((th - 30) / 6) ** 2)) * (1 + (treat === "ion" ? 0.2 * dose : 0))
        + cryst * (0.9 * Math.exp(-(((th - 22) / 0.5) ** 2)) + 0.6 * Math.exp(-(((th - 28.5) / 0.5) ** 2)) + 0.45 * Math.exp(-(((th - 42) / 0.6) ** 2)));
      ctx.strokeStyle = "#bf5af2"; ctx.lineWidth = 1.6; ctx.beginPath();
      for (let th = 10; th <= 60; th += 0.2) { const x = qx + ((th - 10) / 50) * qw, y = qy + qh - 6 - Math.min(1, I(th)) * (qh - 16); th === 10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      label(cryst > 0.05 ? "crystalline peaks emerge" : "broad hump → amorphous", qx + qw - 6, qy + 16, cryst > 0.05 ? "#ffd60a" : "rgba(235,235,245,0.6)", "right");
      label("2θ (°)", qx + qw, qy + qh + 13, "rgba(235,235,245,0.45)", "right");

      // optical constants panel
      const oy = 214, oh = 106;
      label("Optical constants (trend)", qx, oy - 6, "#fff", "left", true, 12);
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(qx, oy, qw, oh);
      const bars = [["Eg (bandgap)", -sh], ["n (refractive index)", sh], ["χ⁽³⁾ (nonlinear)", sh * 1.2]];
      bars.forEach(([name, v], i) => {
        const y = oy + 22 + i * 30, mid = qx + qw / 2;
        label(name, qx + 6, y - 6, "rgba(235,235,245,0.7)");
        ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(qx + 6, y, qw - 12, 8);
        ctx.fillStyle = v < 0 ? "#64d2ff" : "#ff9f0a"; const len = Math.min(1, Math.abs(v)) * (qw / 2 - 8);
        ctx.fillRect(v < 0 ? mid - len : mid, y, len, 8);
        ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(mid - 0.5, y - 2, 1, 12);
      });

      // techniques used in the thesis
      const tech = ["XRD", "Raman", "FESEM", "AFM", "EDAX", "XPS", "UV-Vis-NIR"];
      let x = 46; const y = 356;
      label("Characterisation techniques", 46, y - 8, "rgba(235,235,245,0.6)", "left", true);
      tech.forEach((tname) => {
        ctx.font = "600 11px -apple-system, Inter, sans-serif"; const w = ctx.measureText(tname).width + 18;
        const shown = tname === "XRD" || tname === "UV-Vis-NIR";
        ctx.fillStyle = shown ? "rgba(122,53,176,0.85)" : "rgba(255,255,255,0.08)"; rbox(x, y, w, 22, 11); ctx.fill();
        label(tname, x + w / 2, y + 15, shown ? "#fff" : "rgba(235,235,245,0.7)", "center", true); x += w + 8;
      });
      label("Schematic trends for perspective; real direction and size depend on composition, dose and temperature.", W / 2, H - 10, "rgba(235,235,245,0.4)", "center");
    }

    function draw(now) {
      requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!vis) return;
      t += dt * (reduceMotion ? 0.35 : 1);
      if (auto) {
        stepT += dt;
        if (step >= 1) { const v = Math.min(1, stepT / (STEP_T * 0.8)); doseR.value = v.toFixed(2); showDose(); }
        if (stepT > STEP_T) setStep((step + 1) % 3);
      }
      ctx.clearRect(0, 0, W, H);
      header();
      const dose = +doseR.value;
      if (step === 0) synthesis(); else if (step === 1) treatment(dose); else characterisation(dose);
    }
    showDose();
    requestAnimationFrame(draw);
  })();

})();
