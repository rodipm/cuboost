import "./style.css";
import { TwistyPlayer } from "cubing/twisty";
import $ from "jquery";

// Event listeners for control buttons
const connectButton = document.getElementById("connect-cube")!;
connectButton.addEventListener("click", () => {
    if (connectButton.classList.contains("connect")) {
        alert("Connecting to cube...");
        connectButton.textContent = "Disconnect Cube";
        connectButton.classList.remove("connect");
        connectButton.classList.add("disconnect");
    } else {
        alert("Disconnecting cube...");
        connectButton.textContent = "Connect Cube";
        connectButton.classList.remove("disconnect");
        connectButton.classList.add("connect");
    }
});

document.getElementById("sync-gyro")?.addEventListener("click", () => {
    alert("Syncing gyro...");
});

document.getElementById("reset-cube")?.addEventListener("click", () => {
    alert("Resetting cube state...");
});

// Initialize the TwistyPlayer
const twistyPlayer = new TwistyPlayer({
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
    document.getElementById("battery-level")!.innerText = `${batteryLevel}%`;
}, 5000);

// Timer mockup
const startTime = Date.now();
setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = ((elapsedTime % 60000) / 1000).toFixed(2);
    document.getElementById("timer")!.innerText = `${minutes}:${seconds}`;
}, 100);

// Display wrong move (mock)
function showWrongMove() {
    const wrongMoveElement = document.getElementById("wrong-move")!;
    wrongMoveElement.style.display = "inline";
    setTimeout(() => {
        wrongMoveElement.style.display = "none";
    }, 2000); // Hide after 2 seconds
}

// Mock function to update solve history
function addSolveRecord(isCorrect: boolean, time: string) {
    const solveList = document.getElementById("solves")!;
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
function updateSolveStats(total: number, correct: number, fastest: string, mean: string, mistakes: number) {
    document.getElementById("solve-count")!.innerText = total.toString();
    document.getElementById("correct-count")!.innerText = correct.toString();
    document.getElementById("fastest-time")!.innerText = fastest;
    document.getElementById("mean-time")!.innerText = mean;
    document.getElementById("mistake-count")!.innerText = mistakes.toString();
}

// Example usage of mock functions
addSolveRecord(true, "00:45.23");
addSolveRecord(false, "01:12.45");
addSolveRecord(true, "00:45.23");
addSolveRecord(false, "01:12.45");
addSolveRecord(true, "00:45.23");
addSolveRecord(false, "01:12.45");
addSolveRecord(true, "00:45.23");
addSolveRecord(false, "01:12.45");
updateSolveStats(10, 7, "00:42.12", "00:50.34", 3);



/////////////// LOOKS OK UNTIL HERE  /////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////
//////////////////////// CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW CONTINUE BELOW //////////////////////



// Mock current algorithm name
document.getElementById("current-alg-name")!.innerText = "Current Algorithm: OLL";

// Handle algorithm selection
document.getElementById("alg-select")?.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const selectedAlg = target.value;
    if (selectedAlg === "custom") {
        document.getElementById("custom-alg")!.style.display = "inline";
    } else {
        document.getElementById("custom-alg")!.style.display = "none";
        document.getElementById("current-alg-name")!.innerText = `Current Algorithm: ${selectedAlg}`;
        // Update the twistyPlayer alg with the selected algorithm (mock)
        twistyPlayer.alg = "R U R' F..."; // Replace with actual alg steps
    }
});

// Mock data for OLL and PLL algorithms
const algs = {
    oll: [
        { name: "OLL 1", notation: "R U2 R' U' R U R' U' R U' R'" },
        { name: "OLL 2", notation: "F R U R' U' F'" },
        // Add more OLL algorithms as needed
    ],
    pll: [
        { name: "PLL 1", notation: "R2 U R U R' U' R' U' R' U R'" },
        { name: "PLL 2", notation: "R U' R U R U R U' R' U' R2" },
        { name: "PLL 2", notation: "R U' R U R U R U' R' U' R2" },
        { name: "PLL 2", notation: "R U' R U R U R U' R' U' R2" },
        { name: "PLL 2", notation: "R U' R U R U R U' R' U' R2" },
        { name: "PLL 2", notation: "R U' R U R U R U' R' U' R2" },
        { name: "PLL 2", notation: "R U' R U R U R U' R' U' R2" },
        { name: "PLL 2", notation: "R U' R U R U R U' R' U' R2" },
        { name: "PLL 2", notation: "R U' R U R U R U' R' U' R2" },
        { name: "PLL LAST", notation: "R U' R U R U R U' R' U' R2" },
        // Add more PLL algorithms as needed
    ],
};

