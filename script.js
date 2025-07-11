// script.js – pan hologram with device tilt
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.holo-overlay');
  const debugEl = document.querySelector('.glint-debug');
  if (!overlay) return;

  const SENSITIVITY = 15; // px shift at full ±90° tilt

  /* Master orientation handler ----------------------------------- */
  function handleTilt(e) {
    const gamma = Math.max(-90, Math.min( 90, e.gamma || 0)); // left-right
    const beta  = Math.max(-90, Math.min( 90, e.beta  || 0)); // front-back

    /* Scale degrees → px translation */
    const dx = (gamma / 90) * SENSITIVITY;
    const dy = (beta  / 90) * SENSITIVITY;

    overlay.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    /* Optional debug glint --------------------------------------- */
    if (debugEl) {
      const gx = 50 - (gamma / 90) * 50; // 0‒100 %
      const gy = 50 - (beta  / 90) * 50;
      debugEl.style.background =
        `radial-gradient(circle at ${gx}% ${gy}%,
          rgba(255,255,255,.9) 0 10%,
          rgba(255,255,255,0) 60%)`;
    }
  }

  /* One permission flow for iOS & others ------------------------- */
  function enableTilt() {
    const addListener = () =>
      window.addEventListener('deviceorientation', handleTilt, { passive: true });

    if (window.DeviceOrientationEvent &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(result => result === 'granted' && addListener())
        .catch(console.error);
    } else {
      addListener();
    }
    document.body.removeEventListener('click', enableTilt);
  }

  /* First user interaction grants permission on iOS */
  document.body.addEventListener('click', enableTilt, { once: true });
});
