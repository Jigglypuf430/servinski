// script.js – pan hologram with device tilt
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.holo-overlay');
  if (!overlay) return;
const SENSITIVITY = 30;  
  /* tilt handler */
  function handle(e){
    const gamma = Math.max(-90, Math.min(90, e.gamma || 0));
    const beta  = Math.max(-90, Math.min(90, e.beta  || 0));
    overlay.style.backgroundPosition =
      `${50 + gamma/90*50}% ${50 + beta/90*50}%`;
  }

  /* iOS motion permission */
  const enableTilt = () => {
    if (window.DeviceOrientationEvent &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(res => res === 'granted' &&
              window.addEventListener('deviceorientation', handle))
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handle);
    }
    document.body.removeEventListener('click', enableTilt);
  };

  /* first user tap grants permission on iOS */
  document.body.addEventListener('click', enableTilt, {once:true});
});
