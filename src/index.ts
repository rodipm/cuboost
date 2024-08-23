import "./style.css";
import { TwistyPlayer } from "cubing/twisty";
import $ from "jquery";

document.getElementById("connect-cube").addEventListener("click", () => {
    alert("Connecting to cube...");
});

document.getElementById("disconnect-cube").addEventListener("click", () => {
    alert("Disconnecting cube...");
});

document.getElementById("sync-gyro").addEventListener("click", () => {
    alert("Syncing gyro...");
});

document.getElementById("reset-cube").addEventListener("click", () => {
    alert("Resetting cube state...");
});

// Initialize the TwistyPlayer
var twistyPlayer = new TwistyPlayer({
    puzzle: "3x3x3",
    visualization: "PG3D",
    alg: "",
    experimentalSetupAnchor: "start",
    background: "none",
    controlPanel: "none",
    hintFacelets: "none",
    experimentalDragInput: "none",
    cameraLatitude: 0,
    cameraLongitude: 0,
    cameraLatitudeLimit: 0,
    tempoScale: 5,
});

$("#twisty-player").append(twistyPlayer);

// Mock battery level
setInterval(() => {
    const batteryLevel = Math.floor(Math.random() * 100) + 1;
    document.getElementById("battery-level").innerText = `${batteryLevel}%`;
}, 5000);

// Timer mockup
let startTime = Date.now();
setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = ((elapsedTime % 60000) / 1000).toFixed(2);
    document.getElementById("timer").innerText = `${minutes}:${seconds}`;
}, 100);

// Display wrong move (mock)
function showWrongMove() {
    document.getElementById("wrong-move").style.display = "inline";
    setTimeout(() => {
        document.getElementById("wrong-move").style.display = "none";
    }, 2000); // Hide after 2 seconds
}

// Mock function to update solve history
function addSolveRecord(isCorrect, time) {
    const solveList = document.getElementById("solves");
    const listItem = document.createElement("li");

    if (isCorrect) {
        listItem.className = "correct";
        listItem.textContent = `Time: ${time} - Correct`;
    } else {
        listItem.className = "incorrect";
        listItem.textContent = `Time: ${time} - Incorrect: made wrong move at step X`;
    }

    solveList.prepend(listItem);
}

// Mock function to update solve stats
function updateSolveStats(total, correct, fastest, mean, mistakes) {
    document.getElementById("solve-count").innerText = total;
    document.getElementById("correct-count").innerText = correct;
    document.getElementById("fastest-time").innerText = fastest;
    document.getElementById("mean-time").innerText = mean;
    document.getElementById("mistake-count").innerText = mistakes;
}

// Example usage of mock functions
addSolveRecord(true, "00:45.23");
addSolveRecord(false, "01:12.45");
updateSolveStats(10, 7, "00:42.12", "00:50.34", 3);

// Mock current algorithm name
document.getElementById("current-alg-name").innerText = "Current Algorithm: T-Perm";

// Handle algorithm selection
document.getElementById("alg-selector").addEventListener("change", (e) => {
    const selectedAlg = e.target.value;
    if (selectedAlg === "custom") {
        document.getElementById("custom-alg").style.display = "inline";
    } else {
        document.getElementById("custom-alg").style.display = "none";
        document.getElementById("current-alg-name").innerText = `Current Algorithm: ${selectedAlg}`;
        // Update the twistyPlayer alg with the selected algorithm (mock)
        twistyPlayer.alg = "R U R' F..."; // Replace with actual alg steps
    }
});
