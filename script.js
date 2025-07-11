// =====================================================
// NSW Digital Licence – Behaviour & Hologram Animation
// =====================================================

// 1. Generate QR code (static demo)
// 2. Show live refreshed timestamp on load
// 3. Drive hologram parallax + slow spin via
//    – DeviceOrientation on mobile (gyroscope/accelerometer)
//    – Mouse movement fallback on desktop
// =====================================================

window.addEventListener("DOMContentLoaded", () => {
  /* ---------- QR Code & Timestamp -------------------------------- */
  const qrEl = document.getElementById("qrcode");
  if (qrEl) {
    new QRCode(qrEl, {
      text: "NSW|LIC|25216610|2026-07-13",
      width: 128,
      height: 128,
    });
  }

  updateTimestamp();

  /* ---------- Hologram physics ---------------------------------- */
  const holo = document.getElementById("holoLayer");
  if (!holo) return; // bailout if markup missing

  // Accumulated tilt offsets (pixels)
  let tiltX = 0;
  let tiltY = 0;
  // Slow rotational angle (degrees)
  let spin = 0;

  // CONFIG – tune to taste
  const MAX_TILT_DEG = 25; // clamp device tilt we map
  const MAX_SHIFT_PX = 0; // max pixel translation from centre
  const SPIN_SPEED = 0; // deg per frame (~9 deg/s @60fps)

  // ---------- DeviceOrientation (mobile) ----------
  if (window.DeviceOrientationEvent) {
    // iOS 13+ may require permission request triggered by user gesture.
    function enableOrientation() {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPerm