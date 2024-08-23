import "./style.css";

import $, { ajaxPrefilter, timers } from "jquery";
import * as THREE from "three";
import { Subscription, interval, sample, lastValueFrom, last } from "rxjs";
import { TwistyPlayer } from "cubing/twisty";
import { experimentalSolve3x3x3IgnoringCenters } from "cubing/search";
import { Alg } from "cubing/alg";
import {
  faceletsToPattern,
  patternToFacelets,
  oll_algs,
  pll_algs,
} from "./utils";
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

if (import.meta.hot) {
  import.meta.hot.accept(async () => {
    // This block runs before the module is updated

    if (navigator.bluetooth) {
      // Assuming you have a global or accessible reference to your Bluetooth device
      if (conn) {
        await conn.disconnect();
        conn = null;
        console.log("Bluetooth device disconnected before HMR update.");
      }
      if (window && window.location) window.location.reload();
      else if (location && location.reload) location.reload();
    }
  });
}

const SOLVED_STATE = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

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

$("#cube").append(twistyPlayer);

var conn: GanCubeConnection | null;
var lastMoves: GanCubeMove[] = [];
var solutionMoves: GanCubeMove[] = [];

let currentAlg: string | null = null;
let currentMoveIndex: number = 0;

let isAwaitingDoubleMove: boolean = false;
let isAwaitingSliceMove: boolean = false;

let cubeFacesOrientation = ["F", "B", "R", "L", "U", "D"];
let expectedFacesOrientation: string[] | null = null;

var twistyScene: THREE.Scene;
var twistyVantage: any;

const HOME_ORIENTATION = new THREE.Quaternion().setFromEuler(
  new THREE.Euler((0 * Math.PI) / 180, (0 * Math.PI) / 180, 0)
);
var cubeQuaternion: THREE.Quaternion = new THREE.Quaternion().setFromEuler(
  new THREE.Euler((0 * Math.PI) / 180, (0 * Math.PI) / 180, 0)
);

