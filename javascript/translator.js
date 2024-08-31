//input from cmd line
const input = process.argv.slice(2).join(" ");

//braille <-> alpha
let textPairs = {
  "O.....": "a",
  "O.O...": "b",
  "OO....": "c",
  "OO.O..": "d",
  "O..O..": "e",
  "OOO...": "f",
  "OOOO..": "g",
  "O.OO..": "h",
  ".OO...": "i",
  ".OOO..": "j",
  "O...O.": "k",
  "O.O.O.": "l",
  "OO..O.": "m",
  "OO.OO.": "n",
  "O..OO.": "o",
  "OOO.O.": "p",
  "OOOOO.": "q",
  "O.OOO.": "r",
  ".OO.O.": "s",
  ".OOOO.": "t",
  "O...OO": "u",
  "O.O.OO": "v",
  ".OOO.O": "w",
  "OO..OO": "x",
  "OO.OOO": "y",
  "O..OOO": "z",
  "..OO.O": ".",
  "..O...": ",",
  "..O.OO": "?",
  "..OOO.": "!",
  "..OO..": ":",
  "..O.O.": ";",
  "....OO": "-",
  ".O..O.": "/",
  ".O..O.": "<",
  "O..OO.": ">",
  "O.O..O": "(",
  ".O.OO.": ")",
  "......": "SPACE",
  ".....O": "CAPS",
  ".O...O": "DECIMAL",
  ".O.OOO": "NUMS",
};

//regex
const isAlpha = /^[a-zA-Z]+$/;

//as map entries for lookups
const brailleToAlpha = new Map();
const alphaToBraille = new Map();
for (const [k, v] of Object.entries(textPairs)) {
  alphaToBraille.set(v, k);
  brailleToAlpha.set(k, v);
}

//braille <-> alpha
function translate(input) {
  // init
  let alphaFound = false;

  // input not a multiple of 6, alpha -> braille
  if (input.length % 6 != 0) {
    alphaFound = true;
  } else {
    //look 6 chars at a time and see if they are keys in braille
    for (let i = 0; i < input.length - 6; i++) {
      //if not then translate: alpha -> braille
      if (!brailleToAlpha.has(input.substring(i, i + 6))) {
        alphaFound = true;
        break;
      }
      i += 6;
    }
  }

  //call the correct translation version
  alphaFound ? translateAlphaToBraille(input) : translateBrailleToAlpha(input);
}

function translateAlphaToBraille(input) {
  let ans = "";
  let nums = false;
  console.log(input);

  for (let i = 0; i < input.length; i++) {
    let curr = input[i];
    //overwritten key when map inverts (only case)
    if (curr == "o") {
      curr = ">";
    }

    //space
    if (curr == " ") {
      ans += alphaToBraille.get("SPACE");
      nums = false;
      //nums
    } else if (!isNaN(curr)) {
      if (nums == false) {
        nums = true;
        ans += alphaToBraille.get("NUMS");
      }
      ans += alphaToBraille.get(String.fromCharCode(parseInt(curr) + 96));
      //caps
    } else if (curr === curr.toUpperCase() && isAlpha.test(curr)) {
      ans += alphaToBraille.get("CAPS");
      ans += alphaToBraille.get(curr.toLowerCase());
      //rest
    } else {
      ans += alphaToBraille.get(curr);
    }
  }

  console.log(ans);
  // console.log(".O.OOOOO.O..O.O..."); // 42
  // console.log(
  //   ".....OO.OO..O..O..O.O.O.O.O.O.O..OO........OOO.OO..OO.O.OOO.O.O.O.OO.O.."
  // ); //Hello world

  // console.log(`.....OO.....O.O...OO...........O.OOOO.....O.O...OO....`); // Abc 123
  // return ans;
}

function translateBrailleToAlpha(input) {}

translate(input);
// run it
// translate(input);
