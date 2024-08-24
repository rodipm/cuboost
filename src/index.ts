import "./style.css";

import $ from "jquery";
import * as THREE from "three";
import { Subscription, interval } from "rxjs";
import { TwistyPlayer } from "cubing/twisty";
import { experimentalSolve3x3x3IgnoringCenters } from "cubing/search";
import { Alg } from "cubing/alg";
import {
  faceletsToPattern,
  patternToFacelets,
  oll_algs,
  pll_algs,
  isRotateMove,
  isDoubleMove,
  isSliceMove,
  isWideMove,
} from "./utils.js";
import {
  now,
  connectGanCube,
  GanCubeConnection,
  GanCubeEvent,
  GanCubeMove,
  MacAddressProvider,
  makeTimeFromTimestamp,
  cubeTimestampLinearFit,
} from "gan-web-bluetooth";

/* Globals */

// Twisty and real cube
const SOLVED_STATE = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
const HOME_ORIENTATION = new THREE.Quaternion().setFromEuler(
  new THREE.Euler((0 * Math.PI) / 180, (0 * Math.PI) / 180, 0)
);
let cubeQuaternion: THREE.Quaternion = new THREE.Quaternion().setFromEuler(
  new THREE.Euler((0 * Math.PI) / 180, (0 * Math.PI) / 180, 0)
);
let basis: THREE.Quaternion | null;
let twistyPlayer: TwistyPlayer | null;
let twistyScene: THREE.Scene;
let twistyVantage: any;

let conn: GanCubeConnection | null;

// Algorithm related
let cubeStateInitialized = false;
let lastMoves: GanCubeMove[] = [];
let solutionMoves: GanCubeMove[] = [];

let currentAlg: string | null = null;
let currentMoveIndex: number = 0;

let isAwaitingDoubleMove: boolean = false;
let isAwaitingSliceMove: boolean = false;

let cubeFacesOrientation = ["F", "B", "R", "L", "U", "D"];
let expectedFacesOrientation: string[] | null = null;

// timer
var timerState: "IDLE" | "READY" | "RUNNING" | "STOPPED" = "IDLE";
var localTimer: Subscription | null = null;


