// script.js

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.holo-overlay');
  if (!overlay) return;

  function handleOrientation(evt) {
    const gamma = Math.max(-90, Math.min(90, evt.gamma || 0));
    const beta = Math.max(-90, Math.min(90, evt.beta || 0));
    let x = ((gamma + 90) / 180) * 100;
    let y = ((beta + 90) / 180) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    overlay.style.backgroundPosition = `${x}% ${y}%`;
  }

  if (
    window.DeviceOrientationEvent &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((perm) => {
        if (perm === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      })
      .catch(console.error);
  } else if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
  }
});
