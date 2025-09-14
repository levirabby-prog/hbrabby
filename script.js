// script.js - full flow and smooth knife follow (no tap-and-hold)

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stage1 = document.getElementById('stage1');
  const stage2 = document.getElementById('stage2');
  const stage3 = document.getElementById('stage3');
  const cakeStage = document.getElementById('cakeStage');

  const toCakeBtn = document.getElementById('toCakeBtn');
  const cake = document.getElementById('cake');
  const knife = document.getElementById('knife');
  const finalBtn = document.getElementById('finalBtn');
  const overlay = document.getElementById('celebrateOverlay');

  // Stage 1 -> Stage 2 (candles)
  startBtn.addEventListener('click', () => {
    stage1.classList.add('hidden');
    stage2.classList.remove('hidden');

    // ensure flames are visible
    document.querySelectorAll('.flame').forEach(f => f.classList.remove('out'));

    // 3s timer to "blow" candles
    setTimeout(() => {
      // extinguish animation
      document.querySelectorAll('.flame').forEach(f => f.classList.add('out'));

      // after short delay, show the cut button (stage3)
      setTimeout(() => {
        stage2.classList.add('hidden');
        stage3.classList.remove('hidden');
      }, 600);
    }, 3000);
  });

  // Stage 3 -> cake stage (button appears after blow)
  toCakeBtn.addEventListener('click', () => {
    stage3.classList.add('hidden');
    cakeStage.classList.remove('hidden');

    // drop cake into view
    requestAnimationFrame(() => {
      cake.classList.add('drop');
    });

    // reveal knife after small delay (so cake has started dropping)
    setTimeout(() => {
      knife.style.display = 'block';
      setupKnifeFollow();
    }, 350);
  });

  // When the cake is sliced, this will show final button and overlay on click
  finalBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden','false');
  });

  // overlay click to remove (optional)
  overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden','true');
  });

  // knife follow and cut detection
  function setupKnifeFollow() {
    let hasCut = false;
    // use a small debounce for performance
    let ticking = false;

    function handleMove(clientX, clientY) {
      // position knife so it feels natural (center-ish)
      const kRect = knife.getBoundingClientRect();
      const kW = Math.max(kRect.width, 80);
      const kH = Math.max(kRect.height, 30);

      // put knife centered on finger
      knife.style.left = (clientX) + 'px';
      knife.style.top = (clientY) + 'px';
      knife.style.transform = 'translate(-50%,-50%) rotate(-18deg)';

      if (hasCut) return;

      const cakeRect = cake.getBoundingClientRect();
      if (!cakeRect.width || !cakeRect.height) return;

      // require the pointer to be inside most of the cake (avoid accidental edge triggers)
      const minX = cakeRect.left + cakeRect.width * 0.18;
      const maxX = cakeRect.left + cakeRect.width * 0.82;
      const minY = cakeRect.top + cakeRect.height * 0.2;
      const maxY = cakeRect.top + cakeRect.height * 0.8;

      if (clientX >= minX && clientX <= maxX && clientY >= minY && clientY <= maxY) {
        hasCut = true;
        triggerCut();
      }
    }

    // pointer-friendly listeners - added only after cake appears
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
      // swap to sliced cake image
      cake.src = 'assets/cake-sliced.png';

      // show final button after a sweet short delay
      setTimeout(() => {
        finalBtn.classList.remove('hidden');
      }, 600);

      // small vibration if available
      if (navigator.vibrate) navigator.vibrate(60);
    }
  }
});
