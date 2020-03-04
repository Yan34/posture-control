const goodState = "good posture";
const badState = "BAD POSTURE!!!";
var isStarted=false;

function start() {
    document.getElementById("startButton").innerHTML="Остановить";
    document.getElementById("startButton").onclick = '';
    document.getElementById("startButton").removeEventListener("click", start);
    document.getElementById("startButton").addEventListener("click", stop);
    console.log('start button clicked, loop isn\'t started');
    isStarted = true;
    //start tracking here
    console.log('loop started');
}

function stop() {
    document.getElementById("startButton").innerHTML="Начать";
    document.getElementById("startButton").removeEventListener("click", stop);
    document.getElementById("startButton").addEventListener("click", start);
    console.log('example button clicked, loop is started');
    document.getElementById("state").innerHTML = '';
    isStarted = false;
    //stop tracking here
    console.log('loop stopped');
}