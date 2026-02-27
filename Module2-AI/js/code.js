let gameData={
    currentVid: 1,
    score: 0
}

const setup = () =>{
    document.getElementById("imgLeftSubmit").addEventListener("click", submitLeft);
    document.getElementById("imgRightSubmit").addEventListener("click", submitRight);
    
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
    //gets the currently visible image element id
    let oldVidLeft = "img" + gameData.currentVid.toString() + "Left";
    let oldVidRight = "img" + gameData.currentVid.toString() + "Right";
    gameData.currentVid+=1; //Increments the currentVid number
    //Gets the next video element to show
    let videoLeft = "img" + gameData.currentVid.toString() + "Left";
    let videoRight = "img" + gameData.currentVid.toString() + "Right";

    //Change visibility state
    document.getElementById(oldVidLeft).classList.toggle("hidden")
    document.getElementById(oldVidRight).classList.toggle("hidden")
    document.getElementById(videoLeft).classList.toggle("hidden")
    document.getElementById(videoRight).classList.toggle("hidden")
}

const endGame = () =>{
    document.getElementById("img7Left").classList.toggle("hidden");
    document.getElementById("img7Right").classList.toggle("hidden");
    document.getElementById("imgLeftSubmit").classList.toggle("hidden");
    document.getElementById("imgRightSubmit").classList.toggle("hidden");
    let resTxt = document.getElementById("result");
    resTxt.classList.toggle("hidden");
    resTxt.textContent = "Your score is: " + gameData.score

    // Save score to leaderboard
    const playerName = localStorage.getItem("playerName") || "Guest (AI Module)";
    if (window.LeaderboardManager) {
        window.LeaderboardManager.saveScore(playerName, gameData.score, "AI Detector");
    }
}

window.addEventListener("load", setup);