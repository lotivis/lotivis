const lotivis = require("../dist/lotivis.test");
const fs = require("fs");

let consonants = "bcdfghklmnpqrstvwxyz".split("");
let vocals = "aeiou".split("");

Array.prototype.random = function () {
  return this[Math.ceil(Math.random() * this.length - 1)];
};

function randomNumber(from, till) {
  return till === undefined
    ? randomNumber(0, from)
    : Math.ceil(from + Math.random() * (till - from)) - 1;
}

function range(from, till) {
  return till === undefined
    ? range(0, from || 0)
    : [...Array(till - from).keys()].map((v) => v + from);
}

function randomName(min = 2, max = 6) {
  return range(randomNumber(min, max))
    .map((v) => consonants.random() + vocals.random())
    .join("");
}

function randomNames(count, min = 2, max = 6, prefix) {
  return range(count).map(
    (_) => (prefix ? prefix + "-" : "") + randomName(min, max)
  );
}

function write(name, obj) {
  fs.writeFileSync("./examples/assets/" + name, JSON.stringify(obj, null, 2), {
    encoding: "utf8",
  });
}

let stacks = randomNames(26, 1, 4);
let locations = randomNames(8, 2, 6);
let dates = range(2000, 2022);
let data = [];

stacks.forEach((stack) => {
  let labels = randomNames(randomNumber(16), 1, 4, stack);
  console.log("labels", labels);
  labels.forEach((label) => {
    locations.forEach((location) => {
      // randomly skip
      if (randomNumber(10) < 3) return;
      dates.forEach((date) => {
        // randomly skip
        if (randomNumber(10) > 5) {
          data.push({ stack, label, location, date, value: randomNumber(100) });
        }
      });
    });
  });
});

data = data;

console.log("stacks", stacks);
// console.log("labels", labels);
// console.log("dates", dates);
console.log("locations", locations);
// console.log("data", data);

write("generated.sample.json", data);

let data2 = [];
stacks = randomNames(3, 1, 4);
stacks.forEach((stack) => {
  let labels = randomNames(randomNumber(30), 1, 4, stack);
  console.log("labels", labels);
  labels.forEach((label) => {
    locations.forEach((location) => {
      // randomly skip
      if (randomNumber(10) < 3) return;
      dates.forEach((date) => {
        // randomly skip
        if (randomNumber(10) > 5) {
          data2.push({
            stack,
            label,
            location,
            date,
            value: randomNumber(100),
          });
        }
      });
    });
  });
});

write("gen.2.stack.json", data2);
