class Email {
    constructor(from, subject, body, correct) {
        this.from = from;
        this.subject = subject;
        this.body = body;
        this.correct = correct;
    }
}

const emails = [
    new Email(
        "IT Support <itsupport@company-secure.com>",
        "URGENT: Password Expiration Notice",
        "Dear employee,\n\nYour password will expire today.\nClick here immediately to reset: http://secure-company-login.com\n\nFailure to act will result in suspension.",
        "phishing"
    ),

    new Email(
        "HR Department <hr@yourcompany.com>",
        "Updated Remote Work Policy",
        "Hello team,\n\nPlease review the updated remote work policy attached in the internal portal.\n\nRegards,\nHR",
        "real"
    ),

    new Email(
        "Amazon Rewards <rewards@amaz0n-bonus.net>",
        "You've Won a Gift Card!",
        "Congratulations!\n\nYou have been selected to receive a $500 gift card.\nClaim now by verifying your company credentials.",
        "phishing"
    )
];

let current = 0;
let score = 0;

const welcome = document.getElementById("welcome");
const fromField = document.getElementById("from");
const subjectField = document.getElementById("subject");
const bodyField = document.getElementById("body");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

function init() {
    const name = localStorage.getItem("playerName");

    if (!name) {
        window.location.href = "index.html";
        return;
    }

    welcome.textContent = `Player: ${name}`;
    loadEmail();
}

function loadEmail() {
    const email = emails[current];
    fromField.textContent = email.from;
    subjectField.textContent = email.subject;
    bodyField.textContent = email.body;

    feedback.textContent = "";
    nextBtn.style.display = "none";
}

function answer(choice) {
    if (choice === emails[current].correct) {
        feedback.textContent = "Correct!";
        score++;
    } else {
        feedback.textContent = "Incorrect!";
    }

    nextBtn.style.display = "inline-block";
}

function nextQuestion() {
    current++;

    if (current < emails.length) {
        loadEmail();
    } else {
        endGame();
    }
}

function endGame() {
    document.querySelector(".email").style.display = "none";
    document.querySelector(".buttons").style.display = "none";
    nextBtn.style.display = "none";

    finalScore.textContent = `Final Score: ${score} / ${emails.length}`;
    restartBtn.style.display = "inline-block";
}

function restartGame() {
    localStorage.removeItem("playerName");
    window.location.href = "index.html";
}

init();
