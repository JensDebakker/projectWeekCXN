let gameData={
    currentVid: 1,
    score: 0
}

const setup = () =>{
    document.getElementById("vidLeftSubmit").addEventListener("click", submitLeft);
    document.getElementById("vidRightSubmit").addEventListener("click", submitRight);
    
}

const submitLeft = () =>{
    let answerStatus = document.getElementById("answerStatus")
    switch(gameData.currentVid){
        case 1:
            answerStatus.textContent = "Correct"
            gameData.score+=1;
            changeVideo();
            break;
        case 2:
            answerStatus.textContent = "Correct"
            gameData.score+=1;
            changeVideo();
            break;
        case 3:
            answerStatus.textContent = "Correct"
            gameData.score+=1;
            changeVideo();
            break;
        case 4:
            answerStatus.textContent = "Correct"
            gameData.score+=1;
            changeVideo();
            break;
        case 5:
            answerStatus.textContent = "Correct"
            gameData.score+=1;
            changeVideo();
            break;
        case 6:
            answerStatus.textContent = "Correct"
            gameData.score+=1;
            changeVideo();
            break;
        case 7:
            answerStatus.textContent = "Correct"
            gameData.score+=1;
            endGame();
            break;
    }
}

const submitRight = () =>{
    let answerStatus = document.getElementById("answerStatus")
    switch(gameData.currentVid){
        case 1:
            answerStatus.textContent = "Wrong"
            changeVideo();
            break;
        case 2:
            answerStatus.textContent = "Wrong"
            changeVideo();
            break;
        case 3:
            answerStatus.textContent = "Wrong"
            changeVideo();
            break;
        case 4:
            answerStatus.textContent = "Wrong"
            changeVideo();
            break;
        case 5:
            answerStatus.textContent = "Wrong"
            changeVideo();
            break;
        case 6:
            answerStatus.textContent = "Wrong"
            changeVideo();
            break;
        case 7:
            answerStatus.textContent = "Wrong"
            endGame();
            break;
    }
}

const changeVideo = () =>{
    //gets the currently visible video element id
    let oldVidLeft = "vid" + gameData.currentVid.toString() + "Left";
    let oldVidRight = "vid" + gameData.currentVid.toString() + "Right";
    gameData.currentVid+=1; //Increments the currentVid number
    //Gets the next video element to show
    let videoLeft = "vid" + gameData.currentVid.toString() + "Left";
    let videoRight = "vid" + gameData.currentVid.toString() + "Right";

    //Change visibility state
    document.getElementById(oldVidLeft).classList.toggle("hidden")
    document.getElementById(oldVidRight).classList.toggle("hidden")
    document.getElementById(videoLeft).classList.toggle("hidden")
    document.getElementById(videoRight).classList.toggle("hidden")
}

const endGame = () =>{
    document.getElementById("vid7Left").classList.toggle("hidden");
    document.getElementById("vid7Right").classList.toggle("hidden");
    document.getElementById("vidLeftSubmit").classList.toggle("hidden");
    document.getElementById("vidRightSubmit").classList.toggle("hidden");
    document.getElementById("answerStatus").classList.toggle("hidden");
    let resTxt = document.getElementById("result");
    resTxt.classList.toggle("hidden");
    resTxt.textContent = "Your score is: " + gameData.score
}

window.addEventListener("load", setup);