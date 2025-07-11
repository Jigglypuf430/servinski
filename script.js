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
  const holo = document.querySelector(".holo");
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

  function applyTransforms() {
    holo.style.setProperty("--tilt-x", `${tiltX}px`);
    holo.style.setProperty("--tilt-y", `${tiltY}px`);
    holo.style.setProperty("--spin-angle", `${spin}deg`);
  }

  function animate() {
    spin = (spin + SPIN_SPEED) % 360;
    applyTransforms();
    requestAnimationFrame(animate);
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function handleOrientation(e) {
    const x = clamp(e.gamma || 0, -MAX_TILT_DEG, MAX_TILT_DEG);
    const y = clamp(e.beta || 0, -MAX_TILT_DEG, MAX_TILT_DEG);
    tiltX = (x / MAX_TILT_DEG) * MAX_SHIFT_PX;
    tiltY = (y / MAX_TILT_DEG) * MAX_SHIFT_PX;
  }

  function handleMouseMove(e) {
    const rect = holo.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX = clamp(relX * 2 * MAX_SHIFT_PX, -MAX_SHIFT_PX, MAX_SHIFT_PX);
    tiltY = clamp(relY * 2 * MAX_SHIFT_PX, -MAX_SHIFT_PX, MAX_SHIFT_PX);
  }

  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      const btn = document.createElement("button");
      btn.textContent = "Enable Motion";
      btn.className =
        "absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded";
      btn.addEventListener("click", () => {
        DeviceOrientationEvent.requestPermission()
          .then((res) => {
            if (res === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
              btn.remove();
            }
          })
          .catch(console.error);
      });
      document.body.appendChild(btn);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }

  // Fallback: mouse movement on desktop
  holo.addEventListener("mousemove", handleMouseMove);
  holo.addEventListener("mouseleave", () => {
    tiltX = 0;
    tiltY = 0;
  });

  requestAnimationFrame(animate);
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