async function amimateCubeOrientation() {
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

var basis: THREE.Quaternion | null;

async function handleGyroEvent(event: GanCubeEvent) {
  if (event.type == "GYRO") {
    let { x: qx, y: qy, z: qz, w: qw } = event.quaternion;
    let quat = new THREE.Quaternion(qx, qz, -qy, qw).normalize();
    if (!basis) {
      basis = quat.clone().conjugate();
      let b = new THREE.Euler().setFromQuaternion(quat.clone());
      log(`Basis: x=${b.x} y=${b.y} z=${b.z}`);
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
    // console.log(expectedFacesOrientation)
    if (
      cubeFacesOrientation.toString() == expectedFacesOrientation.toString()
    ) {
      console.log("Current orientation equals expected orientation");
      expectedFacesOrientation = null;
    } else {
      // console.log("Current orientation does not equal expected orientation")
      // console.log("Current orientation: " + cubeFacesOrientation)
      // console.log("Expected orientation: " + expectedFacesOrientation)
    }
  }
}

function isRotateMove(move: string) {
  return ["x", "y", "z"].some((char) => move.includes(char));
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

async function handleMoveEvent(event: GanCubeEvent) {
  log("handleMoveEvent");

  if (event.type == "MOVE") {
    log(event.move);
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

async function checkMove(move: string) {
  if (currentAlg == null) return;

  if (currentMoveIndex == 0 && timerState != "RUNNING")
    setTimerState("RUNNING");

  let currentAlgMoves = currentAlg.split(" ");
  let currentAlgMove = currentAlgMoves[currentMoveIndex];

  move = await convertOrientationMove(move);

  if (isWideMove(currentAlgMove)) {
    console.log("isWideMove");
    let wideMove = handleWideMove(currentAlgMove);

    if (wideMove) {
      log("wideMove: " + wideMove);
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
      populateSolutions(
        `(${solutions.length + 1}) WRONG! [${currentAlgMoves
          .slice(0, currentMoveIndex + 1)
          .join(" ")}] + ${move}`
      );
      resetStates();
      updateAlgDisplay();
      updateWrongAlgDisplay(move);
      return;
    }

    if (isAwaitingSliceMove) {
      console.log("isAwaitingSliceMove");
      isAwaitingSliceMove = false;
      let sliceMove = handleSliceMove();
      if (sliceMove != null) {
        log("sliceMove: " + sliceMove);
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
    populateSolutions(
      `(${solutions.length + 1}) WRONG! [${currentAlgMoves
        .slice(0, currentMoveIndex + 1)
        .join(" ")}] + ${move}`
    );
    resetStates();
    $("#alg-display-wrong").show();
    $("#alg-display-wrong").html(move);
    console.log(currentAlgMoves);
    console.log(currentMoveIndex);
    console.log(currentAlgMoves.slice(0, currentMoveIndex + 1));
  } else if (currentMoveIndex == currentAlgMoves.length - 1) {
    console.log("FINISHED SUCCESSFULLY");
    resetStates();
    populateSolutions(
      `(${solutions.length + 1}) CORRECT! ${$("#timer").html()}`
    );
  } else {
    currentMoveIndex = currentMoveIndex + 1;
    twistyPlayer.experimentalAddMove(move, { cancel: false });
    updateWrongAlgDisplay(null);
  }

  updateAlgDisplay();
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

function updateWrongAlgDisplay(move: string | null) {
  if (move != null) {
    $("#alg-display-wrong").show();
    $("#alg-display-wrong").html(move);
  } else {
    $("#alg-display-wrong").hide();
    $("#alg-display-wrong").html("");
  }
}

function resetStates() {
  lastMoves = [];
  twistyPlayer.alg = new Alg(currentAlg).invert();
  setTimerState("STOPPED");
  currentMoveIndex = 0;
  isAwaitingDoubleMove = false;
  isAwaitingSliceMove = false;
  expectedFacesOrientation = null;
}

function isDoubleMove(move: string) {
  return [
    "R2",
    "R2'",
    "L2",
    "L2'",
    "U2",
    "U2'",
    "D2",
    "D2'",
    "B2",
    "B2'",
    "F2",
    "F2'",
    "M2",
    "M2'",
    "E2",
    "E2'",
    "S2",
    "S2'",
    "r2",
    "r2'",
    "l2",
    "l2'",
    "u2",
    "u2'",
    "d2",
    "d2'",
    "b2",
    "b2'",
    "f2",
    "f2'",
  ].includes(move);
}

function isSliceMove(move: string) {
  return ["M", "E", "S"].some((char) => move.includes(char));
}

function isWideMove(move: string) {
  return ["f", "b", "r", "l", "u", "d"].some((char) => move.includes(char));
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

  // ["F", "B", "R", "L", "U", "D"]
  //   0    1    2    3    4    5
  // ["F", "B", "R", "L", "U", "D"] -> original
  // ["U", "D", "R", "L", "B", "F"] -> M'
  // ["D", "U", "R", "L", "U", "D"] -> M
  // ["R", "L", "B", "F", "U", "D"] -> E
  // ["L", "R", "F", "B", "U", "D"] -> E'
  // ["F", "B", "D", "U", "R", "L"] -> S
  // ["F", "B", "U", "F", "L", "R"] -> S'
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

// function updateExpectedCubeOrientation(move: string) {
//   if (expectedFacesOrientation != null) {
//     if (cubeFacesOrientation.toString() == expectedFacesOrientation.toString()) {
//       console.log("expected alreay equals current cube face orientation")
//       return
//     }
//   }
//   let currentFacesOrientation =
//     expectedFacesOrientation != null
//       ? [...expectedFacesOrientation]
//       : [...cubeFacesOrientation];

//   let colors = ["green", "blue", "red", "orange", "white", "yellow"]
//   let faces = ["F", "B", "R", "L", "U", "D"]

//   let orientation2 = []
//   for (let face of faces) {
//     orientation2.push(colors[currentFacesOrientation.indexOf(face)])
//   }

//   let result: string[] | null = [...orientation2];

//   // ["F", "B", "R", "L", "U", "D"]
//   //   0    1    2    3    4    5
//   // ["F", "B", "R", "L", "U", "D"] -> original
//   // ["U", "D", "R", "L", "B", "F"] -> M'
//   // ["D", "U", "R", "L", "U", "D"] -> M
//   // ["R", "L", "B", "F", "U", "D"] -> E
//   // ["L", "R", "F", "B", "U", "D"] -> E'
//   // ["F", "B", "D", "U", "R", "L"] -> S
//   // ["F", "B", "U", "F", "L", "R"] -> S'
//   if (move == "M" || move == "r'" || move == "l'" || move == "x'") {
//     result[0] = orientation2[4]; // F -> U
//     result[1] = orientation2[5]; // B -> D
//     result[4] = orientation2[1]; // U -> B
//     result[5] = orientation2[0]; // D -> F
//   } else if (move == "M'" || move == "r" || move == "l" || move ==  "x") {
//     result[0] = orientation2[5]; // F -> D
//     result[1] = orientation2[4]; // B -> U
//     result[4] = orientation2[0]; // U -> F
//     result[5] = orientation2[1]; // D -> B
//   } else if (move == "E" || move == "d'" || move == "u" || move == "y'") {
//     result[0] = orientation2[3]; // F -> L
//     result[1] = orientation2[2]; // B -> R
//     result[2] = orientation2[0]; // R -> F
//     result[3] = orientation2[1]; // D -> B
//   } else if (move == "E'" || move == "d" || move == "u'" || move == "y") {
//     result[0] = orientation2[2]; // F -> R
//     result[1] = orientation2[3]; // B -> L
//     result[2] = orientation2[1]; // R -> B
//     result[3] = orientation2[0]; // L -> F
//   } else if (move == "S" || move == "f'" || move == "b" || move == "z") {
//     result[2] = orientation2[4]; // R -> U
//     result[3] = orientation2[5]; // L -> D
//     result[4] = orientation2[3]; // U -> L
//     result[5] = orientation2[2]; // D -> R
//   } else if (move == "S'" || move == "f" || move == "b'" || move == "z'") {
//     result[2] = orientation2[5]; // R -> D
//     result[3] = orientation2[4]; // L -> U
//     result[4] = orientation2[2]; // U -> R
//     result[5] = orientation2[3]; // D -> L
//   } else result = null;

//   console.log(`updateExpectedCubeOrientation. SliceMove: ${move}`);
//   console.log(`prientation2`);
//   console.log(orientation2)
//   console.log("cubeFacesOrientation:");
//   console.log(cubeFacesOrientation);
//   console.log("expectedFacesOrientation:");
//   console.log(expectedFacesOrientation);
//   console.log("currentFacesOrientation:");
//   console.log(currentFacesOrientation);
//   console.log("result: ");
//   console.log(result);

//   if (result != null) {
//     let newCubeOrientation = []

//     for (let color of colors) {
//       newCubeOrientation.push(faces[result.indexOf(color)])
//     }

//     expectedFacesOrientation = [...newCubeOrientation]
//     console.log("newCubeOrientation: ");
//     console.log(newCubeOrientation);
//   }
//   else return null
// }

function updateExpectedCubeOrientation(move: string) {
  let result = getOrientationBasedOnMove(cubeFacesOrientation, move);

  if (result) expectedFacesOrientation = [...result];
  else expectedFacesOrientation = null;
}

function handleDoubleMove(doubleMove: string): string | null {
  let currentSingleMove = lastMoves[lastMoves.length - 1].move;
  let lastSingleMove = lastMoves[lastMoves.length - 2].move;
  log(`doubleMove (current in alg): ${doubleMove}`);
  log(`CurrentSingleMove: ${currentSingleMove}`);
  log(`lastSingleMove: ${lastSingleMove}`);

  let recognizedDoubleMove: string | null = null;

  if (currentSingleMove == lastSingleMove) {
    recognizedDoubleMove = currentSingleMove[0] + "2";

    if (currentSingleMove.includes("'")) recognizedDoubleMove += "'";
  }

  log(
    `recognizedDoubleMove (before adjusting CW or CCW): ${recognizedDoubleMove}`
  );
  if (recognizedDoubleMove?.replace("'", "") == doubleMove.replace("'", ""))
    recognizedDoubleMove = doubleMove;

  log(
    `recognizedDoubleMove (after adjusting CW or CCW): ${recognizedDoubleMove}`
  );
  return recognizedDoubleMove;
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

  // updateCubeFaceOrientation(cubeQuaternion);

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

var cubeStateInitialized = false;

async function handleFaceletsEvent(event: GanCubeEvent) {
  if (event.type == "FACELETS" && !cubeStateInitialized) {
    log("handleFaceletsEvent");
    log(event.facelets);
    if (event.facelets != SOLVED_STATE) {
      var kpattern = faceletsToPattern(event.facelets);
      var solution = await experimentalSolve3x3x3IgnoringCenters(kpattern);
      var scramble = solution.invert();
      twistyPlayer.alg = scramble;
    } else {
      twistyPlayer.alg = "";
    }
    cubeStateInitialized = true;
    console.log("Initial cube state is applied successfully", event.facelets);
  }
}

function handleCubeEvent(event: GanCubeEvent) {
  // console.log("GanCubeEvent", event);
  if (event.type == "GYRO") {
    numGyroEvents += 1;
    handleGyroEvent(event);
  } else if (event.type == "MOVE") {
    handleMoveEvent(event);
  } else if (event.type == "FACELETS") {
    handleFaceletsEvent(event);
  } else if (event.type == "BATTERY") {
    $("#batteryLevel").val(event.batteryLevel + "%");
  } else if (event.type == "DISCONNECT") {
    twistyPlayer.alg = "";
    $(".info input").val("- n/a -");
    $("#connect").html("Connect");
  }
}

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

$("#reset-state").on("click", async () => {
  await conn?.sendCubeCommand({ type: "REQUEST_RESET" });
  twistyPlayer.alg = "";
});

$("#reset-gyro").on("click", async () => {
  basis = null;
});

$("#connect").on("click", async () => {
  if (conn) {
    conn.disconnect();
    conn = null;
  } else {
    conn = await connectGanCube(customMacAddressProvider);
    conn.events$.subscribe(handleCubeEvent);
    await conn.sendCubeCommand({ type: "REQUEST_HARDWARE" });
    await conn.sendCubeCommand({ type: "REQUEST_BATTERY" });
    await conn.sendCubeCommand({ type: "REQUEST_FACELETS" });
    $("#connect").html("Disconnect");
  }
});

var timerState: "IDLE" | "READY" | "RUNNING" | "STOPPED" = "IDLE";

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

twistyPlayer.experimentalModel.currentPattern.addFreshListener(
  async (kpattern: any) => {
    log(`kpattern:`);
    console.log(kpattern);
    var facelets = patternToFacelets(kpattern);
    if (facelets == SOLVED_STATE) {
      if (timerState == "RUNNING") {
        setTimerState("STOPPED");
      }
      twistyPlayer.alg = "";
    }
  }
);

function setTimerValue(timestamp: number) {
  let t = makeTimeFromTimestamp(timestamp);
  $("#timer").html(
    `${t.minutes}:${t.seconds.toString(10).padStart(2, "0")}.${t.milliseconds
      .toString(10)
      .padStart(3, "0")}`
  );
}

var localTimer: Subscription | null = null;
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

$("#cube").on("touchstart", () => {
  activateTimer();
});

// Function to dynamically populate the dropdown menu
function populateDropdown(id: string, items: any[]) {
  const dropdownContent = document.getElementById(id);
  dropdownContent!!.innerHTML = ""; // Clear previous content

  items.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = item.name;
    div.dataset.id = item.name; // Store item ID for reference
    div.className = "dropdown-item"

    // Add a click event listener to each dropdown item
    div.addEventListener("click", () => handleItemClick(item.name, item.alg));

    dropdownContent!!.appendChild(div);
  });
}

let solutions: string[] = [];

function populateSolutions(solution: string) {
  console.log(solutions);
  solutions.unshift(solution);
  console.log(solutions);

  const solutionsContent = document.getElementById("alg-solutions");
  solutionsContent!!.innerHTML = ""; // Clear previous content

  solutions.forEach((item, index) => {
    const div = document.createElement("div");
    div.textContent = item;
    div.dataset.id = index.toString();

    // div.addEventListener('click', () => handleItemClick(item.name, item.alg));

    solutionsContent!!.appendChild(div);
  });
}

function handleItemClick(name: any, alg: string | null) {
  currentAlg = alg;
  $("#alg-display").html(alg);
  $("#alg-display").show();
  $("#alg-name").html(name);
  solutions = [];
  resetStates();
  updateAlgDisplay();
}

function updateAlgDisplay() {
  const element = document.getElementById("alg-display")!!;
  const text = element.textContent!!;
  const letters = text.split(" "); // Split text into individual characters

  element.innerHTML = ""; // Clear original content

  letters.forEach((letter, index) => {
    const span = document.createElement("span");

    if (index == currentMoveIndex) span.className = "currentMove";
    else if (index < currentMoveIndex) span.className = "correctMove";
    else if (index > currentMoveIndex) span.className = "futureMove";
    span.textContent = letter + " ";
    element.appendChild(span);
  });
}

// Populate the dropdown when the page loads
populateDropdown("dropdown-content-OLL", oll_algs);

populateDropdown("dropdown-content-PLL", pll_algs);

function log(message: any) {
  console.log(message);
  // let msg = message.replace("\n", "</br>")
  // let old = $("#logs").html()
  // let currentdate = new Date();
  // let datetime = "["
  //               + currentdate.getDate() + "/"
  //               + (currentdate.getMonth()+1)  + "/"
  //               + currentdate.getFullYear() + " @ "
  //               + currentdate.getHours() + ":"
  //               + currentdate.getMinutes() + ":"
  //               + currentdate.getSeconds()
  //               + "]";
  // $("#logs").html(datetime + msg + "</br>" + old)
}

// green      blue       red   orange   white   yellow                 frente           tras      direita     esquerda        cima         baixo
//[  'L',      'R',     'B',    'F',     'D',     'U']             ->      ["orange",     "red",    "blue",    "green",      "yellow",     "white"]

let colors = ["green", "blue", "red", "orange", "white", "yellow"];
let faces = ["F", "B", "R", "L", "U", "D"];

let orientation2 = [];
for (let face of faces) {
  orientation2.push(colors[cubeFacesOrientation.indexOf(face)]);
}
//                frente           tras      direita     esquerda        cima         baixo
//orientation2 -> ["orange",     "red",    "blue",    "green",      "yellow",     "white"]
//M            -> ["yellow",     "white",    "blue",    "green",      "red",     "orange"]

//frente           tras      direita     esquerda        cima         baixo     // green      blue       red   orange   white   yellow
//["yellow",     "white",    "blue",    "green",      "red",     "orange"]   -> [  'L',      'R',     'U',       'D',     'B',     'F']

let newCubeOrientation = [];

for (let color of colors) {
  newCubeOrientation.push(faces[orientation2.indexOf(color)]);
}
