const stage = document.getElementById('stage');
const dots = document.getElementById('dots');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const modal = document.getElementById('modal');
const mTitle = document.getElementById('modal-title');
const mMedia = document.getElementById('modal-media');
const mDesc = document.getElementById('modal-desc');
const mLink = document.getElementById('modal-link');

let projects = [], cards = [], cur = 0, lastFocus = null;

/* ---------- Chargement du JSON ---------- */
fetch('projectData.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(data => { projects = data; build(); })
  .catch(() => {
    stage.innerHTML = '<p class="stage-msg">Impossible de charger projects.json.<br>Ouvre le site via un serveur local (extension « Live Server » de VS Code, par exemple) et non en double-cliquant sur index.html.</p>';
  });

/* ---------- Carrousel ---------- */
function build() {
  const n = projects.length;
  cur = Math.floor(n / 2);
  cards = projects.map((p, i) => {
    const c = document.createElement('article');
    c.className = 'card';
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    if (p.image) {
      const img = document.createElement('img');
      img.src = p.image; img.alt = p.title || '';
      img.onerror = () => { thumb.textContent = 'Aperçu'; };
      thumb.appendChild(img);
    } else thumb.textContent = 'Aperçu';
    const h = document.createElement('h3'); h.textContent = p.title || '';
    const d = document.createElement('p'); d.textContent = p.description || '';
    c.append(thumb, h, d);
    c.addEventListener('click', () => {
      if (i === cur) openModal(p); else { cur = i; render(); }
    });
    stage.appendChild(c);

    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Projet ' + (i + 1));
    b.onclick = () => { cur = i; render(); };
    dots.appendChild(b);
    return c;
  });
  render();
}

function render() {
  const n = cards.length, half = Math.floor(n / 2);
  cards.forEach((c, i) => {
    const d = ((i - cur + n + half) % n) - half, a = Math.abs(d);
    const st = a === 0 ? { s: 1, o: 1, b: 0, z: 3 }
             : a === 1 ? { s: .74, o: .45, b: 1.5, z: 2 }
             :           { s: .55, o: 0, b: 3, z: 1 };
    c.style.cssText = `--d:${d};--s:${st.s};--o:${st.o};--b:${st.b}px;--z:${st.z};` + (a > 1 ? 'pointer-events:none' : '');
    c.dataset.active = a === 0;
  });
  [...dots.children].forEach((b, i) => b.classList.toggle('on', i === cur));
}

const go = step => { if (!cards.length) return; cur = (cur + step + cards.length) % cards.length; render(); };
prevBtn.onclick = () => go(-1);
nextBtn.onclick = () => go(1);

let x0 = null;
stage.addEventListener('pointerdown', e => x0 = e.clientX);
stage.addEventListener('pointerup', e => {
  if (x0 === null) return;
  const dx = e.clientX - x0; x0 = null;
  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
});

/* ---------- Pop-up ---------- */
function youtubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

function openModal(p) {
  lastFocus = document.activeElement;
  mTitle.textContent = p.title || '';
  mDesc.textContent = p.description || '';
  mMedia.innerHTML = '';

  if (p.video) {
    const yt = youtubeId(p.video);
    if (yt) {
      const f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + yt;
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.title = p.title || 'Vidéo';
      mMedia.appendChild(f);
    } else {
      const v = document.createElement('video');
      v.src = p.video; v.controls = true; v.playsInline = true;
      if (p.image) v.poster = p.image;
      mMedia.appendChild(v);
    }
  } else if (p.image) {
    const img = document.createElement('img');
    img.src = p.image; img.alt = p.title || '';
    mMedia.appendChild(img);
  }

  if (p.link) {
    mLink.href = p.link;
    mLink.textContent = p.linkLabel || 'Voir le projet';
    mLink.hidden = false;
  } else mLink.hidden = true;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close').focus();
}

function closeModal() {
  modal.classList.remove('open');
  mMedia.innerHTML = '';            // arrête la vidéo
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

document.getElementById('modal-close').onclick = closeModal;
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => {
  if (modal.classList.contains('open')) { if (e.key === 'Escape') closeModal(); return; }
  if (e.key === 'ArrowLeft') go(-1);
  if (e.key === 'ArrowRight') go(1);
});


/* ---------- Apparitions au scroll ---------- */
(function () {
  const plan = [
    ['#presentation h2', 'up'],
    ['.hero-text', 'left', .15],
    ['.photo', 'right', .3],
    ['#projets h2', 'up'],
    ['#stage', 'zoom', .15],
    ['.ctrl', 'up', .3],
    ['#competences h2', 'up'],
    ['.chip', 'up', .1, .12],       // [sélecteur, direction, délai de base, décalage entre éléments]
    ['#formation h2', 'up'],
    ['#formation p', 'up', .15],
    ['#contact h2', 'uzp'],
    ['.links a', 'up', .1, .15]
  ];
  const els = [];
  plan.forEach(([sel, from, base = 0, step = 0]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.dataset.from = from;
      el.style.setProperty('--delay', (base + i * step) + 's');
      els.push(el);
    });
  });
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => io.observe(el));
})();