/*  Cube setup and animations*/
twistyPlayer = new TwistyPlayer({
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

twistyPlayer.experimentalModel.currentPattern.addFreshListener(
  async (kpattern: any) => {
    console.log(`kpattern:`);
    console.log(kpattern);
    var facelets = patternToFacelets(kpattern);
    if (facelets == SOLVED_STATE) {
      if (timerState == "RUNNING") {
        setTimerState("STOPPED");
      }
      if (twistyPlayer)
        twistyPlayer.alg = "";
    }
  }
);

async function amimateCubeOrientation() {
  if (!twistyPlayer)
    return
  if (!twistyScene || !twistyVantage) {
    var vantageList = await twistyPlayer.experimentalCurrentVantages();
    twistyVantage = [...vantageList][0];
    twistyScene = await twistyVantage.scene.scene();
  }
  twistyScene.quaternion.slerp(cubeQuaternion, 0.25);
  twistyVantage.render();
  requestAnimationFrame(amimateCubeOrientation);
}

requestAnimationFrame(amimateCubeOrientation);

$("#twisty-player").append(twistyPlayer);

/*  Cube Event Handling */
$("#reset-cube").on("click", async () => {
  await conn?.sendCubeCommand({ type: "REQUEST_RESET" });
  if (twistyPlayer)
    twistyPlayer.alg = "";
});

$("#sync-gyro").on("click", async () => {
  basis = null;
});

$("#connect-cube").on("click", async () => {
  const connectButton = document.getElementById("connect-cube")!;

  if (conn) {
    conn.disconnect();
    conn = null;
    connectButton.textContent = "Connect Cube";
    connectButton.classList.remove("disconnect");
    connectButton.classList.add("connect");
  } else {
    conn = await connectGanCube(customMacAddressProvider);
    conn.events$.subscribe(handleCubeEvent);
    await conn.sendCubeCommand({ type: "REQUEST_HARDWARE" });
    await conn.sendCubeCommand({ type: "REQUEST_BATTERY" });
    await conn.sendCubeCommand({ type: "REQUEST_FACELETS" });
    connectButton.textContent = "Disconnect Cube";
    connectButton.classList.remove("connect");
    connectButton.classList.add("disconnect");
  }
});

const customMacAddressProvider: MacAddressProvider = async (
  device,
  isFallbackCall
): Promise<string | null> => {
  if (isFallbackCall) {
    return prompt(
      "Unable do determine cube MAC address!\nPlease enter MAC address manually:"
    );
  } else {
    return typeof device.watchAdvertisements == "function"
      ? null
      : prompt(
          "Seems like your browser does not support Web Bluetooth watchAdvertisements() API. Enable following flag in Chrome:\n\nchrome://flags/#enable-experimental-web-platform-features\n\nor enter cube MAC address manually:"
        );
  }
};

function handleCubeEvent(event: GanCubeEvent) {
  if (event.type == "GYRO") {
    handleGyroEvent(event);
  } else if (event.type == "MOVE") {
    handleMoveEvent(event);
  } else if (event.type == "FACELETS") {
    handleFaceletsEvent(event);
  } else if (event.type == "BATTERY") {
    console.log(event.batteryLevel)
    $("#battery-level").val(event.batteryLevel + "%");
  } else if (event.type == "DISCONNECT") {
    if (twistyPlayer)
      twistyPlayer.alg = "";
    $(".info input").val("- n/a -");
    $("#connect-cube").text("Connect Cube")
    $("#connect-cube").removeClass("disconnect");
    $("#connect-cube").addClass("connect");
  }
}

async function handleGyroEvent(event: GanCubeEvent) {
  if (event.type == "GYRO") {
    let { x: qx, y: qy, z: qz, w: qw } = event.quaternion;
    let quat = new THREE.Quaternion(qx, qz, -qy, qw).normalize();
    if (!basis) {
      basis = quat.clone().conjugate();
      let b = new THREE.Euler().setFromQuaternion(quat.clone());
      console.log(`Basis: x=${b.x} y=${b.y} z=${b.z}`);
    }
    cubeQuaternion.copy(quat.premultiply(basis).premultiply(HOME_ORIENTATION));
   
    await updateCubeFaceOrientation(cubeQuaternion);

    $("#green-face").val(`Verde aponta para: (${cubeFacesOrientation[0]})`);
    $("#blue-face").val(`Azul aponta para: (${cubeFacesOrientation[1]})`);
    $("#red-face").val(`Vermelho aponta para: (${cubeFacesOrientation[2]})`);
    $("#orange-face").val(`Laranja aponta para: (${cubeFacesOrientation[3]})`);
    $("#white-face").val(`Branco aponta para: (${cubeFacesOrientation[4]})`);
    $("#yellow-face").val(`Amarelo aponta para: (${cubeFacesOrientation[5]})`);
  }
}

async function handleMoveEvent(event: GanCubeEvent) {
  console.log("handleMoveEvent");

  if (event.type == "MOVE") {
    console.log(event.move);
    console.log(timerState)
    if (timerState == "READY") {
      setTimerState("RUNNING");
    }
    lastMoves.push(event);
    if (timerState == "RUNNING") {
      solutionMoves.push(event);
    }
    if (lastMoves.length > 256) {
      lastMoves = lastMoves.slice(-256);
    }
    await checkMove(event.move);
  }
}

async function handleFaceletsEvent(event: GanCubeEvent) {
  if (event.type == "FACELETS" && !cubeStateInitialized) {
    console.log("handleFaceletsEvent");
    console.log(event.facelets);
    if (event.facelets != SOLVED_STATE) {
      var kpattern = faceletsToPattern(event.facelets);
      var solution = await experimentalSolve3x3x3IgnoringCenters(kpattern);
      var scramble = solution.invert();
      if (twistyPlayer)
        twistyPlayer.alg = scramble;
    } else {
      if (twistyPlayer)
        twistyPlayer.alg = "";
    }
    cubeStateInitialized = true;
    console.log("Initial cube state is applied successfully", event.facelets);
  }
}

async function updateCubeFaceOrientation(cubeQuaternion: THREE.Quaternion) {
  const front = new THREE.Vector3(0, 0, 1);
  const back = new THREE.Vector3(0, 0, -1);
  const right = new THREE.Vector3(1, 0, 0);
  const left = new THREE.Vector3(-1, 0, 0);
  const top = new THREE.Vector3(0, 1, 0);
  const bottom = new THREE.Vector3(0, -1, 0);

  // Aplicar a rotação do quaternion a cada vetor
  front.applyQuaternion(cubeQuaternion);
  back.applyQuaternion(cubeQuaternion);
  right.applyQuaternion(cubeQuaternion);
  left.applyQuaternion(cubeQuaternion);
  top.applyQuaternion(cubeQuaternion);
  bottom.applyQuaternion(cubeQuaternion);

  let before = [...cubeFacesOrientation];
  cubeFacesOrientation = [
    getRealFaceOrientation(front),
    getRealFaceOrientation(back),
    getRealFaceOrientation(right),
    getRealFaceOrientation(left),
    getRealFaceOrientation(top),
    getRealFaceOrientation(bottom),
  ];

  if (before.toString() != cubeFacesOrientation.toString()) {
    console.log("CUBE CHANGED ORIENTATION!");

    if (currentAlg != null) {
      let currentMove = currentAlg.split(" ")[currentMoveIndex];

      if (isRotateMove(currentMove)) {

        if (currentMoveIndex == 0 && timerState != "RUNNING")
          setTimerState("RUNNING");

        console.log("Current expected move is rotate move: " + currentMove);
        console.log("before orientation: " + before);

        let currentFacesOrientationString = cubeFacesOrientation.toString();

        for (let m of ["x", "x'", "y", "y'", "z", "z'"]) {
          let expected = getOrientationBasedOnMove(before, m);
          if (expected?.toString() == currentFacesOrientationString) {
            if (m == currentMove) {
              console.log(
                "current orientation equals expected orientation for move: " +
                  currentMove
              );
            } else {
              console.log(
                "current orientation does not equal expected orientation for move: " +
                  currentMove
              );
              console.log("but instead, corresponds to this move: " + m);
            }
            checkAlgStateAfterMoveAndUpdate(m);
            break;
          }
        }
      }
    }
  }

  if (expectedFacesOrientation != null) {
    console.log(
      "Expected faces orientation: \n" +
        expectedFacesOrientation +
        "CubefacesOrientation: " +
        cubeFacesOrientation
    );
    if (
      cubeFacesOrientation.toString() == expectedFacesOrientation.toString()
    ) {
      console.log("Current orientation equals expected orientation");
      expectedFacesOrientation = null;
    }
  }
}

/* CUBE MOVE HANDLING */ 
async function checkMove(move: string) {
  console.log(currentAlg)
  if (currentAlg == null) return;

  console.log("checkMove")
  console.log("currentMoveIndex: " + currentMoveIndex)
  if (currentMoveIndex == 0 && timerState != "RUNNING")
    setTimerState("RUNNING");

  let currentAlgMoves = currentAlg.split(" ");
  let currentAlgMove = currentAlgMoves[currentMoveIndex];
  console.log(currentAlgMoves)
  console.log(currentAlgMoves)

  move = await convertOrientationMove(move);

  if (isWideMove(currentAlgMove)) {
    console.log("isWideMove");
    let wideMove = handleWideMove(currentAlgMove);

    if (wideMove) {
      console.log("wideMove: " + wideMove);
      move = wideMove;
      let lastMove = lastMoves.pop();
      lastMoves.pop();
      lastMove!!.move = wideMove;
      lastMoves.push(lastMove!!);
    }
  }

  if (isSliceMove(currentAlgMove)) {
    console.log("isSliceMove " + currentAlgMove);

    if (!isPossibleCorrectSliceMove(currentAlgMove, move)) {
      console.log(
        `Not possible slice move: ${move} | currentAlgMove: ${currentAlgMove}`
      );
      addSolveRecord(false, move)
      resetStates();
      displayAlgorithmSteps(currentAlg)
      showWrongMove(move)
      return;
    }

    if (isAwaitingSliceMove) {
      console.log("isAwaitingSliceMove");
      isAwaitingSliceMove = false;
      let sliceMove = handleSliceMove();
      if (sliceMove != null) {
        console.log("sliceMove: " + sliceMove);
        move = sliceMove;
        let lastMove = lastMoves.pop();
        lastMoves.pop();
        lastMove!!.move = sliceMove;
        lastMoves.push(lastMove!!);
      }
    } else {
      isAwaitingSliceMove = true;
      return;
    }
  }

  if (isDoubleMove(currentAlgMove)) {
    console.log("isDoubleMove");
    if (isAwaitingDoubleMove) {
      console.log("isAwaitingDoubleMove");
      isAwaitingDoubleMove = false;
      let doubleMove = handleDoubleMove(currentAlgMove);
      if (doubleMove != null) move = doubleMove;
      console.log(`Result double move: ${move}`);
    } else {
      isAwaitingDoubleMove = true;
      return;
    }
  }

  checkAlgStateAfterMoveAndUpdate(move);
}

function checkAlgStateAfterMoveAndUpdate(move: string) {
  let currentAlgMoves = currentAlg!!.split(" ");
  if (move != currentAlgMoves[currentMoveIndex]) {
    console.log("FAILED ALG with move: " + move);
    addSolveRecord(false, move)
    resetStates();
    showWrongMove(move)
    console.log(currentAlgMoves);
    console.log(currentMoveIndex);
    console.log(currentAlgMoves.slice(0, currentMoveIndex + 1));
  } else if (currentMoveIndex == currentAlgMoves.length - 1) {
    console.log("FINISHED SUCCESSFULLY");
    resetStates();
    addSolveRecord(true, move)
  } else {
    currentMoveIndex = currentMoveIndex + 1;
    if (twistyPlayer)
      twistyPlayer.experimentalAddMove(move, { cancel: false });
      showWrongMove(null);
  }

  displayAlgorithmSteps(currentAlg!!)
}

async function convertOrientationMove(move: string): Promise<string> {
  let faceIndex = 0;
  let moveFace = "";

  let moves = ["F", "B", "R", "L", "U", "D"];

  for (let i = 0; i < moves.length; i++) {
    let m = moves[i];

    if (move.includes(m)) {
      faceIndex = i;
      moveFace = moves[i];
      break;
    }
  }

  let orientedFace =
    expectedFacesOrientation != null
      ? expectedFacesOrientation[faceIndex]
      : cubeFacesOrientation[faceIndex];

  let newMoveFace = orientedFace;

  let replacedMove = move.replace(moveFace, newMoveFace);
  console.log(
    `convertOrientationMove: faceindex = ${faceIndex} moveFace = ${moveFace} orientedFace = ${orientedFace} newMoveFace = ${newMoveFace}`
  );

  let lastMove = lastMoves.pop();
  if (lastMove) {
    lastMove.move = replacedMove;
  }
  lastMoves.push(lastMove!!);
  return replacedMove;
}

function handleWideMove(currentAlgMove: string): string | null {
  console.log(handleWideMove);

  let currentSingleMove = lastMoves[lastMoves.length - 1].move;
  console.log("currentSingleMove: " + currentSingleMove);
  let baseWideMove = currentSingleMove[0];
  let inverseMove = "";
  switch (baseWideMove) {
    case "R":
      inverseMove = "L";
      break;
    case "L":
      inverseMove = "R";
      break;
    case "U":
      inverseMove = "D";
      break;
    case "D":
      inverseMove = "U";
      break;
    case "F":
      inverseMove = "B";
      break;
    case "B":
      inverseMove = "F";
      break;
  }
  console.log("inverseMove: " + inverseMove);

  let isCcw = currentSingleMove.includes("'");
  console.log("isCcw: " + isCcw);

  let doubleMove = inverseMove.toLocaleLowerCase();
  if (isCcw) doubleMove += "'";
  console.log("doubleMove: " + doubleMove);

  updateExpectedCubeOrientation(doubleMove);

  if (doubleMove == currentAlgMove) {
    return currentAlgMove;
  } else return null;
}

function handleSliceMove(): string | null {
  let currentSingleMove = lastMoves[lastMoves.length - 1].move;
  let lastSingleMove = lastMoves[lastMoves.length - 2].move;
  let combination = lastSingleMove + currentSingleMove;
  let result: string | null = null;
  console.log(
    `handleSliceMove: currentSingleMove = ${currentSingleMove} lastSingleMove = ${lastSingleMove} combination = ${combination}`
  );
  switch (combination) {
    case "RL'":
      result = "M";
      break;
    case "LR'":
      result = "M'";
      break;
    case "UD'":
      result = "E";
      break;
    case "DU'":
      result = "E'";
      break;
    case "BF'":
      result = "S";
      break;
    case "FB'":
      result = "S'";
      break;
  }

  if (result) updateExpectedCubeOrientation(result);

  return result;
}

function handleDoubleMove(doubleMove: string): string | null {
  let currentSingleMove = lastMoves[lastMoves.length - 1].move;
  let lastSingleMove = lastMoves[lastMoves.length - 2].move;
  console.log(`doubleMove (current in alg): ${doubleMove}`);
  console.log(`CurrentSingleMove: ${currentSingleMove}`);
  console.log(`lastSingleMove: ${lastSingleMove}`);

  let recognizedDoubleMove: string | null = null;

  if (currentSingleMove == lastSingleMove) {
    recognizedDoubleMove = currentSingleMove[0] + "2";

    if (currentSingleMove.includes("'")) recognizedDoubleMove += "'";
  }

  console.log(
    `recognizedDoubleMove (before adjusting CW or CCW): ${recognizedDoubleMove}`
  );
  if (recognizedDoubleMove?.replace("'", "") == doubleMove.replace("'", ""))
    recognizedDoubleMove = doubleMove;

  console.log(
    `recognizedDoubleMove (after adjusting CW or CCW): ${recognizedDoubleMove}`
  );
  return recognizedDoubleMove;
}

function isPossibleCorrectSliceMove(
  currentAlgMove: string,
  move: string
): boolean {
  console.log(
    "isPossibleCorrectSliceMove. current: " + currentAlgMove + " move: " + move
  );
  if (currentAlgMove[0] == "M") {
    return "RL".includes(move[0]);
  }
  if (currentAlgMove[0] == "E") {
    return "UD".includes(move[0]);
  }
  if (currentAlgMove[0] == "S") {
    return "FB".includes(move[0]);
  } else return false;
}

function getOrientationBasedOnMove(
  cubeOrientation: string[],
  move: string
): string[] | null {
  if (expectedFacesOrientation != null) {
    if (cubeOrientation.toString() == expectedFacesOrientation.toString()) {
      console.log("expected alreay equals current cube face orientation");
      return [...cubeOrientation];
    }
  }

  let currentFacesOrientation =
    expectedFacesOrientation != null
      ? [...expectedFacesOrientation]
      : [...cubeOrientation];

  let colors = ["green", "blue", "red", "orange", "white", "yellow"];
  let faces = ["F", "B", "R", "L", "U", "D"];

  let orientation2 = [];
  for (let face of faces) {
    orientation2.push(colors[currentFacesOrientation.indexOf(face)]);
  }

  let result: string[] | null = [...orientation2];

  if (move == "M" || move == "r'" || move == "l" || move == "x'") {
    result[0] = orientation2[4]; // F -> U
    result[1] = orientation2[5]; // B -> D
    result[4] = orientation2[1]; // U -> B
    result[5] = orientation2[0]; // D -> F
  } else if (move == "M'" || move == "r" || move == "l'" || move == "x") {
    result[0] = orientation2[5]; // F -> D
    result[1] = orientation2[4]; // B -> U
    result[4] = orientation2[0]; // U -> F
    result[5] = orientation2[1]; // D -> B
  } else if (move == "E" || move == "d" || move == "u'" || move == "y'") {
    result[0] = orientation2[3]; // F -> L
    result[1] = orientation2[2]; // B -> R
    result[2] = orientation2[0]; // R -> F
    result[3] = orientation2[1]; // D -> B
  } else if (move == "E'" || move == "d'" || move == "u" || move == "y") {
    result[0] = orientation2[2]; // F -> R
    result[1] = orientation2[3]; // B -> L
    result[2] = orientation2[1]; // R -> B
    result[3] = orientation2[0]; // L -> F
  } else if (move == "S" || move == "f" || move == "b" || move == "z") {
    result[2] = orientation2[4]; // R -> U
    result[3] = orientation2[5]; // L -> D
    result[4] = orientation2[3]; // U -> L
    result[5] = orientation2[2]; // D -> R
  } else if (move == "S'" || move == "f'" || move == "b'" || move == "z'") {
    result[2] = orientation2[5]; // R -> D
    result[3] = orientation2[4]; // L -> U
    result[4] = orientation2[2]; // U -> R
    result[5] = orientation2[3]; // D -> L
  } else result = null;

  console.log(`updateExpectedCubeOrientation. SliceMove: ${move}`);
  console.log(`prientation2`);
  console.log(orientation2);
  console.log("cubeOrientation:");
  console.log(cubeOrientation);
  console.log("expectedFacesOrientation:");
  console.log(expectedFacesOrientation);
  console.log("currentFacesOrientation:");
  console.log(currentFacesOrientation);
  console.log("result: ");
  console.log(result);

  if (result != null) {
    let newCubeOrientation = [];

    for (let color of colors) {
      newCubeOrientation.push(faces[result.indexOf(color)]);
    }

    result = [...newCubeOrientation];
    console.log("newCubeOrientation: ");
    console.log(newCubeOrientation);
  }

  return result;
}

function getRealFaceOrientation(ajustedFace: THREE.Vector3): string {
  let dots = [
    ajustedFace.dot(new THREE.Vector3(0, 0, 1)),
    ajustedFace.dot(new THREE.Vector3(0, 0, -1)),
    ajustedFace.dot(new THREE.Vector3(1, 0, 0)),
    ajustedFace.dot(new THREE.Vector3(-1, 0, 0)),
    ajustedFace.dot(new THREE.Vector3(0, 1, 0)),
    ajustedFace.dot(new THREE.Vector3(0, -1, 0)),
  ];

  let dirIndex = dots.indexOf(Math.max(...dots));

  return ["F", "B", "R", "L", "U", "D"][dirIndex];
}

function updateExpectedCubeOrientation(move: string) {
  let result = getOrientationBasedOnMove(cubeFacesOrientation, move);

  if (result) expectedFacesOrientation = [...result];
  else expectedFacesOrientation = null;
}


/* SOLVES */
function addSolveRecord(isCorrect: boolean, move: string) {
  const solveList = document.getElementById("solves")!;
  const listItem = document.createElement("li");

  if (isCorrect) {
      listItem.className = "correct";
      listItem.textContent = `Time: ${$("#timer").html()} - Correct`;
  } else {
      listItem.className = "incorrect";
      listItem.textContent = `Incorrect: [${currentAlg!!.split(" ").slice(0, currentMoveIndex + 1).join(" ")}] -> ${move}`;
  }

  solveList.prepend(listItem);

  let solves = [...solveList.childNodes].filter(x => x.nodeName.toLocaleLowerCase() == "li")
  let correctSolves = solves.filter(x => (x as Element).className == "correct")
  console.log(correctSolves)
  console.log(correctSolves.map((solve) => solve.textContent))
  let correctTimes = correctSolves.map(solve => (solve as Element).innerHTML.split(" ")[1])
  console.log("correctTimes: ")
  console.log(correctTimes)
  const { fastestTime, meanTime } = findFastestAndMeanTimes(correctTimes);

  updateSolveStats(solves.length, correctSolves.length, fastestTime, meanTime, solves.length - correctSolves.length) // TODO FIX THIS to use real data
}

function updateSolveStats(total: number, correct: number, fastest: string, mean: string, mistakes: number) {
  document.getElementById("solve-count")!.innerText = total.toString();
  document.getElementById("correct-count")!.innerText = correct.toString();
  document.getElementById("fastest-time")!.innerText = fastest;
  document.getElementById("mean-time")!.innerText = mean;
  document.getElementById("mistake-count")!.innerText = mistakes.toString();
}

function convertToSeconds(timeStr: string) : number {
  const [minutes, rest] = timeStr.split(':');
  const seconds = parseFloat(rest);
  return parseInt(minutes) * 60 + seconds;
}

function convertToTimeFormat(totalSeconds: number) : string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(2);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(5, '0')}`;
}

function findFastestAndMeanTimes(times: string[]) {
  const timesInSeconds = times.map(convertToSeconds);
  
  const fastestTimeInSeconds = Math.min(...timesInSeconds);
  const meanTimeInSeconds = timesInSeconds.reduce((a, b) => a + b, 0) / timesInSeconds.length;
  
  const fastestTime = convertToTimeFormat(fastestTimeInSeconds);
  const meanTime = convertToTimeFormat(meanTimeInSeconds);
  
  return {
      fastestTime,
      meanTime
  };
}

/* ALG DISPLAY */ 

function displayAlgorithmSteps(notation: string) {
  const algStepsContainer = document.getElementById("alg-steps") as HTMLElement;
  algStepsContainer.innerHTML = "";
  const moves = notation.split(" ");
  moves.forEach((move, index) => {
      const stepSpan = document.createElement("span");
      stepSpan.textContent = move;
      stepSpan.classList.add("step");
      if (index === currentMoveIndex) {
          stepSpan.classList.add("current-move");
      } else if (index > currentMoveIndex) {
          stepSpan.classList.add("not-made");
      }
      algStepsContainer.appendChild(stepSpan);
  });
}

function showWrongMove(move: string | null) {
  const wrongMoveElement = document.getElementById("wrong-move")!;
  if (!move) {
    wrongMoveElement.style.display = "none";
    return 
  }

  wrongMoveElement.style.display = "inline";
  wrongMoveElement.innerHTML = move
}

/* ALG SELECTOR */

document.getElementById("alg-select")?.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const selectedAlg = target.value;
    if (selectedAlg === "custom") {
        document.getElementById("custom-alg")!.style.display = "inline";
    } else {
        document.getElementById("custom-alg")!.style.display = "none";
        document.getElementById("current-alg-name")!.innerText = `Current Algorithm: ${selectedAlg}`;
    }
});

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the custom selects
  initCustomSelect("alg-type-select", handleAlgTypeChange);

  // Handle custom algorithm input
  const customAlgInput = document.getElementById("custom-alg-input") as HTMLInputElement;
  customAlgInput.addEventListener("input", () => {
      const notation = customAlgInput.value.trim();
      currentAlg = notation;
      document.getElementById("solves")!.innerHTML = ''
      updateSolveStats(0, 0, "--:--", "--:--", 0)
      resetStates();
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

      (value == "oll" ? oll_algs : pll_algs).forEach((selectedAlg: { name: string; alg: string; }) => {
          const optionDiv = document.createElement("div");
          optionDiv.textContent = selectedAlg.name;
          optionDiv.dataset.notation = selectedAlg.alg;
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
  const notation = selectedDiv.dataset.notation!!;
  currentAlg = notation
  document.getElementById("solves")!.innerHTML = ''
  updateSolveStats(0, 0, "--:--", "--:--", 0)
  resetStates()
  displayAlgorithmSteps(notation);
  document.getElementById("current-alg-name")!!.textContent = `Current Algorithm: ${algName}`;
}

function initCustomSelect(elementId: string, onChange: (value: string, selectedDiv: HTMLElement) => void) {
  const select = document.getElementById(elementId)!!;
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
      optionDiv.addEventListener("click", _ => {
          const value = optionDiv.dataset.value || optionDiv.textContent;
          selected.textContent = optionDiv.textContent;
          onChange(value!!, optionDiv);
          optionsContainer.classList.add("select-hide");
          selected.classList.remove("select-arrow-active"); 
      });
  });
}

// Function to close all select boxes except the current one
function closeAllSelect(current?: HTMLElement) {
  console.log(current)
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

function closeAllSelectCallback(event: MouseEvent) {
  const current = event?.target as HTMLElement;
  closeAllSelect(current)
}

// Close all selects when clicking outside
document.addEventListener("click", closeAllSelectCallback);

function resetStates() {
  lastMoves = [];
  if (currentAlg && twistyPlayer)
    twistyPlayer.alg = new Alg(currentAlg).invert();
  setTimerState("STOPPED");
  currentMoveIndex = 0;
  isAwaitingDoubleMove = false;
  isAwaitingSliceMove = false;
  expectedFacesOrientation = null;
}

/* TIMER */
function  setTimerState(state: typeof timerState) {
  console.log("setTimerState: " + state);
  timerState = state;
  switch (state) {
    case "IDLE":
      stopLocalTimer();
      $("#timer").hide();
      break;
    case "READY":
      setTimerValue(0);
      $("#timer").show();
      $("#timer").css("color", "#0f0");
      break;
    case "RUNNING":
      solutionMoves = [];
      startLocalTimer();
      $("#timer").css("color", "#999");
      break;
    case "STOPPED":
      stopLocalTimer();
      $("#timer").css("color", "#fff");
      var fittedMoves = cubeTimestampLinearFit(solutionMoves);
      var lastMove = fittedMoves.slice(-1).pop();
      setTimerValue(lastMove ? lastMove.cubeTimestamp : 0);
      break;
  }
}
function setTimerValue(timestamp: number) {
  let t = makeTimeFromTimestamp(timestamp);
  $("#timer").html(
    `${t.minutes}:${t.seconds.toString(10).padStart(2, "0")}.${t.milliseconds
      .toString(10)
      .padStart(3, "0")}`
  );
}

function startLocalTimer() {
  console.log("startLocalTimer");
  var startTime = now();
  localTimer = interval(30).subscribe(() => {
    setTimerValue(now() - startTime);
  });
}

function stopLocalTimer() {
  console.log("stopLocalTimer");
  localTimer?.unsubscribe();
  localTimer = null;
}

function activateTimer() {
  console.log("activateTimer");
  if (timerState == "IDLE" && conn) {
    setTimerState("READY");
  } else {
    setTimerState("IDLE");
  }
}

$(document).on(
  "keydown",
  (event: { which: number; preventDefault: () => void }) => {
    if (event.which == 32) {
      event.preventDefault();
      activateTimer();
    }
  }
);