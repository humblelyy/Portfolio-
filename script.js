(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* Loader countdown */
  const steps = ['Lets', 'GO'];
  const ring = $('#ringFill'), num = $('#loaderNum'), C = 565.5;
  let i = 0;
  const tick = () => {
    num.textContent = steps[i];
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = C;
    ring.getBoundingClientRect();
    ring.style.transition = 'stroke-dashoffset .6s cubic-bezier(.77,0,.18,1)';
    ring.style.strokeDashoffset = 0;
    i++;
    if (i < steps.length) setTimeout(tick, 650);
    else setTimeout(() => {
      $('#loader').classList.add('done');
      document.body.classList.remove('is-loading');
      document.body.classList.add('ready');
    }, 550);
  };
  tick();
  $$('.hero-name span').forEach((s, n) => (s.style.transitionDelay = `${0.9 + n * 0.08}s`));

  /* Timecode */
  const tc = $('#timecode'), t0 = performance.now(), p = n => String(n).padStart(2, '0');
  (function loop() {
    const ms = performance.now() - t0, s = Math.floor(ms / 1000);
    tc.textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(Math.floor((ms % 1000) / (1000 / 24)))}`;
    requestAnimationFrame(loop);
  })();

  /* Role cycler */
  const roles = ['CREATIVE DESIGNER', 'VIDEO EDITOR', 'COMPUTER ENGINEER', '3D ARTIST'];
  const role = $('#role'); let r = 0;
  setInterval(() => {
    r = (r + 1) % roles.length;
    role.textContent = roles[r]; role.dataset.text = roles[r];
    role.classList.remove('glitch'); void role.offsetWidth; role.classList.add('glitch');
  }, 2000);

  /* Cursor */
  const cur = $('#cursor'), curText = $('#cursorText');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  if (fine) {
    (function follow() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor], a, button');
      if (t) { curText.textContent = t.dataset.cursor || 'OPEN'; cur.classList.add('big'); }
      else cur.classList.remove('big');
    });
  }

  /* Strips */
  const tracks = $$('.strip-track');
  const words = ['AFTER EFFECTS ✦ PHOTOSHOP ✦ FIGMA ✦ BLENDER ✦', 'EDIT ✦ CREATE ✦ BUILD ✦ REPEAT ✦'];
  tracks.forEach((t, k) => { t.innerHTML = Array(8).fill(`<span>${words[k]}</span>`).join(''); t._x = 0; });
  let lastY = scrollY, boost = 0;
  (function strips() {
    const dy = Math.abs(scrollY - lastY); lastY = scrollY;
    boost += (Math.min(dy, 60) - boost) * 0.1;
    tracks.forEach(t => {
      const half = t.scrollWidth / 2, dir = +t.dataset.dir;
      t._x -= (1 + boost * 0.4) * dir;
      if (t._x <= -half) t._x += half; if (t._x > 0) t._x -= half;
      t.style.transform = `translateX(${t._x}px)`;
    });
    requestAnimationFrame(strips);
  })();

  /* Reveals, counters, chart */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('in'); io.unobserve(el);
    if (el.classList.contains('stats')) $$('.count', el).forEach(c => {
      const to = +c.dataset.to, st = performance.now();
      (function up(n) { const k = Math.min((n - st) / 1400, 1); c.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(up); })(st);
    });
  }), { threshold: 0.2 });
  $$('.reveal, .mask, .chart').forEach(el => io.observe(el));

  /* Hero tilt + about parallax */
  const hp = $('#heroPhoto');
  if (fine) addEventListener('mousemove', e => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    hp.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 12}deg)`;
  });
  const sit = $('#sitPhoto');
  addEventListener('scroll', () => {
    const b = sit.parentElement.getBoundingClientRect();
    sit.style.transform = `translateX(-50%) translateY(${(b.top + b.height / 2 - innerHeight / 2) * -0.08}px)`;
  }, { passive: true });

  /* Service preview */
  const pv = $('#servicePreview');
  $$('.service').forEach(s => {
    s.addEventListener('mouseenter', () => { pv.style.background = s.dataset.color; pv.querySelector('span').textContent = s.querySelector('h3').textContent.toUpperCase(); pv.classList.add('show'); });
    s.addEventListener('mouseleave', () => pv.classList.remove('show'));
    s.addEventListener('mousemove', e => { pv.style.left = e.clientX + 'px'; pv.style.top = e.clientY + 'px'; });
  });

  /* Service morphing dialog */
  const serviceInfo = [
    ['Cuts that carry the story', ['Every edit starts with the story: finding the rhythm, choosing the moment and cutting on emotion, not just action.', 'From reels and short films to YouTube content, I handle pacing, colour grading, sound design and final delivery so the footage feels intentional from first frame to last.'], ['PREMIERE PRO', 'AFTER EFFECTS', 'COLOR', 'SOUND']],
    ['Graphics that move with intent', ['Kinetic typography, animated titles, transitions and motion graphics built in After Effects.', 'Motion is used to guide attention and add energy, whether it is a logo sting, an explainer or a social-first animation.'], ['AFTER EFFECTS', 'KINETIC TYPE', 'TITLES']],
    ['Visuals with a point of view', ['Posters, thumbnails, social media creatives and brand assets designed to stop the scroll.', 'Strong layouts, bold type and colour choices that stay consistent across every touchpoint.'], ['PHOTOSHOP', 'FIGMA', 'BRANDING']],
    ['Interfaces that feel crafted', ['Clean, responsive websites and interfaces built with a designer’s eye and an engineer’s discipline.', 'From wireframes in Figma to hand-written HTML, CSS and JavaScript, with smooth animation and fast load times.'], ['FIGMA', 'HTML / CSS', 'JAVASCRIPT']],
    ['Worlds built in three dimensions', ['Modelling, lighting and rendering scenes in Blender, from product shots to stylised environments.', '3D elements are also blended into video edits and motion pieces for extra depth.'], ['BLENDER', 'MODELLING', 'RENDERING']],
    ['Where code meets craft', ['Small tools, plugins and experiments that make creative work faster, like the AE Downgrader and Humble Studio Tool.', 'A computer engineering background means I can build the tool when the right one does not exist.'], ['TOOLS', 'AUTOMATION', 'EXPERIMENTS']],
  ];
  let morphOpen = null;
  $$('.service').forEach((s, idx) => s.addEventListener('click', () => {
    if (morphOpen) return;
    pv.classList.remove('show');
    const [sub, paras, tags] = serviceInfo[idx];
    const title = s.querySelector('h3').textContent, color = s.dataset.color;
    const r = s.getBoundingClientRect();
    const ov = document.createElement('div'); ov.className = 'morph-overlay';
    const m = document.createElement('div'); m.className = 'morph';
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="morph-scroll"><div class="morph-hero" style="background:${color}">${s.querySelector('.mono').textContent}</div>
      <h3>${title}</h3><div class="sub mono">${sub.toUpperCase()}</div>${paras.map(p => `<p>${p}</p>`).join('')}
      <div class="tags mono">${tags.map(t => `<span>${t}</span>`).join('')}</div></div>
      <button class="morph-close" aria-label="Close" data-cursor="CLOSE">×</button>`;
    Object.assign(m.style, { top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.append(ov, m);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const w = Math.min(520, innerWidth - 32), h = Math.min(innerHeight * 0.86, 680);
      Object.assign(m.style, { top: (innerHeight - h) / 2 + 'px', left: (innerWidth - w) / 2 + 'px', width: w + 'px', height: h + 'px' });
      m.classList.add('open'); ov.classList.add('open');
    }));
    const close = () => {
      const r2 = s.getBoundingClientRect();
      m.classList.remove('open'); ov.classList.remove('open');
      Object.assign(m.style, { top: r2.top + 'px', left: r2.left + 'px', width: r2.width + 'px', height: r2.height + 'px' });
      setTimeout(() => { m.remove(); ov.remove(); document.body.style.overflow = ''; morphOpen = null; }, 600);
    };
    morphOpen = close;
    ov.addEventListener('click', close);
    m.querySelector('.morph-close').addEventListener('click', close);
  }));
  addEventListener('keydown', e => { if (e.key === 'Escape' && morphOpen) morphOpen(); });

  /* Ruler + playhead + clips */
  const ruler = $('#ruler'), ph = $('#playhead'), track = $('#track');
  for (let s = 0; s <= 60; s += 10) ruler.insertAdjacentHTML('beforeend', `<span>00:${p(s)}</span>`);
  const movePH = () => {
    const max = track.scrollWidth - track.clientWidth;
    const k = max > 0 ? track.scrollLeft / max : 0;
    ph.style.left = `${k * (ruler.clientWidth - 2)}px`;
    ph.style.height = `${36 + track.offsetHeight}px`;
  };
  track.addEventListener('scroll', movePH, { passive: true }); addEventListener('resize', movePH); movePH();
  // Vertical wheel scrolls the timeline horizontally while hovering it
  track.addEventListener('wheel', e => {
    const max = track.scrollWidth - track.clientWidth;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && ((e.deltaY > 0 && track.scrollLeft < max) || (e.deltaY < 0 && track.scrollLeft > 0))) {
      e.preventDefault(); track.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  $$('.clip').forEach(c => {
    $('.wave', c).innerHTML = Array.from({ length: 40 }, () => `<i style="--h:${20 + Math.random() * 80}%;--d:${(Math.random() * 1.2).toFixed(2)}s"></i>`).join('');
    c.addEventListener('mousemove', e => {
      const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      c.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 14}deg)`;
      c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
    });
    c.addEventListener('mouseleave', () => (c.style.transform = ''));
    c.addEventListener('click', () => openModal(c.dataset.video, c.dataset.title));
  });

  /* Modal */
  const modal = $('#modal'), video = $('#video'), btn = $('#playBtn'), bar = $('#progressBar'), player = $('.player');
  const fmt = t => `${p(Math.floor(t / 60))}:${p(Math.floor(t % 60))}`;
  function openModal(src, title) {
    player.classList.remove('error');
    $('#modalTitle').textContent = title; video.src = src;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    video.play().catch(() => {});
  }
  function closeModal() {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    video.pause(); video.removeAttribute('src'); video.load(); bar.style.width = 0;
  }
  video.addEventListener('error', () => player.classList.add('error'));
  video.addEventListener('play', () => (btn.textContent = '❚❚ PAUSE'));
  video.addEventListener('pause', () => (btn.textContent = '▶ PLAY'));
  video.addEventListener('timeupdate', () => {
    if (video.duration) bar.style.width = (video.currentTime / video.duration) * 100 + '%';
    $('#vtime').textContent = fmt(video.currentTime || 0);
  });
  btn.addEventListener('click', () => (video.paused ? video.play().catch(() => {}) : video.pause()));
  $('#progress').addEventListener('click', e => {
    const b = e.currentTarget.getBoundingClientRect();
    if (video.duration) video.currentTime = ((e.clientX - b.left) / b.width) * video.duration;
  });
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* LET'S CREATE proximity letters */
  const lets = $('#lets');
  lets.innerHTML = "LET'S CREATE.".split('').map(ch => ch === ' ' ? '<span>&nbsp;</span>' : `<span>${ch}</span>`).join('');
  const letters = $$('span', lets);
  if (fine) addEventListener('mousemove', e => letters.forEach(l => {
    const b = l.getBoundingClientRect(), d = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2));
    const k = Math.max(0, 1 - d / 180);
    l.style.transform = `translateY(${-k * 30}px) rotate(${k * -10}deg)`;
    l.style.color = k > 0.35 ? 'var(--red)' : '';
  }));

  /* Magnetic email */
  const email = $('#email');
  if (fine) {
    email.addEventListener('mousemove', e => {
      const b = email.getBoundingClientRect();
      email.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.3}px,${(e.clientY - b.top - b.height / 2) * 0.4}px)`;
    });
    email.addEventListener('mouseleave', () => (email.style.transform = ''));
  }
})();
