document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stage1 = document.getElementById('stage1');
  const stage2 = document.getElementById('stage2');

  const toCakeBtn = document.getElementById('toCakeBtn');
  const cakeStage = document.getElementById('cakeStage');
  const cake = document.getElementById('cake');
  const knife = document.getElementById('knife');
  const finalBtn = document.getElementById('finalBtn');
  const overlay = document.getElementById('celebrateOverlay');

  // Preload cake images for instant display
  const preloadImages = ['assets/cake.png','assets/cake-sliced.png','assets/knife.png'];
  preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Stage 1 -> Stage 2
  startBtn.addEventListener('click', () => {
    stage1.classList.add('hidden');
    stage2.classList.remove('hidden');

    document.querySelectorAll('.candle').forEach(c => c.classList.remove('out'));

    // 3s timer to extinguish flames
    setTimeout(() => {
      document.querySelectorAll('.candle').forEach(c => c.classList.add('out'));
      toCakeBtn.classList.remove('hidden'); // show cut button
    }, 3000);
  });

  // Stage 2 -> Cake stage
  toCakeBtn.addEventListener('click', () => {
    stage2.classList.add('hidden');
    cakeStage.classList.remove('hidden');

    cake.classList.remove('hidden');
    cake.classList.add('drop'); // drop animation

    setTimeout(() => {
      knife.classList.remove('hidden');
      setupKnifeFollow();
    }, 350);
  });

  // Knife follow
  function setupKnifeFollow() {
    let hasCut = false;

    function handleMove(clientX, clientY) {
      knife.style.left = clientX + 'px';
      knife.style.top = clientY + 'px';
      knife.style.transform = 'translate(-50%,-50%) rotate(-18deg)';

      if (hasCut) return;

      const cakeRect = cake.getBoundingClientRect();
      const minX = cakeRect.left + cakeRect.width * 0.18;
      const maxX = cakeRect.left + cakeRect.width * 0.82;
      const minY = cakeRect.top + cakeRect.height * 0.2;
      const maxY = cakeRect.top + cakeRect.height * 0.8;

      if (clientX >= minX && clientX <= maxX && clientY >= minY && clientY <= maxY) {
        hasCut = true;
        triggerCut();
      }
    }

    function moveHandler(e) {
      if (e.touches && e.touches.length) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      } else {
        handleMove(e.clientX, e.clientY);
      }
    }

    window.addEventListener('touchmove', moveHandler, {passive:true});
    window.addEventListener('mousemove', moveHandler);

    function triggerCut() {
      cake.src = 'assets/cake-sliced.png';
      setTimeout(() => finalBtn.classList.remove('hidden'), 600);
      if (navigator.vibrate) navigator.vibrate(60);
    }
  }

  // Final overlay
  finalBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden','false');
  });

  overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden','true');
  });
});
