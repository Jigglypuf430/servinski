// =====================================================
// NSW Digital Licence – Behaviour & Hologram Animation
// =====================================================

// Generates QR code and updates timestamp. Also handles
// hologram parallax driven by device orientation or mouse.

window.addEventListener('DOMContentLoaded', () => {
  /* ---------- QR Code & Timestamp ------------------------------ */
  const qrEl = document.getElementById('qrcode');
  if (qrEl) {
    new QRCode(qrEl, {
      text: 'NSW|LIC|25216610|2026-07-13',
      width: 128,
      height: 128,
    });
  }

  function updateTimestamp() {
    const now = new Date();
    document.getElementById('refDate').textContent = now.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    document.getElementById('refTime').textContent = now.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  updateTimestamp();

  /* ---------- Hologram parallax ------------------------------ */
  const holo = document.getElementById('holoLayer');
  if (!holo) return;

  const MAX_TILT_DEG = 25; // clamp device tilt
  const MAX_SHIFT_PX = 40; // maximum pixel shift

  function applyTilt(beta, gamma) {
    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
    const xShift = (clamp(gamma, -MAX_TILT_DEG, MAX_TILT_DEG) / MAX_TILT_DEG) * MAX_SHIFT_PX;
    const yShift = (clamp(beta, -MAX_TILT_DEG, MAX_TILT_DEG) / MAX_TILT_DEG) * MAX_SHIFT_PX;
    holo.style.setProperty('--holo-x', `${xShift}px`);
    holo.style.setProperty('--holo-y', `${yShift}px`);
  }

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      applyTilt(e.beta || 0, e.gamma || 0);
    });
  } else {
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      applyTilt(ny * MAX_TILT_DEG, nx * MAX_TILT_DEG);
    });
  }
});