document.addEventListener("DOMContentLoaded", () => {
    // Initialize the custom selects
    initCustomSelect("alg-type-select", handleAlgTypeChange);

    // Handle custom algorithm input
    const customAlgInput = document.getElementById("custom-alg-input") as HTMLInputElement;
    customAlgInput.addEventListener("input", () => {
        const notation = customAlgInput.value.trim();
        displayAlgorithmSteps(notation);
        document.getElementById("current-alg-name")!!.textContent = "Current Algorithm: Custom";
    });
});

function handleAlgTypeChange(value: string) {
    const algOptionsSelect = document.getElementById("alg-options-select") as HTMLElement;
    const customAlgInput = document.getElementById("custom-alg-input") as HTMLInputElement;
    const algStepsContainer = document.getElementById("alg-steps") as HTMLElement;
    const currentAlgName = document.getElementById("current-alg-name") as HTMLElement;

    if (value === "custom") {
        algOptionsSelect.style.display = "none";
        customAlgInput.style.display = "block";
        algStepsContainer.innerHTML = "";
        currentAlgName.textContent = "Current Algorithm: Custom";
    } else {
        // Populate algorithm options
        const optionsContainer = algOptionsSelect.querySelector(".select-items") as HTMLElement;
        optionsContainer.innerHTML = "";
        algs[value].forEach((alg: { name: string | null; notation: string | undefined; }) => {
            const optionDiv = document.createElement("div");
            optionDiv.textContent = alg.name;
            optionDiv.dataset.notation = alg.notation;
            optionsContainer.appendChild(optionDiv);
        });

        algOptionsSelect.style.display = "block";
        customAlgInput.style.display = "none";
        algStepsContainer.innerHTML = "";
        currentAlgName.textContent = `Current Algorithm: ${value.toUpperCase()}`;

        initCustomSelect("alg-options-select", handleAlgSelection);
    }
}

function handleAlgSelection(algName: string, selectedDiv: HTMLElement) {
    const notation = selectedDiv.dataset.notation;
    displayAlgorithmSteps(notation);
    document.getElementById("current-alg-name").textContent = `Current Algorithm: ${algName}`;
}

function initCustomSelect(elementId: string, onChange: (value: string, selectedDiv?: HTMLElement) => void) {
    const select = document.getElementById(elementId);
    const selected = select.querySelector(".select-selected") as HTMLElement;
    const optionsContainer = select.querySelector(".select-items") as HTMLElement;
    const mainArea = document.getElementsByClassName("main-area")[0] as HTMLElement;

    selected.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllSelect(selected);
        optionsContainer.classList.toggle("select-hide");
        selected.classList.toggle("select-arrow-active");
        mainArea.scrollTop = mainArea.scrollHeight;
    });

    optionsContainer.querySelectorAll("div").forEach((optionDiv) => {
        optionDiv.addEventListener("click", (e) => {
            const value = optionDiv.dataset.value || optionDiv.textContent;
            selected.textContent = optionDiv.textContent;
            onChange(value, optionDiv);
            optionsContainer.classList.add("select-hide");
            selected.classList.remove("select-arrow-active"); 
        });
    });
}

// Function to close all select boxes except the current one
function closeAllSelect(current?: HTMLElement) {
    const selects = document.querySelectorAll(".select-items");
    const selecteds = document.querySelectorAll(".select-selected");
    selects.forEach((select) => {
        if (select !== current) {
            select.classList.add("select-hide");
        }
    });
    selecteds.forEach((selected) => {
        if (selected !== current) {
            selected.classList.remove("select-arrow-active");
        }
    });
}

// Close all selects when clicking outside
document.addEventListener("click", closeAllSelect);

// Function to display algorithm steps
function displayAlgorithmSteps(notation: string) {
    const algStepsContainer = document.getElementById("alg-steps") as HTMLElement;
    algStepsContainer.innerHTML = "";
    const moves = notation.split(" ");
    moves.forEach((move, index) => {
        const stepSpan = document.createElement("span");
        stepSpan.textContent = move;
        stepSpan.classList.add("step");
        if (index === 0) {
            stepSpan.classList.add("current-move");
        } else {
            stepSpan.classList.add("not-made");
        }
        algStepsContainer.appendChild(stepSpan);
    });
}