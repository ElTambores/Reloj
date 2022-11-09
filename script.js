/* Estilo */
function openPage(pageName, elmnt, color) {
    // Cada vez que se pulsa un boton del navegador se ponen todos los estilos en none.
    let tabcontent = document.getElementsByClassName("tabcontent");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Cada vez que se pulsa un boton del navegador se quitan todos los fondos
    let tablinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Se muestra la pestaña asociada al boton clicado
    document.getElementById(pageName).style.display = "block";

    // Se define el color de fondo del boton según corresponda
    elmnt.style.backgroundColor = color;

}

document.getElementById("defaultOpen").click();


/*Funciones de persistencia de datos*/

function onloadFunction() {
    checkAlarms();
    checkCrono();
    resetTemp();
}

function getNewTime(lastTime, currentTime) {
    let difference = currentTime - lastTime;
    let chronoTime = toMiliSeconds(localStorage.getItem("chronoTime"));
    return toTime(Number(chronoTime) + Number(difference));
}

function toMiliSeconds(stringTime) {
    const time = stringTime.split(":");
    return (Number(time[0]) * 3600000) + (Number(time[1]) * 60000) + (Number(time[2]) * 1000) + Number(time[3]);
}

function toTime(miliseconds) {
    let hour = Math.floor(miliseconds / 3600000);
    let remMili = miliseconds - (hour * 3600000);
    let minutes = Math.floor(remMili / 60000);
    remMili = remMili - (minutes * 60000);
    let seconds = Math.floor(remMili / 1000);
    miliseconds = remMili - (seconds * 1000);
    return formatTime(hour, minutes, seconds, miliseconds);
}

/* Funciones de Reloj*/

const interval = setInterval(() => {
    document.getElementById("hour").innerHTML = new Date().toString().substring(16, 24);
}, 1000);

/* Funciones Alarma */

const alarmList = [];
let alarmWaitng = false;
let alarmChecker;
let alarmListString = `<tr>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Borrar</th>
                                <th>Editar</th>
                            </tr>`;

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
    const newAlarmList = alarmString.split(";");
    for (let i = 0; i < newAlarmList.length - 1; i++) {
        const element = newAlarmList[i].split("/");
        let alarm = new Alarm(element[0], element[1]);
        alarmList[i] = alarm;
    }
}

function alarmActivation() {
    let alarmAudio = document.getElementById("AlarmAudio");
    alarmAudio.play();
}

function stopAlarm() {
    let alarmAudio = document.getElementById("AlarmAudio");
    alarmAudio.pause();
}

function addAlarm() {
    alarmWaitng = true;
    let newAlarmTime = document.getElementById("alarmTime").value;
    const newAlarm = new Alarm(newAlarmTime, "Activada");
    alarmList.push(newAlarm);
    actualizeAlarmList();
    localStorage.setItem("alarmList", alarmListToString());
}

function alarmListToString() {
    let alarmString = "";
    for (let i = 0; i < alarmList.length; i++) {
        alarmString += alarmList[i].time + "/" + alarmList[i].status + ";";
    }
    return alarmString;
}

function actualizeAlarmList() {
    alarmListString = `<tr>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Borrar</th>
                                <th>Editar</th>
                            </tr>`;
    for (let i = 0; i < alarmList.length; i++) {
        alarmListString += `
        <tr> <td> ${alarmList[i].time} </td>
        <td><button onclick="enableAlarm(${i})">${alarmList[i].status}</button></td>
        <td><button onclick="deleteAlarm(${i})">Borrar alarma</button></td>
        <td><button onclick="goToEdit(${i})">Editar Alarma</button></td>
      </tr>`;
    }
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
    window.location.href = "/editAlarm.html";
}

function editAlarm() {
    getSavedAlarms();
    let index = Number(localStorage.getItem("alarmToChange"));
    alarmList[index].name = document.getElementById("newAlarmTime");
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
            localStorage.setItem("savedChronoTime", new Date());
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
    localStorage.setItem("savedChronoTime", "00:00:00:000");
    document.getElementById("chronoCurrentTimer").innerHTML = "00:00:00:000";
    isChronoStarted = false;
}

function checkCrono() {
    let chronoStatus = localStorage.getItem("chronoStatus");
    if (chronoStatus === "notStarted" || chronoStatus == null) {
        resetChrono();
    } else {
        if (chronoStatus === "play") {
            // let lastTime = localStorage.getItem("savedChronoTime");
            // let currentTime = new Date();
            // let currentChronoTime = getNewTime(lastTime, currentTime);
            // document.getElementById("chronoCurrentTimer").innerHTML = currentChronoTime;
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
let intervalModeActivated = false;
let isIntervalWaiting = false;
let intervalTempTime;
let mainTempTime;
let currentTempTime;
let isTempStarted = false;

function startTemp() {
    let tempInput = document.getElementById("tempTime").value;
    if (tempInput === "") {
        return;
    }
    if (!isTempStarted) {
        isTempStarted = true;
        let tempTime = localStorage.getItem("tempTime");
        if (tempTime === "00:00:00:000") {
            tempTime = tempInput;
        }
        currentTempTime = tempTime;
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
                resetTemp();
                if (isIntervalWaiting) {
                    isIntervalWaiting = false;
                    localStorage.setItem("tempTime", intervalTempTime);
                    startTemp();
                }
                else if (loopModeActivated) {
                    if (isIntervalWaiting) {
                        isIntervalWaiting = false;
                        localStorage.setItem("tempTime", intervalTempTime);
                        startTemp();
                    } else {

                    }
                    localStorage.setItem("tempTime", currentTempTime);
                    startTemp();
                } else {
                    document.getElementById("tempCurrentTimer").innerHTML = "Fin del temporizador";
                }
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
                localStorage.setItem("savedTempTime", new Date().toString().substring(16, 24));
                document.getElementById("tempCurrentTimer").innerHTML = formatedTime;
            }
        }, 1);
    }
}

function stopTemp() {
    localStorage.setItem("tempPause", true);
    clearInterval(temp);
    isTempStarted = false;
}

function resetTemp() {
    localStorage.setItem("tempPause", true);
    clearInterval(temp);
    localStorage.setItem("tempTime", "00:00:00:000");
    localStorage.setItem("savedTempTime", "00:00:00:000");
    document.getElementById("tempCurrentTimer").innerHTML = "00:00:00:000";
    isTempStarted = false;
}

function loopOnOff() {
    loopModeActivated = !loopModeActivated;
    if (loopModeActivated) {
        document.getElementById("loopButton").innerHTML = "Modo bucle: Encendido";
    } else {
        document.getElementById("loopButton").innerHTML = "Modo bucle: Apagado";
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