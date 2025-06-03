// beta.js

const stampInput = document.getElementById('stampInput');
const stampBtn = document.getElementById('stampBtn');
const outstampBtn = document.getElementById('outstampBtn');
const workedTime = document.getElementById('workedTime');

let manualStart = null;
let manualInterval = null;

// Einstempeln
stampBtn.addEventListener('click', () => {
  const inputTime = stampInput.value;
  if (!inputTime) {
    workedTime.textContent = 'Bitte Uhrzeit eingeben!';
    return;
  }

  const [hours, minutes] = inputTime.split(':').map(Number);
  const now = new Date();
  manualStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  if (manualInterval) clearInterval(manualInterval);

  manualInterval = setInterval(updateWorkedTime, 1000);
  updateWorkedTime();
});

// Ausstempeln
outstampBtn.addEventListener('click', () => {
  if (!manualStart) {
    workedTime.textContent = 'Noch nicht eingestempelt!';
    return;
  }

  clearInterval(manualInterval);
  const end = new Date();
  const duration = end - manualStart;

  const finalTime = calculateEffectiveTime(duration);
  workedTime.textContent = `Heute gearbeitet: ${finalTime}`;
  manualStart = null;
});

function updateWorkedTime() {
  const now = new Date();
  const duration = now - manualStart;

  const effective = calculateEffectiveTime(duration);
  workedTime.textContent = `Aktuelle Arbeitszeit: ${effective}`;

  const totalHours = duration / 3600000;
  if (totalHours >= 8 && !workedTime.classList.contains('alert')) {
    workedTime.classList.add('alert');
    alert('Achtung: 8 Stunden erreicht!');
  }
}

function calculateEffectiveTime(duration) {
  let breakMinutes = 0;

  const hours = duration / 3600000;

  if (hours >= 6) breakMinutes += 30;
  if (hours >= 9) breakMinutes += 15;

  const adjustedDuration = duration - breakMinutes * 60000;
  const h = Math.floor(adjustedDuration / 3600000);
  const m = Math.floor((adjustedDuration % 3600000) / 60000);
  const s = Math.floor((adjustedDuration % 60000) / 1000);

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function pad(n) {
  return n.toString().padStart(2, '0');
}
