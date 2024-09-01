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
  let ans = "";

  // input not a multiple of 6, alpha -> braille
  if (input.length % 6 != 0) {
    alphaFound = true;
  } else {
    //attempt braile -> alpha translate
    let nums = false;
    let caps = false;

    //look 6 chars at a time and see if they are keys in braille
    for (let i = 0; i < input.length; i += 6) {
      //if attempt fails, switch to alpha -> braille
      if (!brailleToAlpha.has(input.substring(i, i + 6))) {
        alphaFound = true;
        break;
      }

      //build ans
      let curr = brailleToAlpha.get(input.substring(i, i + 6));

      //special cases
      switch (curr) {
        case "DECIMAL":
          ans += ".";
          continue;
        case "SPACE":
          nums = false;
          ans += " ";
          continue;
        case "CAPS":
          caps = true;
          continue;
        case "NUMS":
          nums = true;
          continue;
        // consider > for math only
        case ">":
          if (!nums) {
            ans += "o";
            continue;
          }
          break;
      }

      //append ans
      if (nums) {
        ans += curr.charCodeAt(0) - 96;
      } else if (caps) {
        ans += curr.toUpperCase();
        caps = false;
      } else {
        ans += curr;
      }
    }
  }
  //ans is the braille -> alpha version solved above
  alphaFound ? translateAlphaToBraille(input) : console.log(ans);
}

function translateAlphaToBraille(input) {
  let ans = "";
  let nums = false;

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
}

//run the translation
translate(input);
