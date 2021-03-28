import {Color} from "./color";

Color.colorsForStack = function (stack, amount = 1) {
  if (!Number.isInteger(stack)) {
    return [Color.stackColors[0]];
  }

  let usedAmount = Math.max(amount, 5);
  let stackColors = Color.stackColors[stack % Color.stackColors.length];

  let highColor = stackColors[0];
  let lowColor = stackColors[1];

  let redDiff = lowColor.r - highColor.r;
  let greenDiff = lowColor.g - highColor.g;
  let blueDiff = lowColor.b - highColor.b;

  let redStep = redDiff / usedAmount;
  let greenStep = greenDiff / usedAmount;
  let blueStep = blueDiff / usedAmount;

  let colors = [];

  for (let i = 0; i < amount; i++) {
    let newColor = highColor.colorAdding(redStep * i, greenStep * i, blueStep * i);
    colors.push(newColor);
  }

  return colors;
};
