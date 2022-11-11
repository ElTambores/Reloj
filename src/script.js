/* Estilo */

// Se guarda el botón de modo oscuro
const btn = document.querySelector('.btn-toggle');
// Se comprueba que exista.
if (btn) {
    btn.addEventListener('click', function () {
        // Si existe se pone en modo noche si no estaba activado. Si lo estaba se vuelve al modo por defecto.
        document.body.classList.toggle('dark-theme');
    })
}

let darkMode = false;
function darkModeOnOff(){
    darkMode = !darkMode;
    if(darkMode){
        document.getElementById("a").style.filter = "invert(100%);";
        btn.value = "Modo Claro";
        btn.style.color = "0A214D";
        btn.style.backgroundColor = "ACF1FF";
    }else{
        btn.style.color = "ACF1FF";
        btn.style.backgroundColor = "0A214D";
    }
}

function openPage(pageName, elmnt) {
    // Cada vez que se pulsa un boton del navegador se ponen todos los estilos en none.
    let tabcontent = document.getElementsByClassName("tabcontent");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Cada vez que se pulsa un boton del navegador el resto se ponen en negro.
    let tablinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "#083F37";
        tablinks[i].style.color = "#068989";
    }

    // Se muestra la pestaña asociada al boton clicado
    document.getElementById(pageName).style.display = "block";

    // Se define el color de fondo del boton según corresponda
    elmnt.style.backgroundColor = "#005E5D";
    elmnt.style.color = "#E3FFF3";
}

const item = document.getElementById("defaultOpen");
if (item) item.click();


/*Funciones de persistencia de datos*/

function onloadFunction() {
    checkAlarms();
    checkCrono();
    resetTemp();
}


/* Funciones de Reloj*/

const interval = setInterval(() => {
    document.getElementById("hour").innerHTML = new Date().toString().substring(16, 24);
}, 1000);


/* Funciones Alarma */

const alarmList = [];
let alarmWaitng = false;
let alarmChecker;
let alarmListString = "";

class Alarm {
    constructor(time, status) {
        this.time = time;
        this.status = status;
    }
}

function checkAlarms() {
    getSavedAlarms();
    actualizeAlarmList();
    alarmChecker = setInterval(() => {
        let currentTime = new Date().toString().substring(16, 24);
        for (let i = 0; i < alarmList.length; i++) {
            if (alarmList[i].time === currentTime && alarmList[i].status === 'Activada') {
                alarmActivation(i);
            }
        }
    }, 1000);
}

function getSavedAlarms() {
    let alarmString = localStorage.getItem("alarmList");
    if (alarmString === null) {
        return;
    }
    const newAlarmList = alarmString.split(";");
    for (let i = 0; i < newAlarmList.length - 1; i++) {
        const element = newAlarmList[i].split("/");
        let alarm = new Alarm(element[0], element[1]);
        alarmList[i] = alarm;
    }
}

function alarmActivation() {
    let alarmAudio = document.getElementById("AlarmAudio");
    alarmAudio.loop = true;
    alarmAudio.play();
    document.getElementById("pauseAlarm").style.display = "block";
}

function stopAlarm() {
    let alarmAudio = document.getElementById("AlarmAudio");
    alarmAudio.pause();
    document.getElementById("pauseAlarm").style.display = "none";
}

function addAlarm() {
    alarmWaitng = true;
    let newAlarmTime = document.getElementById("alarmTime").value;
    const newAlarm = new Alarm(newAlarmTime, "Activada");
    alarmList.push(newAlarm);
    actualizeAlarmList();
}

function alarmListToString() {
    let alarmString = "";
    for (let i = 0; i < alarmList.length; i++) {
        alarmString += alarmList[i].time + "/" + alarmList[i].status + ";";
    }
    return alarmString;
}

function actualizeAlarmList() {
    alarmListString = "";
    for (let i = 0; i < alarmList.length; i++) {
        alarmListString += `
        <div class="alarmItem"> <span class="alarmElement"> ${alarmList[i].time} </span>
        <span class="alarmElement"><button onclick="enableAlarm(${i})">${alarmList[i].status}</button></span>
        <span class="alarmElement"><button onclick="deleteAlarm(${i})">Borrar alarma</button></span>
        <span class="alarmElement"><button onclick="goToEdit(${i})">Editar Alarma</button></span>
      </div>`;
    }
    localStorage.setItem("alarmList", alarmListToString());
    document.getElementById("alarmList").innerHTML = alarmListString;
}

