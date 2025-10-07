// ESPN8 The Ocho – Dynamic Interactions
(function() {
  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));

  // Tagline rotator
  const taglines = [
    'The Ocho',
    'Altitude Enhanced',
    'Pure Spectacle',
    'Edge of Oxygen',
    'Spin Physics Live'
  ];
  let taglineIndex = 0;
  const taglineEl = qs('#taglineRotator');
  function rotateTagline() {
    taglineIndex = (taglineIndex + 1) % taglines.length;
    taglineEl.textContent = taglines[taglineIndex];
  }
  setInterval(rotateTagline, 4000);

  // Theme toggle
  const themeToggle = qs('#themeToggle');
  themeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.textContent = isLight ? '🌑' : '🌙';
    localStorage.setItem('espn8-theme', isLight ? 'light' : 'dark');
  });
  // Load saved theme
  const savedTheme = localStorage.getItem('espn8-theme');
  if (savedTheme === 'light') { document.body.classList.add('light'); themeToggle?.setAttribute('aria-pressed','true'); themeToggle.textContent='🌑'; }

  // Hero dynamic altitude (mock live data)
  const altitudeValue = qs('#altitudeValue');
  function updateAltitude() {
    // Simulate altitude fluctuations between 2400m and 2800m
    const base = 2600;
    const variation = Math.sin(Date.now()/5000) * 200 + (Math.random()*40 - 20);
    const val = Math.round(base + variation);
    altitudeValue.textContent = val + ' m';
  }
  setInterval(updateAltitude, 1200);
  updateAltitude();

  // Schedule data (could be loaded via fetch; static seed for now)
  const scheduleSeed = [
    { id:1, title:'Summit Opener', level:'Pro', a:'Glacier Phantoms', b:'Red Ridge Impact', ts: Date.now() + 3600e3 },
    { id:2, title:'Thermal Clash', level:'Elite', a:'Ozone Drifters', b:'Apex Kinetics', ts: Date.now() + 3*3600e3 },
    { id:3, title:'Low Oxygen Finals Qualifier', level:'Qualifier', a:'Frost Channel', b:'Crag Velocity', ts: Date.now() + 7*3600e3 },
    { id:4, title:'Sunset Altitude Showcase', level:'Showcase', a:'Strato Curve', b:'Peak Momentum', ts: Date.now() + 25*3600e3 },
    { id:5, title:'Night Flare Series', level:'Series', a:'Horizon Shift', b:'Blizzard Pulse', ts: Date.now() + 31*3600e3 }
  ];
  const scheduleList = qs('#scheduleList');
  function renderSchedule() {
    if (!scheduleList) return;
    scheduleList.innerHTML = scheduleSeed.map(match => {
      const date = new Date(match.ts);
      return `<div class="match-card" data-id="${match.id}">
        <div class="match-meta"><span>${match.level}</span><time datetime="${date.toISOString()}">${date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</time></div>
        <h3>${match.title}</h3>
        <div class="match-teams">${match.a} <span style="opacity:.5">vs</span> ${match.b}</div>
        <div class="match-cta"><button class="cta small" data-action="remind">Remind Me</button><button class="cta small ghost" data-action="details">Details</button></div>
      </div>`;
    }).join('');
  }
  renderSchedule();

  // Simple remind / details interactions
  scheduleList?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const card = btn.closest('.match-card');
    const id = card?.getAttribute('data-id');
    if (btn.dataset.action === 'remind') {
      btn.disabled = true;
      btn.textContent = '✓ Set';
      // Here you could integrate Notification API or calendar export
    } else if (btn.dataset.action === 'details') {
      alert('Match #' + id + ' — Extended stats coming soon.');
    }
  });

  // Sports Roster
  const sportsData = [
    { name:'Epic Mountain Dodgeball', cat:['dodgeball','stunt'], blurb:'High-altitude dodgeball where oxygen scarcity shapes split-second tactics.' },
    { name:'Glow-in-the-Dark Night Dodgeball', cat:['dodgeball'], blurb:'Blacklight reactive courts & phosphor trail throws.' },
    { name:'Trampoline Dodgeball', cat:['dodgeball','stunt'], blurb:'Vertical chaos and aerial spin snipes.' },
    { name:'Medieval Combat League', cat:['combat'], blurb:'Full armor, calibrated weapons, objective scoring sensors.' },
    { name:'Pillow Fight Championships', cat:['combat','stunt'], blurb:'Precision strikes, fabric drag management, rotational feints.' },
    { name:'Thumb Wrestling Federation', cat:['combat','precision'], blurb:'Micro‑dexterity and psychological locking strategy.' },
    { name:'Speed Cubing', cat:['precision','mind'], blurb:'Sub‑6 solutions with algorithmic muscle memory.' },
    { name:'Quidditch League', cat:['team','stunt'], blurb:'Hybrid flight-illusion tactics & multi-role field strategy.' },
    { name:'Cheese Rolling Championships', cat:['stunt','endurance'], blurb:'Gravitational descent optimization & tumble recovery.' },
    { name:'Wife Carrying World Championships', cat:['endurance','team'], blurb:'Load stability, hydro obstacle timing, core efficiency.' },
    { name:'Bog Snorkeling', cat:['endurance'], blurb:'Low-visibility trench navigation with modified breathing cadence.' },
    { name:'Ferret Racing', cat:['animal','precision'], blurb:'Rapid path prediction inside translucent tube arrays.' },
    { name:'Ostrich Racing', cat:['animal','stunt'], blurb:'High-mass avian momentum harnessing & balance.' },
    { name:'Camel Wrestling', cat:['animal','combat'], blurb:'Traditional leverage & behavioral feint exploitation.' },
    { name:'Air Guitar World Championships', cat:['stunt','mind'], blurb:'Stagecraft amplitude & synchronized phantom phrasing.' },
    { name:'Professional Stone Skipping', cat:['precision'], blurb:'Hydro-surface angle harmonics & spin decay analytics.' },
    { name:'Unicycle Football', cat:['team','stunt'], blurb:'Gyroscopic stability under contact pressure.' },
    { name:'Bed Racing', cat:['team','stunt'], blurb:'Aerodynamic headboard drag mitigation & push cadence.' },
    { name:'Chess Boxing', cat:['mind','combat'], blurb:'Cognitive recalibration under anaerobic stress cycles.' },
    { name:'Memory Sports', cat:['mind','precision'], blurb:'Encoding velocity & error drift minimization.' }
  ];
  const sportsGrid = qs('#sportsGrid');
  function renderSports(filter='all') {
    if (!sportsGrid) return;
    const filtered = sportsData.filter(s => filter==='all' || s.cat.includes(filter));
    sportsGrid.innerHTML = filtered.map(s => `<div class="sport-card" data-cat="${s.cat.join(' ')}">
      <h3>${s.name}</h3>
      <p>${s.blurb}</p>
      <div class="sport-tags">${s.cat.map(c => `<span class="sport-tag">${c}</span>`).join('')}</div>
    </div>`).join('');
  }
  renderSports();

  // Filter buttons
  qsa('.filter').forEach(btn => btn.addEventListener('click', () => {
    qsa('.filter').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed','true');
    renderSports(btn.dataset.filter);
  }));

  // Smooth scroll for schedule button
  qs('#scrollToSchedule')?.addEventListener('click', () => {
    qs('#schedule')?.scrollIntoView({behavior:'smooth'});
  });

  // Watch now (mock)
  qs('#watchNow')?.addEventListener('click', () => {
    alert('Live stream uplink initializing... (demo)');
  });

  // Altitude Simulation
  const simAltitude = qs('#simAltitude');
  const simVelocity = qs('#simVelocity');
  const simBall = qs('#simBall');
  const runSim = qs('#runSim');
  const canvas = qs('#simCanvas');
  const metricsEl = qs('#simMetrics');
  const ctx = canvas?.getContext('2d');

  function densityAtAltitude(m) {
    // Simplified ISA-ish model (not physically exact) for demonstration
    // Sea level density ~1.225 kg/m3; decay with altitude
    return 1.225 * Math.exp(-m / 8500);
  }

  function dragCoeff(ballType) {
    switch(ballType) {
      case 'pro-rubber': return 0.52;
      case 'aero-core': return 0.38;
      default: return 0.6; // foam
    }
  }

  function simulateTrajectory({ altitude, velocityKmh, ballType }) {
    const v0 = velocityKmh / 3.6; // m/s
    const angle = Math.PI / 6; // 30 deg projection
    const vx = v0 * Math.cos(angle);
    let vy = v0 * Math.sin(angle);
    const g = 9.81;
    const dt = 0.02;
    const rho = densityAtAltitude(altitude);
    const Cd = dragCoeff(ballType);
    const A = 0.0314; // ~20cm diameter projected area
    const m = 0.4; // kg (foam-like)
    const k = 0.5 * rho * Cd * A / m;

    let x=0, y=1.5; // start height 1.5m
    const points = [];
    while (y >= 0 && points.length < 2000) {
      const v = Math.sqrt(vx*vx + vy*vy);
      const ax = -k * v * vx;
      const ay = -g - k * v * vy;
      x += vx * dt;
      y += vy * dt;
      vx += ax * dt;
      vy += ay * dt;
      points.push({x,y});
      if (x > 60) break; // limit horizontal range to 60m for canvas fit
    }
    return { points, rho, k };
  }

  function drawTrajectory(sim) {
    if (!ctx) return;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    // axes
    ctx.strokeStyle = '#2f3c47';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 220); ctx.lineTo(580,220); // ground line
    ctx.stroke();

    // scaling
    const maxX = Math.max(...sim.points.map(p => p.x)) || 1;
    const maxY = Math.max(...sim.points.map(p => p.y)) || 1;
    const scaleX = (540) / maxX;
    const scaleY = (180) / (maxY + 1);

    ctx.strokeStyle = '#ff5b31';
    ctx.lineWidth = 2;
    ctx.beginPath();
    sim.points.forEach((p,i) => {
      const cx = 40 + p.x * scaleX;
      const cy = 220 - p.y * scaleY;
      if (i===0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    });
    ctx.stroke();

    // Start marker
    const start = sim.points[0];
    if (start) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(40 + start.x*scaleX, 220 - start.y*scaleY, 4, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function updateSim() {
    const altitude = parseInt(simAltitude.value, 10);
    const velocityKmh = parseFloat(simVelocity.value);
    const ballType = simBall.value;
    const sim = simulateTrajectory({ altitude, velocityKmh, ballType });
    drawTrajectory(sim);
    const range = (sim.points[sim.points.length-1]?.x || 0).toFixed(1);
    const peak = sim.points.reduce((m,p)=> p.y>m?p.y:m,0).toFixed(2);
    const density = sim.rho.toFixed(3);
    metricsEl.innerHTML = `
      <div class="metric"><strong>Approx Range</strong>${range} m</div>
      <div class="metric"><strong>Peak Height</strong>${peak} m</div>
      <div class="metric"><strong>Air Density</strong>${density} kg/m³</div>
      <div class="metric"><strong>Drag Factor k</strong>${sim.k.toExponential(2)}</div>
      <div class="metric"><strong>Ball Type</strong>${ballType}</div>
    `;
  }
  runSim?.addEventListener('click', updateSim);
  updateSim();

  // Accessibility: allow space/enter on filter buttons
  qsa('.filter').forEach(btn => btn.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); btn.click(); }
  }));
})();
