
import { cube3x3x3 } from 'cubing/puzzles';
import { KPattern, KPatternData, KPuzzle } from 'cubing/kpuzzle';

var KPUZZLE_333: KPuzzle;
cube3x3x3.kpuzzle().then(v => KPUZZLE_333 = v);

const REID_EDGE_ORDER = "UF UR UB UL DF DR DB DL FR FL BR BL".split(" ");
const REID_CORNER_ORDER = "UFR URB UBL ULF DRF DFL DLB DBR".split(" ");
const REID_CENTER_ORDER = "U L F R B D".split(" ");

const REID_TO_FACELETS_MAP: [number, number, number][] = [
  [1, 2, 0],
  [0, 2, 0],
  [1, 1, 0],
  [0, 3, 0],
  [2, 0, 0],
  [0, 1, 0],
  [1, 3, 0],
  [0, 0, 0],
  [1, 0, 0],
  [1, 0, 2],
  [0, 1, 1],
  [1, 1, 1],
  [0, 8, 1],
  [2, 3, 0],
  [0, 10, 1],
  [1, 4, 1],
  [0, 5, 1],
  [1, 7, 2],
  [1, 3, 2],
  [0, 0, 1],
  [1, 0, 1],
  [0, 9, 0],
  [2, 2, 0],
  [0, 8, 0],
  [1, 5, 1],
  [0, 4, 1],
  [1, 4, 2],
  [1, 5, 0],
  [0, 4, 0],
  [1, 4, 0],
  [0, 7, 0],
  [2, 5, 0],
  [0, 5, 0],
  [1, 6, 0],
  [0, 6, 0],
  [1, 7, 0],
  [1, 2, 2],
  [0, 3, 1],
  [1, 3, 1],
  [0, 11, 1],
  [2, 1, 0],
  [0, 9, 1],
  [1, 6, 1],
  [0, 7, 1],
  [1, 5, 2],
  [1, 1, 2],
  [0, 2, 1],
  [1, 2, 1],
  [0, 10, 0],
  [2, 4, 0],
  [0, 11, 0],
  [1, 7, 1],
  [0, 6, 1],
  [1, 6, 2],
];

const CORNER_MAPPING = [
  [0, 21, 15],
  [5, 13, 47],
  [7, 45, 39],
  [2, 37, 23],
  [29, 10, 16],
  [31, 18, 32],
  [26, 34, 40],
  [24, 42, 8],
];

const EDGE_MAPPING = [
  [1, 22],
  [3, 14],
  [6, 46],
  [4, 38],
  [30, 17],
  [27, 9],
  [25, 41],
  [28, 33],
  [19, 12],
  [20, 35],
  [44, 11],
  [43, 36],
];

const FACE_ORDER = "URFDLB";

interface PieceInfo {
  piece: number;
  orientation: number;
};

const PIECE_MAP: { [s: string]: PieceInfo } = {};

REID_EDGE_ORDER.forEach((edge, idx) => {
  for (let i = 0; i < 2; i++) {
    PIECE_MAP[rotateLeft(edge, i)] = { piece: idx, orientation: i };
  }
});

REID_CORNER_ORDER.forEach((corner, idx) => {
  for (let i = 0; i < 3; i++) {
    PIECE_MAP[rotateLeft(corner, i)] = { piece: idx, orientation: i };
  }
});

function rotateLeft(s: string, i: number): string {
  return s.slice(i) + s.slice(0, i);
}

function toReid333Struct(pattern: KPattern): string[][] {
  const output: string[][] = [[], []];
  for (let i = 0; i < 6; i++) {
    if (pattern.patternData["CENTERS"].pieces[i] !== i) {
      throw new Error("non-oriented puzzles are not supported");
    }
  }
  for (let i = 0; i < 12; i++) {
    output[0].push(
      rotateLeft(
        REID_EDGE_ORDER[pattern.patternData["EDGES"].pieces[i]],
        pattern.patternData["EDGES"].orientation[i],
      ),
    );
  }
  for (let i = 0; i < 8; i++) {
    output[1].push(
      rotateLeft(
        REID_CORNER_ORDER[pattern.patternData["CORNERS"].pieces[i]],
        pattern.patternData["CORNERS"].orientation[i],
      ),
    );
  }
  output.push(REID_CENTER_ORDER);
  return output;
}

/**
 * Convert cubing.js KPattern object to the facelets string in the Kociemba notation
 * @param pattern Source KPattern object
 * @returns String representing cube faceletsin the Kociemba notation
 */
