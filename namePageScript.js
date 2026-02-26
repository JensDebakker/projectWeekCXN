/**
 * Name Page Script - Handles player name entry and initialization
 */

function startGame() {
    const nameInput = document.getElementById("username");
    const name = nameInput.value.trim();

    if (name === "") {
        alert(i18n.t("alertEmpty"));
        nameInput.focus();
        return;
    }

    if (name.length < 2) {
        alert(i18n.t("alertShort"));
        nameInput.focus();
        return;
    }

    // Store player name and reset score
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerScore", "0");

    // Navigate to quiz
    window.location.href = "quiz.html";
}

// Apply language and wire up the slider on load
document.addEventListener("DOMContentLoaded", function () {
    i18n.initSwitches();

    const usernameInput = document.getElementById("username");
    usernameInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            startGame();
        }
    });
    usernameInput.focus();
});
