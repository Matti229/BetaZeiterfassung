const stampInput = document.getElementById('stampInput');
const stampBtn = document.getElementById('stampBtn');
const outstampBtn = document.getElementById('outstampBtn');
const workedTimeDisplay = document.getElementById('workedTime');

let stampedInTime = null;
let workInterval = null;
let alerted8h = false;

// Handle Einstempeln
stampBtn.addEventListener('click', () => {
  const inputTime = stampInput.value;
  if (!inputTime) {
    alert('Bitte Einstempelzeit eingeben.');
    return;
  }

  const now = new Date();
  const [hours, minutes] = inputTime.split(':');
  stampedInTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes));

  if (stampedInTime > now) {
    alert('Einstempelzeit kann nicht in der Zukunft liegen.');
    stampedInTime = null;
    return;
  }

  if (workInterval) clearInterval(workInterval);
  alerted8h = false;

  workInterval = setInterval(() => {
    const msWorked = Date.now() - stampedInTime.getTime();
    const netTime = subtractPause(msWorked);
    workedTimeDisplay.textContent = `Geleistete Zeit: ${formatTime(netTime)}`;

    if (!alerted8h && netTime >= 8 * 3600000) {
      alert('Achtung: 8 Stunden erreicht!');
      alerted8h = true;
    }
  }, 1000);
});

// Handle Ausstempeln
outstampBtn.addEventListener('click', () => {
  if (!stampedInTime) {
    alert('Bitte zuerst einstempeln.');
    return;
  }

  const msWorked = Date.now() - stampedInTime.getTime();
  const netTime = subtractPause(msWorked);
  alert(`Insgesamt gearbeitet: ${formatTime(netTime)}`);

  clearInterval(workInterval);
  workedTimeDisplay.textContent = '';
  stampedInTime = null;
  stampInput.value = '';
});

// Hilfsfunktionen

function subtractPause(ms) {
  let pause = 0;
  const h = ms / 3600000;

  if (h > 6) pause += 30 * 60 * 1000; // 30 Minuten ab 6h
  if (h > 9) pause += 15 * 60 * 1000; // +15 Minuten ab 9h
  return ms - pause;
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(n) {
  return n.toString().padStart(2, '0');
}
