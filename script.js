// script.js
document.addEventListener('DOMContentLoaded', () => {
  const holo = document.querySelector('.holo');
  if (!holo) return;

  // Map device tilt to background-position
  function handleOrientation(event) {
    const gamma = Math.max(-90, Math.min(90, event.gamma  || 0));
    const beta  = Math.max(-90, Math.min(90, event.beta   || 0));

    const xPct = 50 + (gamma / 90) * 50;
    const yPct = 50 + (beta  / 90) * 50;

    holo.style.backgroundPosition = `${xPct}% ${yPct}%`;
  }

  // iOS 13+ permission flow
  if (window.DeviceOrientationEvent &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      })
      .catch(console.error);

  } else {
    // Other browsers/devices
    window.addEventListener('deviceorientation', handleOrientation);
  }
});
