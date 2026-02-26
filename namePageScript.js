/**
 * Name Page Script - Handles player name entry and initialization
 */

function startGame() {
    const nameInput = document.getElementById("username");
    const name = nameInput.value.trim();

    if (name === "") {
        alert("⚠️ Please enter your name to continue");
        nameInput.focus();
        return;
    }

    if (name.length < 2) {
        alert("⚠️ Name must be at least 2 characters long");
        nameInput.focus();
        return;
    }

    // Store player name and reset score
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerScore", "0");
    
    // Navigate to quiz
    window.location.href = "quiz.html";
}

// Allow Enter key to start game
document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            startGame();
        }
    });
    usernameInput.focus();
});
