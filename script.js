 const interval = setInterval(() => {
    document.getElementById("hora").innerHTML = new Date().toString().substring(16,24);
}, 1000);

let second = 0;
let crono = setInterval(() => {
    second +=1;
    console.log(second/10);
}, 10);