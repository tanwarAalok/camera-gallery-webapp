let video = document.querySelector("video");
let recordBtnContainer = document.querySelector(".record-btn-container");
let captureBtnContainer = document.querySelector(".capture-btn-container");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let transparentColor = "transparent";
let recorder;

let constraints = {
    video: true,
    audio: true
}

let chunks = [];

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream
    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start", (e) => {
        chunks = [];
    })
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop" , (e) => {
        // conversion of media chunks to video
        let blob = new Blob(chunks, {type: "video/mp4"});
        let videoURL = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click()
    })
})

recordBtnContainer.addEventListener('click', (e) => {
    if(!recorder) return;
    recordFlag = !recordFlag;

    if(recordFlag){
        recorder.start();
        startTimer();
        recordBtn.classList.add('scale-record');
    }
    else{
        recorder.stop();
        stopTimer();
        recordBtn.classList.remove('scale-record');
    }
})

captureBtnContainer.addEventListener('click', (e) => {
    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext('2d');
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    //Filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();
    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "image.jpg";
    a.click();
})

let timerId, counter = 0;
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        let seconds = counter;

        let hours = Number.parseInt(seconds/3600);
        seconds %= 3600;

        let minutes = Number.parseInt(seconds/60);
        seconds %= 60;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }
    timerId = setInterval(displayTimer, 1000)
}

function stopTimer(){
    clearInterval(timerId)
    timer.innerText = "00:00:00"
    timer.style.display = "none";
}
//filtering logic
let allFilters = document.querySelectorAll('.filter');
let filterLayerContainer = document.querySelector('.filter-layer');
allFilters.forEach((filter) => {
    filter.addEventListener('click', (e) => {
        transparentColor = getComputedStyle(filter).getPropertyValue('background-color');
        filterLayerContainer.style.backgroundColor = transparentColor;
    })
})

