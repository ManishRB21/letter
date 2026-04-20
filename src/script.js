// ── Background music (auto-play, no button, persists across pages) ──
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 1.0;

function tryPlay() {
  bgMusic.play().then(() => {
    sessionStorage.setItem('musicPlaying', 'true');
  }).catch(() => {});
}

// Try immediately
tryPlay();

// Also try on first touch (iOS blocks autoplay until interaction)
document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
document.addEventListener('click',      tryPlay, { once: true, passive: true });

// ── Reset envelope when user navigates back (iOS bfcache) ──
window.addEventListener('pageshow', (e) => {
  const flap = document.getElementById('envelopeFlap');
  const seal = document.getElementById('heartSeal');
  if (flap) flap.classList.remove('open');
  if (seal) seal.classList.remove('hidden');
  // Resume music if it was playing
  if (sessionStorage.getItem('musicPlaying') === 'true') tryPlay();
});

// ── Floating background hearts ──
const bgHearts    = document.getElementById('bgHearts');
const heartEmojis = ['💗', '🌸', '💕', '✨', '🎀', '💖', '🌷'];

function createBgHeart() {
  const el = document.createElement('span');
  el.classList.add('bg-heart');
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  const duration = 6 + Math.random() * 8;
  const delay    = Math.random() * 6;
  el.style.animationDuration = duration + 's';
  el.style.animationDelay   = delay + 's';
  el.style.fontSize = (0.9 + Math.random() * 1.0) + 'rem';
  bgHearts.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay) * 1000 + 500);
}

setInterval(createBgHeart, 700);
for (let i = 0; i < 8; i++) createBgHeart();

// ── Envelope tap → open flap then navigate to letter page ──
const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelopeFlap    = document.getElementById('envelopeFlap');
const heartSeal       = document.getElementById('heartSeal');
let navigating = false;

function openEnvelope() {
  if (navigating) return;
  navigating = true;
  envelopeFlap.classList.add('open');
  heartSeal.classList.add('hidden');
  spawnSparkles(envelopeWrapper);
  setTimeout(() => { window.location.href = 'letter.html'; }, 700);
}

let touchMoved = false;
envelopeWrapper.addEventListener('touchstart', () => { touchMoved = false; }, { passive: true });
envelopeWrapper.addEventListener('touchmove',  () => { touchMoved = true;  }, { passive: true });
envelopeWrapper.addEventListener('touchend', (e) => {
  if (!touchMoved) {
    e.preventDefault();
    openEnvelope();
  }
}, { passive: false });
envelopeWrapper.addEventListener('click', openEnvelope);

// ── Sparkle burst ──
function spawnSparkles(target) {
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  const sparkleEmojis = ['✨', '💗', '🌸', '💖', '🎀', '⭐', '💫'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('span');
    el.classList.add('sparkle');
    el.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    const angle = (i / 14) * 2 * Math.PI;
    const dist  = 60 + Math.random() * 80;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    el.style.animationDelay = (Math.random() * 0.15) + 's';
    el.style.fontSize = (0.9 + Math.random() * 0.6) + 'rem';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}
