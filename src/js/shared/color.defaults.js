import {Color} from "./color";

Color.defaultTint = new Color(0, 122, 255);
Color.organgeLow = new Color(250, 211, 144);
Color.organgeHigh = new Color(229, 142, 38);
Color.redLow = new Color(248, 194, 145);
Color.redHigh = new Color(183, 21, 64);
Color.blueLow = new Color(106, 137, 204);
Color.blueHigh = new Color(12, 36, 97);
Color.lightBlueLow = new Color(130, 204, 221);
Color.lightBlueHight = new Color(10, 61, 98);
Color.greenLow = new Color(184, 233, 148);
Color.greenHight = new Color(7, 153, 146);
Color.stackColors = [
  [Color.blueHigh, Color.blueLow],
  [Color.redHigh, Color.redLow],
  [Color.greenHight, Color.greenLow],
  [Color.organgeHigh, Color.organgeLow],
  [Color.lightBlueHight, Color.lightBlueLow],
];
