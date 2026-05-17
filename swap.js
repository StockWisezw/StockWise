import fs from 'fs';

const code = fs.readFileSync('src/pages/POS.tsx', 'utf8');

const regexLEFT = /\s*\{\/\* LEFT COLUMN:/;
const regexRIGHT = /\s*\{\/\* RIGHT COLUMN:/;
const regexEXTERNAL = /\s*\{\/\* External Modals/;

const leftMatch = regexLEFT.exec(code);
const rightMatch = regexRIGHT.exec(code);
const extMatch = regexEXTERNAL.exec(code);

if (leftMatch && rightMatch && extMatch) {
  const beforeLeft = code.substring(0, leftMatch.index);
  const leftBlock = code.substring(leftMatch.index, rightMatch.index);
  const rightBlock = code.substring(rightMatch.index, extMatch.index);
  const afterRight = code.substring(extMatch.index);

  // Cleanly swap them and fix the comments
  let newLeftBlock = rightBlock.replace('RIGHT COLUMN: Products & Search', 'LEFT COLUMN: Products & Search');
  let newRightBlock = leftBlock.replace('LEFT COLUMN: Cart List, Totals & Payment', 'RIGHT COLUMN: Cart List, Totals & Payment');

  const newCode = beforeLeft + newLeftBlock + newRightBlock + afterRight;

  fs.writeFileSync('src/pages/POS.tsx', newCode);
  console.log("Swapped successfully");
} else {
  console.log("Regex didn't match.");
}
