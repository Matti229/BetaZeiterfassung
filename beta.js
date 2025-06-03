let manualStartTime = null;
let manualInterval = null;

const manualStartInput = document.getElementById('manualStartInput');
const manualStartBtn = document.getElementById('manualStartBtn');
const manualDisplay = document.getElementById('manualDisplay');
const manualWarning = document.getElementById('manualWarning');

manualStartBtn.addEventListener('click', () => {
  const input = manualStartInput.value.trim();
  if (!/^\d{1,2}:\d{2}$/.test(input)) {
    manualDisplay.textContent = "Ungültiges Format. Bitte HH:MM verwenden.";
    return;
  }

  const [h, m] = input.split(':').map(Number);
  const now = new Date();
  manualStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);

  if (manualStartTime > new Date()) {
    manualDisplay.textContent = "Zeit liegt in der Zukunft.";
    return;
  }

  manualStartInput.disabled = true;
  manualStartBtn.disabled = true;
  manualWarning.textContent = "";
  updateManualTimer();

  manualInterval = setInterval(updateManualTimer, 1000);
});

function updateManualTimer() {
  const now = new Date();
  let elapsedMs = now - manualStartTime;

  if (elapsedMs <= 0) {
    manualDisplay.textContent = "Zeit liegt in der Zukunft.";
    return;
  }

  let deducted = 0;

  // Pause nach 6h: 30 Minuten
  if (elapsedMs >= 6 * 60 * 60 * 1000) {
    deducted += 30 * 60 * 1000;
  }

  // Zusätzliche Pause nach 9h: 15 Minuten
  if (elapsedMs >= 9 * 60 * 60 * 1000) {
    deducted += 15 * 60 * 1000;
  }

  const netMs = elapsedMs - deducted;
  const netTime = formatDuration(netMs);

  manualDisplay.textContent = `Arbeitszeit seit ${formatTime(manualStartTime)} (mit Pausenabzug): ${netTime}`;

  if (netMs >= 8 * 60 * 60 * 1000) {
    manualWarning.textContent = "⚠️ Achtung: Du hast 8 Stunden Arbeitszeit erreicht!";
  } else {
    manualWarning.textContent = "";
  }
}

function formatTime(date) {
  return date.toTimeString().substring(0, 5);
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(n) {
  return n.toString().padStart(2, '0');
}
