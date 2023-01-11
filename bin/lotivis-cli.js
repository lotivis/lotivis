#!/usr/bin/env node

import os from "os";
import chalk from "chalk";
import { default as fs, link, unlink } from "fs";
import { execSync } from "child_process";

const workingDirectory = process.cwd();
const workingProject = workingDirectory.split("/").pop();

if (!workingProject.startsWith("lotivis"))
  die(`run in (a) lotivis project directory`);

// ===----------------------------------------------------------------------------
// parse arguments

if (process.argv.length < 3) {
  die(`
usage: lotivis-cli <command>

  ${chalk.bold("status")}           Prints the status of all packages
  ${chalk.bold("link-all")}         Runs 'yarn link' in all packages
  ${chalk.bold("link-unlink")}      Runs 'yarn unlink' in all packages
  ${chalk.bold("link")} <package>   Links specified package
`);
}

const [, , ...args] = process.argv;
const command = args[0];

// ===----------------------------------------------------------------------------
// functions

function print(...args) {
  console.log("[lotivis] ", ...args);
}

function die(message) {
  console.info(message), process.exit(0);
}

function boolString(value, trueString = "true", falseString = "false") {
  return value ? chalk.bold.green(trueString) : chalk.bold.red(falseString);
}

function getPackages() {
  return fs.readdirSync("../").filter((path) => path.startsWith("lotivis-"));
}

function packagePath(packageName) {
  return "../" + packageName;
}

function readJSON(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function userHomeDir() {
  return os.homedir();
}

function getDependecies(path) {
  return Object.keys(readJSON(path + "/package.json").dependencies);
}

function getLotivisDependecies(path) {
  return getDependecies(path).filter((dep) => dep.startsWith("lotivis-"));
}

function getNotLotivisDependecies(path) {
  return getDependecies(path).filter((dep) => !dep.startsWith("lotivis-"));
}

function isLinked(pkgName) {
  let packageDir = fs
    .readdirSync("node_modules", {
      encoding: "utf8",
      withFileTypes: true,
    })
    .filter((file) => file.name === pkgName)
    .pop();

  return packageDir ? packageDir.isSymbolicLink() : false;
}

function isGloballyLinked(dependency) {
  return fs.existsSync(userHomeDir() + "/.config/yarn/link/" + dependency);
}

// ===----------------------------------------------------------------------------
// commands

function projectStatus() {
  const lotivisDeps = getLotivisDependecies(workingDirectory);
  const notLotivisDeps = getNotLotivisDependecies(workingDirectory);
  print("directory:", workingDirectory);
  print("project:", workingProject);
  print("isGloballyLinked:", boolString(isGloballyLinked(workingProject)));
  print("notLotivisDeps count:", notLotivisDeps.length);
  print("notLotivisDeps:", notLotivisDeps.join(", "));
  print("lotivisDeps count:", lotivisDeps.length);
  print("lotivisDeps:", lotivisDeps.join(", "));

  print("");
  lotivisDeps.forEach(packageStatus);

  print("");
}

function packageStatus(pkgName) {
  print(pkgName);
  print(
    "  globally:",
    boolString(isGloballyLinked(pkgName)),
    "/ project:",
    boolString(isLinked(pkgName))
  );
}

function runCommand(command) {
  getPackages().forEach((pkg) => {
    if (!fs.existsSync("../" + pkg + "/.git")) return;
    print("running command '" + command + "' in ../" + pkg);
    process.chdir("../" + pkg);
    let result = execSync(command.trim(), { encoding: "utf-8" }).toString();
    console.log(result, "\n\n");
  });
}

function linkAll() {
  getPackages().forEach(linkDependency);
}

function unlinkAll() {
  getPackages().forEach(unlinkDependency);
}

function linkDependency(dependency) {
  print("linking", dependency);
  let dependencyProjectPath = "../" + dependency;

  if (!isGloballyLinked(dependency)) {
    process.chdir(dependencyProjectPath);
    let result = execSync("yarn link", { encoding: "utf-8" });
    console.log(dependency, result);
    process.chdir(workingDirectory);
  } else {
    print(dependency, "already globally linked");
  }

  if (!isLinked(dependency)) {
    let result = execSync("yarn link " + dependency, { encoding: "utf-8" });
    console.log(dependency, result);
  } else {
    print(dependency, "already linked");
  }
}

function unlinkDependency(dependency) {
  print("unlinking", dependency, process.cwd(), isLinked(dependency));
  let dependencyProjectPath = "../" + dependency;

  if (isLinked(dependency)) {
    let result = execSync("yarn unlink " + dependency, { encoding: "utf-8" });
    console.log(dependency, result);
  } else {
    print(dependency, "already unlinked");
  }

  if (isGloballyLinked(dependency)) {
    process.chdir(dependencyProjectPath);
    let result = execSync("yarn unlink", { encoding: "utf-8" });
    console.log(dependency, result);
    process.chdir(workingDirectory);
  } else {
    print(dependency, "already globally unlinked");
  }
}

switch (command) {
  case "status":
    projectStatus();
    break;
  case "link-all":
    linkAll();
    break;
  case "unlink-all":
    unlinkAll();
    break;
  case "build-all":
    runCommand("yarn build");
    break;
  case "run-all":
    let subcommand = args[1];
    if (typeof subcommand !== "string") die("expecting command after");
    runCommand(subcommand);
    break;
  case "link":
    let dependency = args[1];
    if (typeof dependency !== "string") die("expecting package name");
    linkDependency(dependency);
    break;
  case "unlink":
    let dependencyToUnlink = args[1];
    if (typeof dependencyToUnlink !== "string") die("expecting package name");
    unlinkDependency(dependencyToUnlink);
    break;
  default:
    die('unknown command: "' + command + '"');
}
