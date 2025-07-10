// ---- Digital Licence behaviour -------------------------------------------
// 1) Build QR code containing minimal licence metadata
// 2) Display live refreshed timestamp on load
// --------------------------------------------------------------------------

// Generate QR once DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  const qrEl = document.getElementById("qrcode");
  if (qrEl) {
    new QRCode(qrEl, {
      text: "NSW|LIC|25216610|2026-07-13",
      width: 128,
      height: 128,
    });
  }

  updateTimestamp();
});

// helper to pad hh:mm in local 12‑/24‑hour format
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
