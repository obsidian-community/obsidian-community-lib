"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = exports.sayGoodbye = exports.sayHello = void 0;
const obsidian_1 = require("obsidian");
function sayHello() {
    console.log("hi");
}
exports.sayHello = sayHello;
function sayGoodbye() {
    console.log("goodbye");
}
exports.sayGoodbye = sayGoodbye;
async function copy(content) {
    await navigator.clipboard.writeText(content).then(() => new obsidian_1.Notice("Copied to clipboard"), () => new obsidian_1.Notice("Could not copy to clipboard"));
}
exports.copy = copy;
