const clock = document.getElementById("clock");
const ampm = document.getElementById("ampm");
const format = document.getElementById("format");
const alarmH = document.getElementById("alarmH");
const alarmM = document.getElementById("alarmM");
const alarmPeriod = document.getElementById("alarmPeriod"); // nuevo
const btnSet = document.getElementById("set");
const btnClear = document.getElementById("clear");
const status = document.getElementById("status");
const sound = document.getElementById("sound");

let alarm = null;
let active = false;

// Ajusta rango y muestra el select AM/PM solo si formato es 12h
function actualizarInputs() {
  if (format.value === "12") {
    alarmH.min = "1";
    alarmH.max = "12";
    alarmH.value = "";
    alarmH.placeholder = "HH (1-12)";
    alarmPeriod.style.display = "inline-block";
  } else {
    alarmH.min = "0";
    alarmH.max = "23";
    alarmH.value = "";
    alarmH.placeholder = "HH (0-23)";
    alarmPeriod.style.display = "none";
  }
}
format.onchange = actualizarInputs;
actualizarInputs();

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();

  if (format.value === "12") {
    ampm.textContent = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
  } else {
    ampm.textContent = "";
  }

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  clock.textContent = `${hh}:${mm}:${ss}`;

  if (active && alarm && now.getHours() === alarm.h && now.getMinutes() === alarm.m) {
    status.textContent = "¡Alarma!";
    sound.currentTime = 0;
    sound.play();
    active = false;
  }
}

btnSet.onclick = () => {
  let h = Number(alarmH.value);
  let m = Number(alarmM.value);

  if (format.value === "12") {
    if (isNaN(h) || h < 1 || h > 12) {
      alert("Hora inválida para 12h (1-12)");
      return;
    }
    // Usa el select AM/PM, no lo del reloj
    const periodo = alarmPeriod.value;
    h = periodo === "AM" ? (h === 12 ? 0 : h) : (h === 12 ? 12 : h + 12);
  } else {
    if (isNaN(h) || h < 0 || h > 23) {
      alert("Hora inválida para 24h (0-23)");
      return;
    }
  }
  if (isNaN(m) || m < 0 || m > 59) {
    alert("Minuto inválido (0-59)");
    return;
  }

  alarm = { h, m };
  status.textContent = `Alarma a las ${format.value === "12"
    ? alarmH.value.padStart(2, "0") + ":" + String(m).padStart(2, "0") + " " + alarmPeriod.value
    : String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")}`;
  active = true;
};

btnClear.onclick = () => {
  active = false;
  alarm = null;
  status.textContent = "Alarma desactivada";
  sound.pause();
  sound.currentTime = 0;
};

setInterval(updateClock, 1000);
updateClock();
