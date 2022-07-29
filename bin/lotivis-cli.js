#!/usr/bin/env node

import chalk from "chalk";
import { default as fs, link, unlink } from "fs";
import { execSync } from "child_process";

// ===----------------------------------------------------------------------------
// parse arguments

if (process.argv.length < 3)
  die(`
usage: lotivis-cli <command>

  ${chalk.bold("status")}        Prints the status of all packages
  ${chalk.bold("link-all")}      Runs 'yarn link' in all packages
  ${chalk.bold("link-unlink")}   Runs 'yarn unlink' in all packages
`);

const workingDirectory = process.cwd();
const workingProject = workingDirectory.split("/").pop();

if (!workingProject.startsWith("lotivis"))
  die(`run in (a) lotivis project directory`);

const [, , ...args] = process.argv;
const command = args[0];
const dependencies = getDependecies(workingDirectory);

print("directory:", workingDirectory);
print("project:", workingProject);
print("dependencies:", dependencies);
print("");

// ===----------------------------------------------------------------------------
// functions

function print(...args) {
  console.log("[lotivis] ", ...args);
}

function getDependecies(path) {
  return Object.keys(readJSON(path + "/package.json").dependencies).filter(
    (dep) => dep.startsWith("lotivis-")
  );
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

function die(message) {
  console.info(message), process.exit(0);
}

function isLinked(pkgName) {
  let packageDir = fs
    .readdirSync("node_modules", {
      encoding: "utf8",
      withFileTypes: true,
    })
    .filter((file) => file.name == pkgName)
    .pop();

  return packageDir ? packageDir.isSymbolicLink() : false;
}

// function

function packageStatus(pkgName) {
  let path = packagePath(pkgName);
  let packageJSON = readJSON(path + "/package.json");
  let linkedString = isLinked(pkgName)
    ? chalk.green("is linked")
    : chalk.red("not linked");

  print(
    pkgName,
    isLinked(pkgName)
      ? chalk.bold.green("is linked")
      : chalk.bold.red("not linked")
  );

  // process.chdir(path);
  // let processPath = process.cwd();
  // print("status of", pkgName);
  // console.log("packageJSON", packageJSON);
  // let result = execSync("cd " + path + " && pwd");
  // console.log("result", result);
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

// ===----------------------------------------------------------------------------
// commands

function status() {
  // let packages = getPackages();
  // print("found", packages.length, "packages:", packages.join(", "));
  // print("found", dependencies.length, "dependencies:", dependencies);
  dependencies.forEach(packageStatus);
}

function linkAll() {
  runCommand("yarn link");

  process.chdir("../lotivis");
  let packages = getPackages();
  packages.forEach((dependency) => {
    let result = execSync("yarn link " + dependency, { encoding: "utf-8" });
    console.log(dependency, result);
  });
}

function unlinkAll() {
  runCommand("yarn unlink");

  process.chdir("../lotivis");
  let packages = getPackages();
  packages.forEach((dependency) => {
    let result = execSync("yarn unlink " + dependency, { encoding: "utf-8" });
    console.log(dependency, result);
  });
}

switch (command) {
  case "status":
    status();
    break;
  case "link-all":
    linkAll();
    break;
  case "unlink-all":
    unlinkAll();
    break;
  case "build-all":
    runCommand("yarn build");
  case "run-all":
    let subcommand = args[1];
    if (typeof subcommand !== "string") die("expecting command after");
    runCommand(subcommand);
    break;
  default:
    die('unknown command: "' + command + '"');
}
