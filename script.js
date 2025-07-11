// =====================================================
// NSW Digital Licence – Behaviour & Hologram Animation
// =====================================================

// 1. Generate QR code (static demo)
// 2. Show live refreshed timestamp on load
// 3. Drive hologram parallax without rotation
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

  /* ---------- Hologram parallax --------------------------------- */
  const holo = document.getElementById("holoLayer");
  if (!holo) return;

  const MAX_SHIFT = 30; // px

  function applyShift(x, y) {
    holo.style.setProperty("--shift-x", `${x}px`);
    holo.style.setProperty("--shift-y", `${y}px`);
  }

  function handleOrientation(e) {
    const xRatio = Math.max(-30, Math.min(30, e.gamma || 0)) / 30;
    const yRatio = Math.max(-30, Math.min(30, e.beta || 0)) / 30;
    applyShift(xRatio * MAX_SHIFT, yRatio * MAX_SHIFT);
  }

  function handleMouse(e) {
    const rect = holo.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    applyShift(xRatio * MAX_SHIFT, yRatio * MAX_SHIFT);
  }

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", handleOrientation);
  }

  window.addEventListener("mousemove", handleMouse);
});

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function updateTimestamp() {
  const now = new Date();
  const refDate = document.getElementById("refDate");
  const refTime = document.getElementById("refTime");
  if (refDate)
    refDate.textContent = now.toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  if (refTime) refTime.textContent = formatTime(now);
}
