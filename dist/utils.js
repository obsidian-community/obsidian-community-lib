/**
 * This module contains various utility functions commonly used in Obsidian plugins.
 * @module obsidian-community-lib
 */
import * as feather from "feather-icons";
import { addIcon, MarkdownRenderer, MarkdownView, Modal, normalizePath, Notice, request, TFile, } from "obsidian";
/**
 * You can await this Function to delay execution
 *
 * @param delay The delay in ms
 */
export async function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}
/**
 * Adds all official Feather Icons to Obsidian.
 * https://feathericons.com/
 *
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 */
export function addAllFeatherIcons(attr = { viewBox: "0 0 24 24", width: "100", height: "100" }) {
    Object.values(feather.icons).forEach((i) => {
        const svg = i.toSvg(attr);
        addIcon(`feather-${i.name}`, svg);
    });
}
/**
 * Adds a specific Feather Icon to Obsidian.
 *
 * @param name official Name of the Icon (https://feathericons.com/)
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 * @returns {string} Icon name
 */
export function addFeatherIcon(name, attr = { viewBox: "0 0 24 24", width: "100", height: "100" }) {
    if (feather.icons[name]) {
        const iconName = `feather-${name}`;
        addIcon(iconName, feather.icons[name].toSvg(attr));
        return iconName;
    }
    else {
        throw Error(`This Icon (${name}) doesn't exist in the Feather Library.`);
    }
}
/**
 * Convert a base64 String to an ArrayBuffer.
 * You can then use the ArrayBuffer to save the asset to disk.
 *
 * @param base64 base64 string to be converted.
 * @returns ArrayBuffer
 */
export function base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
/**
 * This is a helper method for an undocumented API of Obsidian.
 *
 * @param vault You can get this via `this.app.vault`
 * @param fileName The Filename for your Attachment
 * @param format The Fileformat of your Attachment
 * @param sourceFile The Sourcefile from where the Attachment gets added, this is needed because the Attachment Folder might be different based on where it gets inserted.
 * @returns The Attachment Path
 */
export function getAvailablePathForAttachments(vault, fileName, format, sourceFile) {
    //@ts-expect-error
    return vault.getAvailablePathForAttachments(fileName, format, sourceFile);
}
/**
 * Copy `content` to the users clipboard.
 *
 * @param {string} content The content to be copied to clipboard.
 * @param {() => any} success The callback to run when text is successfully copied. Default throws a new `Notice`
 * @param {(reason?) => any} failure The callback to run when text was not able to be copied. Default throws a new `Notice`, and console logs the error.`
 */
export async function copy(content, success = () => new Notice("Copied to clipboard"), failure = (reason) => {
    new Notice("Could not copy to clipboard");
    console.log({ reason });
}) {
    await navigator.clipboard.writeText(content).then(success, failure);
}
/**
 * Given an editor, check if something is selected and return that selection, otherwise return the entire content of the editor
 * @param  {Editor} editor
 */
export function getSelectionFromEditor(editor) {
    if (editor.somethingSelected())
        return editor.getSelection();
    else
        return editor.getValue();
}
/**
 * Check if something is selected in the current file and return that selection, otherwise return the entire content of the current file.
 * @param  {App} app
 * @param  {boolean} [cached=true] Use `cachedRead` or `read`. `cachedRead` by default.
 * @returns {string | null} `null` if not focussed on a markdown file
 */
