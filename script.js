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
    let chronoStatus = localStorage.getItem("chronoStatus");
    if (chronoStatus === "notStarted") {
        resetChrono();
    } else {
        if (chronoStatus === "play") {
            let lastTime = Number(localStorage.getItem("savedChronoTime"));
            let currentTime = new Date();
            let currentChronoTime = getNewTime(lastTime, currentTime);
            document.getElementById("chronoCurrentTimer").innerHTML = currentChronoTime;
            startChrono();
        } else if (chronoStatus === "pause") {
            document.getElementById("chronoCurrentTimer").innerHTML = localStorage.getItem("chronoTime");
            stopChrono();
        }
    }
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

// function toTime(miliseconds) {
//     let hour = Math.floor(miliseconds / 3600000);
//     let remMili = miliseconds - (hour * 3600000);
//     let minutes = Math.floor(remMili / 60000);
//     remMili = remMili - (minutes * 60000);
//     let seconds = Math.floor(remMili / 1000);
//     let miliseconds = remMili - (seconds * 1000);
//     return formatTime(hour,minutes, seconds, miliseconds);
// }

/* Funciones de Reloj*/

const interval = setInterval(() => {
    document.getElementById("hour").innerHTML = new Date().toString().substring(16, 24);
}, 1000);


/* Functiones Cronometro */

let chrono;
let isChronoStarted = false;
let chronoPause = localStorage.getItem("chronoPause");

function startChrono() {
    localStorage.setItem("chronoPause", false);
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



/*Funciones Temporizador*/

let temp;
let loopModeActivated = false;
let intervalModeActivated = false;
let isIntervalWaiting = false;
let intervalTempTime;
let currentTempTime;
let isTempStarted = false;
let tempPause = localStorage.getItem("tempPause");

function startTemp() {
    localStorage.setItem("tempPause", false);
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
        intervalTempTime = document.getElementById("tempCurrentTimer");
    } else {
        document.getElementById("intervalButton").innerHTML = "Modo intervalo: Apagado";
        intervalTempTime = document.getElementById("00:00:00:000");
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

function addTime(timeA, timeB) {
    const addedTime = [];
    for (let i = 0; i < timeA.length; i++) {
        let add = parseInt(timeA[i]) + parseInt(timeB[i]);
        if (add > 60) {
            addedTime[i - 1]++;
            add -= 60;
        }
        addedTime[i] = add;
    }
    return addedTime;
}

function subTime(timeA, timeB) {
    const addedTime = [];
    for (let i = 0; i < timeA.length; i++) {
        let sub = parseInt(timeA[i]) - parseInt(timeB[i]);
        if (sub <= 0) {
            addedTime[i - 1]--;
            sub = + 60;
        }
        addedTime[i] = sub;
    }
    return addedTime;
}
