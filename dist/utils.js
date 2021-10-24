"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openOrSwitch = exports.hoverPreview = exports.isInVault = exports.getSelectionFromCurrFile = exports.getSelectionFromEditor = exports.copy = exports.getAvailablePathForAttachments = exports.base64ToArrayBuffer = exports.addFeatherIcon = exports.addAllFeatherIcons = exports.wait = void 0;
const feather = require("feather-icons");
const obsidian_1 = require("obsidian");
/**
 * You can await this Function to delay execution
 *
 * @param delay The delay in ms
 */
async function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
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
        (0, obsidian_1.addIcon)("feather-" + i.name, svg);
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
        (0, obsidian_1.addIcon)(`feather-${name}`, feather.icons[name].toSvg(attr));
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
 * Copy `content` to the users clipboard.
 *
 * @param {string} content The content to be copied to clipboard.
 * @param {() => any} success The callback to run when text is successfully copied. Default throws a new `Notice`
 * @param {(reason?) => any} failure The callback to run when text was not able to be copied. Default throws a new `Notice`, and console logs the error.`
 */
async function copy(content, success = () => new obsidian_1.Notice("Copied to clipboard"), failure = (reason) => {
    new obsidian_1.Notice("Could not copy to clipboard");
    console.log({ reason });
}) {
    await navigator.clipboard.writeText(content).then(success, failure);
}
exports.copy = copy;
/**
 * Given an editor, check if something is selected and return that selection, otherwise return the entire content of the editor
 * @param  {Editor} editor
 */
function getSelectionFromEditor(editor) {
    if (editor.somethingSelected()) {
        return editor.getSelection();
    }
    else {
        return editor.getValue();
    }
}
exports.getSelectionFromEditor = getSelectionFromEditor;
/**
 * Check if something is selected in the current file and return that selection, otherwise return the entire content of the current file.
 * @param  {App} app
 * @param  {boolean} [cached=true] Use `cachedRead` or `read`. `cachedRead` by default.
 */
async function getSelectionFromCurrFile(app, cached = true) {
    const text = window?.getSelection()?.toString();
    if (text) {
        return text;
    }
    else {
        const currFile = app.workspace.getActiveFile();
        if (currFile instanceof obsidian_1.TFile) {
            if (cached) {
                return await app.vault.cachedRead(currFile);
            }
            else {
                return await app.vault.read(currFile);
            }
        }
        else {
            new obsidian_1.Notice("You must be focused on a markdown file.");
        }
    }
}
exports.getSelectionFromCurrFile = getSelectionFromCurrFile;
/**
 * Check if `noteName` is the name of a note that exists in the vault.
 * @param  {App} app
 * @param  {string} noteName Basename of the note to search for.
 * @param  {string} [sourcePath=""] Optional file path to start searching from. Default is the current file.
 * @returns boolean
 */
const isInVault = (app, noteName, sourcePath = "") => !!app.metadataCache.getFirstLinkpathDest(noteName, sourcePath);
exports.isInVault = isInVault;
/**
 * @param  {MouseEvent} event
 * @param  {TView} view The view being hovered
 * @param  {string} to The basename of the note to preview
 * @returns void
 */
function hoverPreview(event, view, to) {
    const targetEl = event.target;
    view.app.workspace.trigger("hover-link", {
        event,
        source: view.getViewType(),
        hoverParent: view,
        targetEl,
        linktext: to,
    });
}
exports.hoverPreview = hoverPreview;
/**
 * When clicking a link, check if that note is already open in another leaf, and switch to that leaf, if so. Otherwise, open the note in a new pane
 * @param  {App} app
 * @param  {string} dest Basename of note to open to open
 * @param  {MouseEvent} event
 * @param  {{createNewFile:boolean}} [options={createNewFile:true}]
 * @returns Promise
 */
async function openOrSwitch(app, dest, event, options = { createNewFile: true }) {
    const { workspace } = app;
    const currFile = workspace.getActiveFile();
    let destFile = app.metadataCache.getFirstLinkpathDest(dest, currFile.path);
    // If dest doesn't exist, make it
    if (!destFile) {
        if (!options.createNewFile)
            return;
        const newFileFolder = app.fileManager.getNewFileParent(currFile.path).path;
        const newFilePath = (0, obsidian_1.normalizePath)(`${newFileFolder}${newFileFolder === "/" ? "" : "/"}${dest}.md`);
        await app.vault.create(newFilePath, "");
        destFile = app.metadataCache.getFirstLinkpathDest(newFilePath, currFile.path);
    }
    // Check if it's already open
    const leavesWithDestAlreadyOpen = [];
    // For all open leaves, if the leave's basename is equal to the link destination, rather activate that leaf instead of opening it in two panes
    workspace.iterateAllLeaves((leaf) => {
        if (leaf.view instanceof obsidian_1.MarkdownView) {
            if (leaf.view?.file?.basename === dest) {
                leavesWithDestAlreadyOpen.push(leaf);
            }
        }
    });
    // Rather switch to it if it is open
    if (leavesWithDestAlreadyOpen.length > 0) {
        workspace.setActiveLeaf(leavesWithDestAlreadyOpen[0]);
    }
    else {
        const mode = app.vault.getConfig("defaultViewMode");
        const leaf = event.ctrlKey || event.getModifierState("Meta")
            ? workspace.splitActiveLeaf()
            : workspace.getUnpinnedLeaf();
        await leaf.openFile(destFile, { active: true, mode });
    }
}
exports.openOrSwitch = openOrSwitch;
