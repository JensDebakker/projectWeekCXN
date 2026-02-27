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
            answerStatus.textContent = "Wrong, a woman on the left had a distorted face and had strange fingers in the other image";
            changeVideo();
            break;
        case 2:
            answerStatus.textContent = "Wrong, the buildings in the back on the left had very strange lines and the people had strange faces in the other image";
            changeVideo();
            break;
        case 3:
            answerStatus.textContent = "Correct, there were multiple issues with their fingers ";
            gameData.score+=1;
            changeVideo();
            break;
        case 4:
            answerStatus.textContent = "Correct, the buildings on the left had strange lines";
            gameData.score+=1;
            changeVideo();
            break;
        case 5:
            answerStatus.textContent = "Wrong, The fingers of the man in the middle made no sense in the other image";
            changeVideo();
            break;
        case 6:
            answerStatus.textContent = "Correct, the sketches and buildings had strange lines";
            gameData.score+=1;
            changeVideo();
            break;
        case 7:
            answerStatus.textContent = "Wrong, their fingers were strange in the other image";
            endGame();
            break;
    }
}

const submitRight = () =>{
    let answerStatus = document.getElementById("answerStatus")
    switch(gameData.currentVid){
        case 1:
            answerStatus.textContent = "Correct, a woman on the left had distorted face and had strange fingers";
            gameData.score+=1;
            changeVideo();
            break;
        case 2:
            answerStatus.textContent = "Correct, the buildings in the back on the left had very strange lines and the people had strange faces";
            gameData.score+=1;
            changeVideo();
            break;
        case 3:
            answerStatus.textContent = "Wrong, there were multiple issues with their fingers in the other image";
            changeVideo();
            break;
        case 4:
            answerStatus.textContent = "Wrong, the buildings on the left had strange lines in the other image"
            changeVideo();
            break;
        case 5:
            answerStatus.textContent = "Correct, The fingers of the man in the middle made no sense";
            gameData.score+=1;
            changeVideo();
            break;
        case 6:
            answerStatus.textContent = "Wrong, the sketches and buildings had strange lines in the other image";
            changeVideo();
            break;
        case 7:
            answerStatus.textContent = "Correct, their fingers were strange";
            gameData.score+=1;
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
}

window.addEventListener("load", setup);