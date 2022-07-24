import assert from "assert";
import { readFileSync } from "fs";

// dependencies from package.json
const packageJSON = JSON.parse(readFileSync("./package.json", "utf-8"));
const dependencies = Object.keys(packageJSON.dependencies);

// dependencies from index.js
const exportLines = readFileSync("./src/index.js", "utf-8")
  .split("\n")
  .filter((line) => line.trim())
  .filter((line) => !line.startsWith("//"))
  .map((line) => line.match(/lotivis-[^\";]*/g))
  .flat();

// check exports
for (let index = 0; index < exportLines.length; index++) {
  const exportedPackage = exportLines[index];
  const isExported = dependencies.indexOf(exportedPackage) !== -1;

  it("index.js exports:  " + exportedPackage, () => {
    assert.ok(isExported);
  });
}

// check dependencies
for (let index = 0; index < dependencies.length; index++) {
  const dependencyPackage = dependencies[index];
  const isExported = exportLines.indexOf(dependencyPackage) !== -1;

  it("package.json depends on:  " + dependencyPackage, () => {
    assert.ok(isExported);
  });
}