function enableAlarm(i) {
    if (alarmList[i].status === "Activada") {
        alarmList[i].status = "Apagada";
    } else {
        alarmList[i].status = "Activada";
    }
    actualizeAlarmList();
}

function deleteAlarm(i) {
    alarmList.splice(i, 1);
    actualizeAlarmList();
}

function goToEdit(i) {
    localStorage.setItem("alarmToChange", i);
    window.location.href = "./editAlarm.html";
}

function editAlarm() {
    getSavedAlarms();
    let index = Number(localStorage.getItem("alarmToChange"));
    alarmList[index].time = document.getElementById("newAlarmTime").value;
    localStorage.setItem("alarmList", alarmListToString());
    window.location.href = "./clock.html";
}


/* Functiones Cronometro */

let chrono;
let isChronoStarted = false;

function startChrono() {
    if (!isChronoStarted) {
        isChronoStarted = true;
        const chronoTime = localStorage.getItem("chronoTime").split(":");
        let startTime = Date.now();
        let hours = parseInt(chronoTime[0]);
        let minutes = parseInt(chronoTime[1]);
        let seconds = parseInt(chronoTime[2]);
        let initMiliseconds = parseInt(chronoTime[3]);
        let miliseconds = 0;

        chrono = setInterval(() => {
            miliseconds = Date.now() - startTime + initMiliseconds;
            if (miliseconds > 999) {
                initMiliseconds = 0;
                startTime = Date.now();
                seconds++;
            }
            if (seconds > 59) {
                seconds = 0;
                minutes++;
            }
            if (minutes > 59) {
                minutes = 0;
                hours++;
            }
            let formatedTime = formatTime(hours, minutes, seconds, miliseconds);
            localStorage.setItem("chronoTime", formatedTime);
            localStorage.setItem("chronoStatus", "play");
            document.getElementById("chronoCurrentTimer").innerHTML = formatedTime;
        }, 1);
    }
}

function stopChrono() {
    localStorage.setItem("chronoStatus", "pause");
    clearInterval(chrono);
    isChronoStarted = false;
}

function resetChrono() {
    localStorage.setItem("chronoStatus", "notStarted");
    clearInterval(chrono);
    localStorage.setItem("chronoTime", "00:00:00:000");
    document.getElementById("chronoCurrentTimer").innerHTML = "00:00:00:000";
    isChronoStarted = false;
}

function checkCrono() {
    let chronoStatus = localStorage.getItem("chronoStatus");
    if (chronoStatus === "notStarted" || chronoStatus == null) {
        resetChrono();
    } else {
        if (chronoStatus === "play") {
            document.getElementById("chronoCurrentTimer").innerHTML = localStorage.getItem("chronoTime");
            startChrono();
        } else if (chronoStatus === "pause") {
            document.getElementById("chronoCurrentTimer").innerHTML = localStorage.getItem("chronoTime");
            stopChrono();
        }
    }
}


/*Funciones Temporizador*/

let temp;
let loopModeActivated = false;
let limitedloopModeActivated = false;
let intervalModeActivated = false;
let isIntervalWaiting = false;
let isTempStarted = false;

function startTemp() {
    let tempInput = checkIntervalMode();;
    if (tempInput === "") {
        return;
    }
    if (!isTempStarted) {
        isTempStarted = true;
        let tempTime = localStorage.getItem("tempTime");
        if (tempTime === "00:00:00:000") {
            tempTime = tempInput;
        }
        tempTime = tempTime.split(":");
        let startTime = Date.now();
        let hours = parseInt(tempTime[0]);
        let minutes = parseInt(tempTime[1]);
        let seconds = parseInt(tempTime[2].split(".")[0]);
        let initMiliseconds = parseInt(tempTime[2].split(".")[1]);
        if (isNaN(initMiliseconds)) {
            initMiliseconds = parseInt(tempTime[3]);
        }
        let miliseconds = 0;

        temp = setInterval(() => {
            if (hours == 0 && minutes == 0 && seconds == 0 && miliseconds < 0) {
                checkIfEndLoopOrInterval();
            }
            else {
                miliseconds = 999 - (Date.now() - startTime + initMiliseconds);
                if (miliseconds < 0) {
                    initMiliseconds = 0;
                    startTime = Date.now();
                    seconds--;
                }
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                let formatedTime = formatTime(hours, minutes, seconds, miliseconds);
                localStorage.setItem("tempTime", formatedTime);
                document.getElementById("tempCurrentTimer").innerHTML = formatedTime;
            }
        }, 1);
    }
}

