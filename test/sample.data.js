import fs from "fs";

/**
 * Reads and return the content of the file with the given name in the samples folder.
 * @param {string} name The name of the file
 * @returns {string} The content of the file
 */
export function read(name) {
    return fs
        .readFileSync("./test/samples/" + name, { encoding: "utf8" })
        .trim();
}

/**
 * Reads and return the content of the file with the given name in the samples folder
 * and parses it to a JSON.
 * @param {string} name The name of the json file
 * @returns {string} The parsed json object
 */
export function readJSON(name) {
    return JSON.parse(read(name) || "");
}
