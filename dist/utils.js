"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = exports.getAvailablePathForAttachments = exports.base64ToArrayBuffer = exports.addFeatherIcon = exports.addAllFeatherIcons = exports.wait = void 0;
const feather = require("feather-icons");
const obsidian_1 = require("obsidian");
/**
 * You can await this Function to delay execution
 *
 * @param delay The delay in ms
 */
async function wait(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}
exports.wait = wait;
/**
 * Adds all official Feather Icons to Obsidian.
 * https://feathericons.com/
 *
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 */
function addAllFeatherIcons(attr = { viewBox: "0 0 24 24", width: "100", height: "100" }) {
    Object.values(feather.icons).forEach((i) => {
        const svg = i.toSvg(attr);
        obsidian_1.addIcon("feather-" + i.name, svg);
    });
}
exports.addAllFeatherIcons = addAllFeatherIcons;
/**
 * Adds a specific Feather Icon to Obsidian.
 *
 * @param name official Name of the Icon (https://feathericons.com/)
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 */
function addFeatherIcon(name, attr = { viewBox: "0 0 24 24", width: "100", height: "100" }) {
    if (feather.icons[name]) {
        obsidian_1.addIcon(`feather-${name}`, feather.icons[name].toSvg(attr));
    }
    else {
        throw Error(`This Icon (${name}) doesn't exist in the Feather Library.`);
    }
}
exports.addFeatherIcon = addFeatherIcon;
/**
 * Convert a base64 String to an ArrayBuffer.
 * You can then use the ArrayBuffer to save the asset to disk.
 *
 * @param base64 base64 string to be converted.
 * @returns ArrayBuffer
 */
function base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
exports.base64ToArrayBuffer = base64ToArrayBuffer;
/**
 * This is a helper method for an undocumented API of Obsidian.
 *
 * @param vault You can get this via `this.app.vault`
 * @param fileName The Filename for your Attachment
 * @param format The Fileformat of your Attachment
 * @param sourceFile The Sourcefile from where the Attachment gets added, this is needed because the Attachment Folder might be different based on where it gets inserted.
 * @returns The Attachment Path
 */
function getAvailablePathForAttachments(vault, fileName, format, sourceFile) {
    //@ts-expect-error
    return vault.getAvailablePathForAttachments(fileName, format, sourceFile);
}
exports.getAvailablePathForAttachments = getAvailablePathForAttachments;
/**
 * Copy Text to the Users Clipboard.
 *
 * @param content The contend to be copied to clipboard.
 */
async function copy(content) {
    await navigator.clipboard.writeText(content).then(() => new obsidian_1.Notice("Copied to clipboard"), () => new obsidian_1.Notice("Could not copy to clipboard"));
}
exports.copy = copy;
