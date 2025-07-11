// =====================================================
// NSW Digital Licence – Behaviour & Hologram Animation
// =====================================================

// 1. Generate QR code (static demo)
// 2. Show live refreshed timestamp on load
// 3. Drive hologram parallax + liquid spin via
//    – DeviceOrientation on mobile (gyroscope/accelerometer)
//    – Mouse movement fallback on desktop
// =====================================================

window.addEventListener('DOMContentLoaded', () => {
  /* ---------- QR Code & Timestamp -------------------------------- */
  const qrEl = document.getElementById('qrcode');
  if (qrEl) {
    new QRCode(qrEl, {
      text: 'NSW|LIC|25216610|2026-07-13',
      width: 128,
      height: 128,
    });
  }

  updateTimestamp();

  /* ---------- Hologram physics ---------------------------------- */
  const holo = document.getElementById('holoLayer');
  if (!holo) return; // bailout if markup missing

  // Accumulated tilt offsets (pixels)
  let tiltX = 0;
  let tiltY = 0;
  // Slow rotational angle (degrees)
  let spin = 0;

  // CONFIG – tune to taste
  const MAX_TILT_DEG = 25; // clamp device tilt we map
  const MAX_SHIFT_PX = 40; // max pixel translation from centre
  const SPIN_SPEED = 0.15; // deg per frame (~9 deg/s @60fps)

  function applyTransform() {
    holo.style.setProperty('--shift-x', `${tiltX}px`);
    holo.style.setProperty('--shift-y', `${tiltY}px`);
    holo.style.setProperty('--spin', `${spin}deg`);
  }

  // Orientation handlers
  function handleOrientation(e) {
    const gamma = e.gamma || 0; // left-right tilt
    const beta = e.beta || 0; // front-back tilt
    const clamp = (v) => Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, v));
    tiltX = (clamp(gamma) / MAX_TILT_DEG) * MAX_SHIFT_PX;
    tiltY = (clamp(beta) / MAX_TILT_DEG) * MAX_SHIFT_PX;
  }

  function handleMouse(e) {
    const rect = holo.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    tiltX = (x / rect.width) * MAX_SHIFT_PX * 2;
    tiltY = (y / rect.height) * MAX_SHIFT_PX * 2;
  }

  function requestOrientation() {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(() => {
          window.addEventListener('mousemove', handleMouse);
        });
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      window.addEventListener('mousemove', handleMouse);
    }
  }

  // Kick off orientation on first interaction (iOS requirement)
  window.addEventListener('click', requestOrientation, { once: true });

  function loop() {
    spin = (spin + SPIN_SPEED) % 360;
    applyTransform();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});

// helper to pad hh:mm in local 12-/24-hour format
function updateTimestamp() {
  const now = new Date();
  const refDate = document.getElementById('refDate');
  const refTime = document.getElementById('refTime');
  if (refDate)
    refDate.textContent = now.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  if (refTime)
    refTime.textContent = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
}