function patternToFacelets(pattern: KPattern): string {
  const reid = toReid333Struct(pattern);
  return REID_TO_FACELETS_MAP.map(([orbit, perm, ori]) => reid[orbit][perm][ori]).join("");
}

/**
 * Convert facelets string in the Kociemba notation to the cubing.js KPattern object
 * @param facelets Source string with facelets in the Kociemba notation
 * @returns KPattern object representing cube state
 */
function faceletsToPattern(facelets: string): KPattern {

  const stickers: number[] = [];
  facelets.match(/.{9}/g)?.forEach(face => {
    face.split('').reverse().forEach((s, i) => {
      if (i != 4)
        stickers.push(FACE_ORDER.indexOf(s));
    });
  });

  const patternData: KPatternData = {
    CORNERS: {
      pieces: [],
      orientation: [],
    },
    EDGES: {
      pieces: [],
      orientation: [],
    },
    CENTERS: {
      pieces: [0, 1, 2, 3, 4, 5],
      orientation: [0, 0, 0, 0, 0, 0],
      orientationMod: [1, 1, 1, 1, 1, 1]
    },
  };

  for (const cm of CORNER_MAPPING) {
    const pi: PieceInfo = PIECE_MAP[cm.map((i) => FACE_ORDER[stickers[i]]).join('')];
    patternData.CORNERS.pieces.push(pi.piece);
    patternData.CORNERS.orientation.push(pi.orientation);
  }

  for (const em of EDGE_MAPPING) {
    const pi: PieceInfo = PIECE_MAP[em.map((i) => FACE_ORDER[stickers[i]]).join('')];
    patternData.EDGES.pieces.push(pi.piece);
    patternData.EDGES.orientation.push(pi.orientation);
  }

  return new KPattern(KPUZZLE_333, patternData);

}