function checkIntervalMode() {
    let tempInput;
    if (intervalModeActivated && !isIntervalWaiting) {
        tempInput = localStorage.getItem("tempTimeInterval");
    } else {
        tempInput = document.getElementById("tempTime").value;
    }
    return tempInput;
}

function checkIfEndLoopOrInterval() {
    loopReset()
    if (intervalModeActivated && isIntervalWaiting) {
        isIntervalWaiting = false;
        startTemp();
    }
    else if (loopModeActivated) {
        if (intervalModeActivated) {
            if (isIntervalWaiting) {
                isIntervalWaiting = false;
            } else {
                isIntervalWaiting = true;
            }
            startTemp();
        }
        startTemp();
    } else {
        tempSound();
        resetTemp();
        document.getElementById("tempCurrentTimer").innerHTML = "Fin del temporizador";
    }
}


function stopTemp() {
    localStorage.setItem("tempPause", true);
    clearInterval(temp);
    isTempStarted = false;
}

function resetTemp() {
    stopTemp();
    localStorage.setItem("tempTime", "00:00:00:000");
    document.getElementById("tempCurrentTimer").innerHTML = "00:00:00:000";
    loopModeActivated = true;
    intervalModeActivated = true;
    loopOnOff();
    intervalOnOff();
}

function loopReset() {
    stopTemp();
    localStorage.setItem("tempTime", "00:00:00:000");
    document.getElementById("tempCurrentTimer").innerHTML = "00:00:00:000";
}

function loopOnOff() {
    loopModeActivated = !loopModeActivated;
    if (loopModeActivated) {
        document.getElementById("loopButton").innerHTML = "Modo bucle: Encendido";
    } else {
        document.getElementById("loopButton").innerHTML = "Modo bucle: Apagado";
    }
}

function limtedLoopOnOff() {
    limitedloopModeActivated = !limitedloopModeActivated;
    if (limitedloopModeActivated) {
        document.getElementById("limitedLoopButton").innerHTML = "Modo bucles limitados: Encendido";
        document.getElementById("loopNumberElement").style.display = "block";
    } else {
        document.getElementById("limitedLoopButton").innerHTML = "Modo bucles limitados: Apagado";
        document.getElementById("loopNumberElement").style.display = "none";
    }
}

function intervalOnOff() {
    intervalModeActivated = !intervalModeActivated;
    if (intervalModeActivated) {
        isIntervalWaiting = true;
        document.getElementById("intervalButton").innerHTML = "Modo intervalo: Encendido";
        localStorage.setItem("tempTimeInterval", document.getElementById("tempTimeInterval").value);
    } else {
        document.getElementById("intervalButton").innerHTML = "Modo intervalo: Apagado";
        localStorage.setItem("tempTimeInterval", "00:00:00:000");
    }
}


function tempSound() {
    let tempAudio = document.getElementById("TempAudio");
    tempAudio.loop = true;
    tempAudio.play();
    document.getElementById("tempAudioButton").style.display = "block";
}

function tempSoundStop() {
    let tempAudio = document.getElementById("TempAudio");
    tempAudio.pause();
    document.getElementById("tempAudioButton").style.display = "none";
}

/* Generic functions */

function formatTime(hours, minutes, seconds, miliseconds) {
    miliseconds = formatMiliseconds(miliseconds);
    seconds = formatSecMinHour(seconds);
    minutes = formatSecMinHour(minutes);
    hours = formatSecMinHour(hours);
    let formatedTime = hours + ":" + minutes + ":" + seconds + ":" + miliseconds;
    return formatedTime;
}

function formatMiliseconds(miliseconds) {
    if (miliseconds < 10) {
        miliseconds = "00" + miliseconds;
    }
    if (miliseconds < 100) {
        miliseconds = "0" + miliseconds;
    }
    if (miliseconds > 999) {
        miliseconds = "999";
    }
    return miliseconds;
}

function formatSecMinHour(format) {
    if (format < 10) {
        format = "0" + format;
    }
    return format;
}