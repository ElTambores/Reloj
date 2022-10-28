
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

// Abre de forma automatica la pestaña definida por defecto.
document.getElementById("defaultOpen").click();

//Constante que se actualiza cada segundo con la hora actual.
const interval = setInterval(() => {
    document.getElementById("hour").innerHTML = new Date().toString().substring(16, 24);
}, 1000);

let chrono;
let isChronoStarted = false;

let temp;
let isTempStarted = false;

function onloadFunction() {
    resetChrono();
}

function startChrono() {
    if (!isChronoStarted) {
        isChronoStarted = true;
        const chronoTime = localStorage.getItem("chronoTime").split(":");
        let startTime = Date.now();
        let hours = parseInt(chronoTime[0]);
        let minutes = parseInt(chronoTime[1]);
        let seconds = parseInt(chronoTime[2]);
        let miliseconds = parseInt(chronoTime[3]);

        chrono = setInterval(() => {
            miliseconds = Date.now() - startTime;
            if (miliseconds > 999) {
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
            document.getElementById("chronoCurrentTimer").innerHTML = formatedTime;
        }, 10);
    }
}

function stopChrono() {
    clearInterval(chrono);
    isChronoStarted = false;
}

function resetChrono() {
    clearInterval(chrono);
    localStorage.setItem("chronoTime", "00:00:00:000");
    document.getElementById("chronoCurrentTimer").innerHTML = "00:00:00:000";
    isChronoStarted = false;
}


function startTemp() {
    let tempTime = document.getElementById("tempTime").value.split(":");
    let hours = parseInt(tempTime[0]);
    let minutes = parseInt(tempTime[1]);
    let seconds = parseInt(tempTime[2].split(".")[0]);
    let miliseconds = parseInt(tempTime[2].split(".")[1]);
    temp = setInterval(() => {
        if (hours == 0 && minutes == 0 && seconds == 0 && miliseconds <= 0) {
            document.getElementById("tempCurrentTimer").innerHTML = "Fin del temporizador";
            clearInterval(temp);
        }
        else {
            miliseconds = - Date.now();
            if (miliseconds < 0) {
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
            document.getElementById("tempCurrentTimer").innerHTML = formatTime(hours, minutes, seconds, miliseconds);
        }
    }, 1000);
}

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