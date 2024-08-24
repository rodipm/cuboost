// import * as THREE from "three";
// import { TwistyPlayer } from "cubing/twisty";
// import {
//     now,
//     connectGanCube,
//     GanCubeConnection,
//     GanCubeEvent,
//     GanCubeMove,
//     MacAddressProvider,
//     makeTimeFromTimestamp,
//     cubeTimestampLinearFit,
// } from "gan-web-bluetooth";

// const SOLVED_STATE = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
// const HOME_ORIENTATION = new THREE.Quaternion().setFromEuler(
//   new THREE.Euler((0 * Math.PI) / 180, (0 * Math.PI) / 180, 0)
// );
// var cubeQuaternion: THREE.Quaternion = new THREE.Quaternion().setFromEuler(
//   new THREE.Euler((0 * Math.PI) / 180, (0 * Math.PI) / 180, 0)
// );
// var basis: THREE.Quaternion | null;

// var twistyScene: THREE.Scene;
// var twistyVantage: any;

// var conn: GanCubeConnection | null;

// // Android chrome debug crash workaround
// if (import.meta.hot) {
//     import.meta.hot.accept(async () => {
//         if (navigator.bluetooth) {
//         if (conn) {
//             await conn.disconnect();
//             conn = null;
//             console.log("Bluetooth device disconnected before HMR update.");
//         }
//         if (window && window.location) window.location.reload();
//         else if (location && location.reload) location.reload();
//         }
//     });
// }
  
// var twistyPlayer = new TwistyPlayer({
//     puzzle: "3x3x3",
//     visualization: "PG3D",
//     alg: "",
//     experimentalSetupAnchor: "start",
//     background: "none",
//     controlPanel: "none",
//     hintFacelets: "none",
//     experimentalDragInput: "none",
//     cameraLatitude: 0,
//     cameraLongitude: 0,
//     cameraLatitudeLimit: 0,
//     tempoScale: 5,
// });

// $("#twisty-player").append(twistyPlayer);


// let amimateCubeOrientation = async () => {
//     if (!twistyScene || !twistyVantage) {
//         var vantageList = await twistyPlayer.experimentalCurrentVantages();
//         twistyVantage = [...vantageList][0];
//         twistyScene = await twistyVantage.scene.scene();
//     }
//     twistyScene.quaternion.slerp(cubeQuaternion, 0.25);
//     twistyVantage.render();
//     requestAnimationFrame(amimateCubeOrientation);
// }
// requestAnimationFrame(amimateCubeOrientation);

// export {
//     twistyPlayer,
//     amimateCubeOrientation
// }