function isRotateMove(move: string) {
  return ["x", "y", "z"].some((char) => move.includes(char));
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


let oll_algs = [
  { name: 'SLICE-TESTER', alg: "U S U S'"},
  { name: 'ROTATE-TESTER', alg: "x y z x' y' z'"},
  { name: 'ROTATE-TESTER2', alg: "U x U R y R"},
  { name: 'WIDE-TESTER', alg: "r U r F"},
  { name: 'sune', alg: "R U R' U R U2' R'" },
  { name: 'anti-sune', alg: "R U2 R' U' R U' R'" },
  { name: 'cross', alg: "y R U R' U R U' R' U R U2' R'" },
  { name: 'bruno', alg: "R U2' R2' U' R2 U' R2' U2' R" },
  { name: 'chameleon', alg: "r U R' U' r' F R F'" },
  { name: 'headlights', alg: "R2 D' R U2 R' D R U2 R" },
  { name: 'bowtie', alg: "r U R' U' r' F R F'" },
  { name: 'T', alg: "F R U R' U' F'" },
  { name: 'key', alg: "R U R' U' R' F R F'" },
  { name: 'righty-square', alg: "r U2 R' U' R U' r'" },
  { name: 'lefty-square', alg: "r' U2' R U R' U r" },
  { name: 'arrow', alg: "r U R' U' M U R U' R'" },
  { name: 'H', alg: "R U R' U' M' U R U' r'" },
  { name: 'lightning', alg: "r U R' U R U2' r'" },
  { name: 'reverse lightning', alg: "r' U' R U' R' U2 r" },
  { name: 'downstairs', alg: "M R U R' U R U2 R' U M'" },
  { name: 'upstairs', alg: "M' R' U' R U' R' U2 R U' M" },
  { name: 'big lightning', alg: "R' F R U R' U' F' U R" },
  { name: 'lefty big lightning', alg: "L F' L' U' L U F U' L'" },
  { name: 'P', alg: "f R U R' U' f'" },
  { name: 'inverse P', alg: "f' L' U' L U f" },
  { name: 'couch', alg: "R' U' F U R U' R' F' R" },
  { name: 'anti-couch', alg: "S R U R' U' R' F R f'" },
  { name: 'seein headlights', alg: "R' U' R' F R F' U R" },
  { name: 'city', alg: "R U R' U' B' R' F R F' B" },
  { name: 'mounted fish', alg: "F R U' R' U' R U R' F'" },
  { name: 'fish salad', alg: "R U2' R' R' F R F' R U2' R'" },
  { name: 'anti-kite', alg: "R U R' U R' F R F' R U2' R'" },
  { name: 'kite', alg: "R U R' U' R' F R2 U R' U' F'" },
  { name: 'breakneck', alg: "F R U R' U' R U R' U' F'" },
  { name: 'anti-breakneck', alg: "F' L' U' L U L' U' L U F" },
  { name: 'frying pan', alg: "r' U' R U' R' U R U' R' U2 r" },
  { name: 'anti-frying pan', alg: "r U R' U R U' R' U R U2' r'" },
  { name: 'front squeezy', alg: "r' U r2 U' r2' U' r2 U r'" },
  { name: 'back squeezy', alg: "r U' r2' U r2 U r2' U' r" },
  { name: 'mario', alg: "R U R' U R U' R' U' R' F R F'" },
  { name: 'wario', alg: "R' U' R U' R' U R U l U' R' U x" },
  { name: 'ant', alg: "f R U R' U' R U R' U' f'" },
  { name: 'rice cooker', alg: "R U R' U R U' y R U' R' F'" },
  { name: 'streetlights', alg: "r U r' U R U' R' U R U' R' r U' r'" },
  { name: 'highway', alg: "R U2 R2 U' R U' R' U2 F R F'" },
  { name: 'squeegee', alg: "r' U' r R' U' R U r' U r" },
  { name: 'anti-squeegee', alg: "r U r' R U R' U' r U' r'" },
  { name: 'gun', alg: "F U R U' R2' F' R U R U' R'" },
  { name: 'anti-gun', alg: "R' F R U R' F' R F U' F'" },
  { name: 'poodle', alg: "R U R' U R U2' R' F R U R' U' F'" },
  { name: 'anti-poodle', alg: "R' U' R U' R' U2 R F R U R' U' F'" },
  { name: 'wtf', alg: "r2 D' r U r' D r2 U' r' U' r" },
  { name: 'anti-wtf', alg: "F U R U2 R' U' R U2 R' U' F'" },
  { name: 'blank', alg: "R U2' R2' F R F' U2' R' F R F'" },
  { name: 'zamboni', alg: "F R U R' U' F' f R U R' U' f'" },
  { name: 'slash', alg: "R U R' U R' F R F' U2' R' F R F'" },
  { name: 'X', alg: "M U R U R' U' M2' U R U' r'" },
  { name: 'bunny', alg: "M U R U R' U' M' R' F R F'" },
  { name: 'crown', alg: "r U R' U R U2 r' r' U' R U' R' U2 r" },
  { name: 'nazi', alg: "f R U R' U' f' U F R U R' U' F'" },
  { name: 'anti-nazi', alg: "f R U R' U' f' U' F R U R' U' F'" },
];

let pll_algs = [
  {name: "Ua", alg: "R' U R' U' R' U' R' U R U R2"},
  {name: "Ub", alg: "R2 U' R' U' R U R U R U' R"},
  {name: "Aa", alg: "x R' U R' D2 R U' R' D2 R2 x'"},
  {name: "Ab", alg: "x R2' D2 R U R' D2 R U' R x'"},
  {name: "H", alg: "M2 U M2 U2 M2 U M2"},
  {name: "Z", alg: "M2 U M2 U M' U2 M2 U2 M'"},
  {name: "T", alg: "R U R' U' R' F R2 U' R' U' R U R' F'"},
  {name: "F", alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"},
  {name: "Y", alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'"},
  {name: "E", alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x"},
  {name: "V", alg: "R' U R' d' R' F' R2 U' R' U R' F R F"},
  {name: "Ra", alg: "R U' R' U' R U R D R' U' R D' R' U2 R' U'"},
  {name: "Rb", alg: "R' U2 R U2 R' F R U R' U' R' F' R2 U'"},
  {name: "Ja", alg: "x R2 F R F' R U2 r' U r U2 x'"},
  {name: "Jb", alg: "R U R' F' R U R' U' R' F R2 U' R' U'"},
  {name: "Na", alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"},
  {name: "Nb", alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R"},
  {name: "Ga", alg: "R2 u R' U R' U' R u' R2 y' R' U R"},
  {name: "Gb", alg: "R' U' R U D' R2 U R' U R U' R U' R2 D U'"},
  {name: "Gc", alg: "R2 U' R U' R U R' U R2 D' U R U' R' D U'"},
  {name: "Gd", alg: "R U R' y' R2 u' R U' R' U R' u R2"},
]

export {
  patternToFacelets,
  faceletsToPattern,
  isRotateMove,
  isDoubleMove,
  isSliceMove,
  isWideMove,
  oll_algs,
  pll_algs
}
