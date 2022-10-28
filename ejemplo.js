var playPause = document.querySelector(".playpause");
var x = document.querySelector(".div");
var y = document.querySelector(".div1");
var countdown = document.querySelector(".countdown");
const initialTime = 20;
let time = 0;
let lala = 1;
let gate = false;

const intervalFn = function() {
  const min = Math.floor(time / 60);
  let sec = time % 60;
  sec = sec < 10 ? "0" + sec : sec;
  countdown.innerHTML = `${min}:${sec}`;
  let ini = (time * 100) / initialTime;
  let percentage = ini * (1 / 100) * y.offsetWidth;
  x.style.width = percentage + "px";
  if (time == initialTime) clearInterval(timerClass.updatecountDown);
  time++;
};

const timerClass = {
  updatecountDown: setInterval(intervalFn, 1000),
};

playPause.addEventListener("mouseup", function() {
  if (gate == false) {
    clearInterval(timerClass.updatecountDown);
    playPause.innerHTML = `Play`;
    gate = true;
  } else {
    // Want to write something here so that timer start again
    timerClass.updatecountDown = setInterval(intervalFn, 1000);
    playPause.innerHTML = `Pause`;
    gate = false;
  }
});