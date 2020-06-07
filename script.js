const goodState = "Хорошая осанка";
const badState = "ПЛОХАЯ ОСАНКА!!!";
const BAD_DELTA_EYES = 15, BAD_DELTA_SHOULDERS=30;

let video;
let poseNet;
let poses = [];
var isStarted=false;

var rightEye, leftEye, defaultRightEyePosition = [], 
    rightShoulder, leftShoulder;

function setup() {
    const canvas = createCanvas(640, 480);
    
    video = createCapture(VIDEO);
    video.size(width, height);
    
    if (video == true) { console.log('Video capture created'); }

    poseNet = ml5.poseNet(video, modelReady);
    
    poseNet.on('pose', function (results) {
        poses = results;
    });

    // Hide the video element, and just show the canvas
    video.hide();
    noLoop();
}

function start() {
    document.getElementById("startButton").innerHTML="Остановить";
    document.getElementById("startButton").onclick = '';
    document.getElementById("startButton").removeEventListener("click", start);
    document.getElementById("startButton").addEventListener("click", stop);
    console.log('start button clicked, loop isn\'t started');
    isStarted = true;
    loop(); //p5.js function
    console.log('loop started');
}

function stop() {
    document.getElementById("startButton").innerHTML="Начать";
    document.getElementById("startButton").removeEventListener("click", stop);
    document.getElementById("startButton").addEventListener("click", start);
    console.log('example button clicked, loop is started');
    document.getElementById("state").innerHTML = '';
    isStarted = false;
    noLoop(); //p5.js function
    console.log('loop stopped');
    rightEye=null; leftEye=null; defaultRightEyePosition = [];
}

function draw() {
    if (isStarted) {  
        push();
        translate(width,0);
        scale(-1, 1);
        image(video, 0, 0, width, height);
        drawBodyParts();
        pop();
    }
}

function modelReady() {

}

function drawBodyParts() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            rightEye = pose.keypoints[2].position;
            leftEye = pose.keypoints[1].position;
            rightShoulder = pose.keypoints[6].position;
            leftShoulder = pose.keypoints[5].position;

            //Position of eyes when a human opens experiment page. Start position.
            while (defaultRightEyePosition.length < 1) {
                defaultRightEyePosition.push(rightEye.y);
            }

            if (Math.abs(rightEye.y - defaultRightEyePosition[0]) < BAD_DELTA_EYES && Math.abs(rightEye.y - leftEye.y) < BAD_DELTA_EYES &&
                Math.abs(rightShoulder.y - leftShoulder.y) < BAD_DELTA_SHOULDERS) {
                document.getElementById("state").style.color="black";
                document.getElementById("state").style.fontWeight="";
                document.getElementById("state").innerHTML = goodState;
            } 
            else {
                document.getElementById("state").style.color="red";
                document.getElementById("state").style.fontWeight="bold";
                document.getElementById("state").innerHTML = badState;
                if (Math.abs(rightEye.y - leftEye.y) >= BAD_DELTA_EYES || Math.abs(rightEye.y - defaultRightEyePosition[0]) >=BAD_DELTA_EYES) {
                    document.getElementById("state").innerHTML += " ГОЛОВА!!!";
                }
                if (Math.abs(rightShoulder.y - leftShoulder.y) >= BAD_DELTA_SHOULDERS) {
                    document.getElementById("state").innerHTML += " ПЛЕЧИ!!!";
                }
            }

            // Only draw a body part is the pose probability is bigger than 0.2
            if (keypoint.score > 0.9) {
                fill(255, 0, 0);
                noStroke();
                ellipse(rightEye.x, rightEye.y, 10, 10);
                ellipse(leftEye.x, leftEye.y, 10, 10);
                ellipse(rightShoulder.x, rightShoulder.y, 30, 30);
                ellipse(leftShoulder.x, leftShoulder.y, 30, 30);
            }
        }
    }
}