export async function getSelectionFromCurrFile(app, cached = true) {
    var _a;
    const text = (_a = window === null || window === void 0 ? void 0 : window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString();
    if (text)
        return text;
    else
        return await getActiveFileContent(app, cached);
}
/**
 * Check if `noteName` is the name of a note that exists in the vault.
 * @param  {App} app
 * @param  {string} noteName Basename of the note to search for.
 * @param  {string} [sourcePath=""] Optional file path to start searching from. Default is the current file.
 * @returns boolean
 */
export const isInVault = (app, noteName, sourcePath = "") => !!app.metadataCache.getFirstLinkpathDest(noteName, sourcePath);
/**
 * When hovering a link going to `to`, show the Obsidian hover-preview of that note.
 *
 * You probably have to hold down `Ctrl` when hovering the link for the preview to appear!
 * @param  {MouseEvent} event
 * @param  {YourView} view The view with the link being hovered
 * @param  {string} to The basename of the note to preview.
 * @template YourView The ViewType of your view
 * @returns void
 */
export function hoverPreview(event, view, to) {
    const targetEl = event.target;
    view.app.workspace.trigger("hover-link", {
        event,
        source: view.getViewType(),
        hoverParent: view,
        targetEl,
        linktext: to,
    });
}
/**
 * Create a new markdown note named `newName` in the user's preffered new-note-folder.
 * @param  {App} app
 * @param  {string} newName Name of new note (with or without '.md')
 * @param  {string} [currFilePath=""] File path of the current note. Use an empty string if there is no active file.
 * @returns {Promise<TFile>} new TFile
 */
export async function createNewMDNote(app, newName, currFilePath = "") {
    const newFileFolder = app.fileManager.getNewFileParent(currFilePath).path;
    const newFilePath = normalizePath(`${newFileFolder}${newFileFolder === "/" ? "" : "/"}${addMD(newName)}`);
    return await app.vault.create(newFilePath, "");
}
/**
 * Add '.md' to `noteName` if it isn't already there.
 * @param  {string} noteName with or without '.md' on the end.
 * @returns {string} noteName with '.md' on the end.
 */
export const addMD = (noteName) => {
    return noteName.endsWith(".md") ? noteName : noteName + ".md";
};
/**
 * Strip '.md' off the end of a note name to get its basename.
 *
 * Works with the edgecase where a note has '.md' in its basename: `Obsidian.md.md`, for example.
 * @param  {string} noteName with or without '.md' on the end.
 * @returns {string} noteName without '.md'
 */
export const stripMD = (noteName) => {
    if (noteName.endsWith(".md")) {
        return noteName.split(".md").slice(0, -1).join(".md");
    }
    else
        return noteName;
};
/**
 * When clicking a link, check if that note is already open in another leaf, and switch to that leaf, if so. Otherwise, open the note in a new pane.
 * @param  {App} app
 * @param  {string} dest Name of note to open. If you want to open a non-md note, be sure to add the file extension.
 * @param  {MouseEvent} event
 * @param  {{createNewFile:boolean}} [options={createNewFile:true}] Whether or not to create `dest` file if it doesn't exist. If `false`, simply return from the function.
 * @returns Promise
 */
export async function openOrSwitch(app, dest, event, options = { createNewFile: true }) {
    const { workspace } = app;
    let destFile = app.metadataCache.getFirstLinkpathDest(dest, "");
    // If dest doesn't exist, make it
    if (!destFile && options.createNewFile) {
        destFile = await createNewMDNote(app, dest);
    }
    else if (!destFile && !options.createNewFile)
        return;
    // Check if it's already open
    const leavesWithDestAlreadyOpen = [];
    // For all open leaves, if the leave's basename is equal to the link destination, rather activate that leaf instead of opening it in two panes
    workspace.iterateAllLeaves((leaf) => {
        var _a;
        if (leaf.view instanceof MarkdownView) {
            const file = (_a = leaf.view) === null || _a === void 0 ? void 0 : _a.file;
            if (file && file.basename + "." + file.extension === dest) {
                leavesWithDestAlreadyOpen.push(leaf);
            }
        }
    });
    // Rather switch to it if it is open
    if (leavesWithDestAlreadyOpen.length > 0) {
        workspace.setActiveLeaf(leavesWithDestAlreadyOpen[0]);
    }
    else {
        // @ts-ignore
        const mode = app.vault.getConfig("defaultViewMode");
        const leaf = event.ctrlKey || event.getModifierState("Meta")
            ? workspace.splitActiveLeaf()
            : workspace.getUnpinnedLeaf();
        await leaf.openFile(destFile, { active: true, mode });
    }
}
/**
 * Given a list of resolved links from app.metadataCache, check if `from` has a link to `to`
 * @param  {ResolvedLinks} resolvedLinks
 * @param  {string} from Note name with link leaving (With or without '.md')
 * @param  {string} to Note name with link arriving (With or without '.md')
 * @param {boolean} [directed=true] Only check if `from` has a link to `to`. If not directed, check in both directions
 */
export function isLinked(resolvedLinks, from, to, directed = true) {
    var _a, _b;
    if (!from.endsWith(".md")) {
        from += ".md";
    }
    if (!to.endsWith(".md")) {
        to += ".md";
    }
    const fromTo = (_a = resolvedLinks[from]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(to);
    if (!fromTo && !directed) {
        const toFrom = (_b = resolvedLinks[to]) === null || _b === void 0 ? void 0 : _b.hasOwnProperty(from);
        return toFrom;
    }
    else
        return fromTo;
}
/**
 * Check if the link `from` → `to` is resolved or not.
 * @param  {App} app
 * @param  {string} to
 * @param  {string} from
 * @returns boolean
 */
export function isResolved(app, to, from) {
    var _a;
    const { resolvedLinks } = app.metadataCache;
    return ((_a = resolvedLinks === null || resolvedLinks === void 0 ? void 0 : resolvedLinks[addMD(from)]) === null || _a === void 0 ? void 0 : _a[addMD(to)]) > 0;
}
/**
 * Open your view on the chosen `side` if it isn't already open
 * @param  {App} app
 * @param  {string} viewType
 * @param  {Constructor<YourView>} viewClass The class constructor of your view
 * @param  {"left"|"right"} [side="right"]
 * @returns {Promise<YourView>} The opened view
 */
export async function openView(app, viewType, viewClass, side = "right") {
    let leaf = null;
    for (leaf of app.workspace.getLeavesOfType(viewType)) {
        if (leaf.view instanceof viewClass) {
            return leaf.view;
        }
        await leaf.setViewState({ type: "empty" });
        break;
    }
    leaf =
        (leaf !== null && leaf !== void 0 ? leaf : side === "right")
            ? app.workspace.getRightLeaf(false)
            : app.workspace.getLeftLeaf(false);
    await leaf.setViewState({
        type: viewType,
        active: true,
    });
    return leaf.view;
}
/**
 * Check which side of the workspace your `viewType` is on, and save it into `plugin.settings[settingName]`.
 *
 * **Tip**: Run this function on `plugin.unload` to save the last side your view was on when closing, then {@link openView} on the same side it was last.
 * @param  {App} app
 * @param  {YourPlugin} plugin
 * @param  {string} viewType
 * @param  {string} settingName
 * @returns {"left" | "right"} `side`
 */
export async function saveViewSide(app, plugin, viewType, settingName) {
    const leaf = app.workspace.getLeavesOfType(viewType)[0];
    if (!leaf) {
        console.info(`Obsidian-Community-Lib: No instance of '${viewType}' open, cannot save side`);
        return;
    }
    //@ts-ignore
    const side = leaf.getRoot().side;
    //@ts-ignore
    plugin.settings[settingName] = side;
    //@ts-ignore
    await plugin.saveSettings();
    return side;
}
/**
 * A Modal used in {@link addRenderedMarkdownButton} to display rendered markdown from a raw string, or fetched from a provided url.
 *
 * ![](https://i.imgur.com/NMwM50E.png)
 * @param  {App} app
 * @param  {YourPlugin} plugin
 * @param  {string} source Raw markdown content or url to find raw markdown.
 * @param  {boolean} fetch True → fetch markdown from `source` as url. False → `source` is already a markdown string.
 */
export class RenderedMarkdownModal extends Modal {
    constructor(app, plugin, source, fetch) {
        super(app);
        this.plugin = plugin;
        this.source = source;
        this.fetch = fetch;
    }
    async onOpen() {
        let { contentEl, source, plugin, fetch } = this;
        let content = source;
        if (fetch) {
            contentEl.createDiv({ text: `Waiting for content from: '${source}'` });
            content = await request({ url: source });
            contentEl.empty();
        }
        const logDiv = contentEl.createDiv({ cls: "OCL-RenderedMarkdownModal" });
        MarkdownRenderer.renderMarkdown(content, logDiv, "", plugin);
    }
    onClose() {
        this.contentEl.empty();
    }
}
/**
 * Add a button to an HTMLELement, which, when clicked, pops up a {@link RenderedMarkdownModal} showing rendered markdown.
 *
 * Use `fetch` to indicate whether the markdown string needs to be fetched, or if it has been provided as a string already.
 *
 * ![](https://i.imgur.com/Hi4gyyv.png)
 * @param  {App} app
 * @param  {YourPlugin} plugin
 * @param  {HTMLElement} containerEl HTMLElement to add the button to
 * @param  {string} source Raw markdown content or url to find raw markdown.
 * @param  {boolean} fetch True → fetch markdown from `source` as url. False → `source` is already a markdown string.
 * @param  {string} displayText Text to display in the button.
 */
export function addRenderedMarkdownButton(app, plugin, containerEl, source, fetch, displayText) {
    containerEl.createEl("button", { text: displayText }, (but) => but.onClickEvent(() => {
        new RenderedMarkdownModal(app, plugin, source, fetch).open();
    }));
}
/**
 * Check if `app.metadataCache.ResolvedLinks` have fully initalised.
 *
 * Used with {@link waitForResolvedLinks}.
 * @param {App} app
 * @param  {number} noFiles Number of files in your vault.
 * @returns {boolean}
 */
export function resolvedLinksComplete(app, noFiles) {
    const { resolvedLinks } = app.metadataCache;
    return Object.keys(resolvedLinks).length === noFiles;
}
/**
 * Wait for `app.metadataCache.ResolvedLinks` to have fully initialised.
 * @param {App} app
 * @param  {number} [delay=1000] Number of milliseconds to wait between each check.
 * @param {number} [max=50] Maximum number of iterations to check before throwing an error and breaking out of the loop.
 */
export async function waitForResolvedLinks(app, delay = 1000, max = 50) {
    const noFiles = app.vault.getMarkdownFiles().length;
    let i = 0;
    while (!resolvedLinksComplete(app, noFiles) && i < max) {
        await wait(delay);
        i++;
    }
    if (i === max) {
        throw Error("Obsidian-Community-Lib: ResolvedLinks did not finish initialising. `max` iterations was reached first.");
    }
}
/**
 * Check if the content of a note has YAML. If so, return an array of the YAML and the rest of the note. If not, return `['', content]`
 * @param  {string} content
 */
export function splitAtYaml(content) {
    if (!/^---\n/.test(content))
        return ["", content];
    else {
        const splits = content.split("---");
        return [
            splits.slice(0, 2).join("---") + "---",
            splits.slice(2).join("---"),
        ];
    }
}
export async function getActiveFileContent(app, cached = true) {
    const currFile = app.workspace.getActiveFile();
    if (!(currFile instanceof TFile))
        return null;
    if (cached)
        return await app.vault.cachedRead(currFile);
    else
        return await app.vault.read(currFile);
}
