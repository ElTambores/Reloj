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

function startChrono() {
    console.log(chronoTime);
    let second = 0;
    let chrono = setInterval(() => {
        chronoTimer(second);
    }, 10);
}

function chronoTimer(second) {
    second += 1;
    console.log(second / 10)
}
function startTemp() {
    let chronoTime = document.getElementById("TempTime").value;
    console.log(chronoTime);
    let second = 0;
    let chrono = setInterval(() => {
        second += 1;
        console.log(second / 10);
    }, 10);
}

