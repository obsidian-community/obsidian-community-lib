"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChangelogButton = exports.ChangelogModal = exports.linkedQ = exports.openOrSwitch = exports.createNewMDNote = exports.hoverPreview = exports.isInVault = exports.getSelectionFromCurrFile = exports.getSelectionFromEditor = exports.copy = exports.getAvailablePathForAttachments = exports.base64ToArrayBuffer = exports.addFeatherIcon = exports.addAllFeatherIcons = exports.wait = void 0;
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
        (0, obsidian_1.addIcon)(`feather-${i.name}`, svg);
    });
}
exports.addAllFeatherIcons = addAllFeatherIcons;
/**
 * Adds a specific Feather Icon to Obsidian.
 *
 * @param name official Name of the Icon (https://feathericons.com/)
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 * @returns {string} Icon name
 */
function addFeatherIcon(name, attr = { viewBox: "0 0 24 24", width: "100", height: "100" }) {
    if (feather.icons[name]) {
        const iconName = `feather-${name}`;
        (0, obsidian_1.addIcon)(iconName, feather.icons[name].toSvg(attr));
        return iconName;
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
 * Create a new markdown note named `newName` in the user's preffered new-note-folder.
 * @param  {App} app
 * @param  {string} newName Name of new note (with or without '.md')
 * @param  {string} [currFilePath=""] File path of the current note. Use an empty string if there is no active file.
 * @returns {Promise<TFile>} new TFile
 */
async function createNewMDNote(app, newName, currFilePath = "") {
    const newFileFolder = app.fileManager.getNewFileParent(currFilePath).path;
    if (!newName.endsWith(".md")) {
        newName += ".md";
    }
    const newFilePath = (0, obsidian_1.normalizePath)(`${newFileFolder}${newFileFolder === "/" ? "" : "/"}${newName}.md`);
    return await app.vault.create(newFilePath, "");
}
exports.createNewMDNote = createNewMDNote;
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
        if (options.createNewFile) {
            destFile = await createNewMDNote(app, dest, currFile.path);
        }
        else
            return;
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
        // @ts-ignore
        const mode = app.vault.getConfig("defaultViewMode");
        const leaf = event.ctrlKey || event.getModifierState("Meta")
            ? workspace.splitActiveLeaf()
            : workspace.getUnpinnedLeaf();
        await leaf.openFile(destFile, { active: true, mode });
    }
}
exports.openOrSwitch = openOrSwitch;
/**
 * Given a list of resolved links from app.metadataCache, check if `from` has a link to `to`
 * @param  {ResolvedLinks} resolvedLinks
 * @param  {string} from Note name with link leaving (With or without '.md')
 * @param  {string} to Note name with link arriving (With or without '.md')
 * @param {boolean} [directed=true] Only check if `from` has a link to `to`. If not directed, check in both directions
 */
function linkedQ(resolvedLinks, from, to, directed = true) {
    if (!from.endsWith(".md")) {
        from += ".md";
    }
    if (!to.endsWith(".md")) {
        to += ".md";
    }
    const fromTo = resolvedLinks[from]?.hasOwnProperty(to);
    if (!fromTo && !directed) {
        const toFrom = resolvedLinks[to]?.hasOwnProperty(from);
        return toFrom;
    }
    else
        return fromTo;
}
exports.linkedQ = linkedQ;
// /**
//  * Initialise
//  * @param  {string} viewType
//  * @param  {Constructor<YourView>} viewClass
//  * @returns {Promise}
//  */
// export async function initView<YourView extends ItemView>(
//   viewType: string,
//   viewClass: Constructor<YourView>
// ): Promise<void> {
//   let leaf: WorkspaceLeaf = null;
//   for (leaf of this.app.workspace.getLeavesOfType(viewType)) {
//     if (leaf.view instanceof viewClass) {
//       return;
//     }
//     await leaf.setViewState({ type: "empty" });
//     break;
//   }
//   (leaf ?? this.app.workspace.getRightLeaf(false)).setViewState({
//     type: viewType,
//     active: true,
//   });
// }
/**
 * A Modal used in {@link addChangelogButton} to display a changlog fetched from a provided url.
 * @param  {App} app
 * @param  {YourPlugin} plugin
 * @param  {string} url Where to find the raw markdown content of your changelog file
 */
class ChangelogModal extends obsidian_1.Modal {
    constructor(app, plugin, url) {
        super(app);
        this.plugin = plugin;
        this.url = url;
    }
    async onOpen() {
        let { contentEl, url, plugin } = this;
        const changelog = await (0, obsidian_1.request)({ url });
        const logDiv = contentEl.createDiv();
        obsidian_1.MarkdownRenderer.renderMarkdown(changelog, logDiv, "", plugin);
    }
    onClose() {
        this.contentEl.empty();
    }
}
exports.ChangelogModal = ChangelogModal;
/**
 * Add a button to an HTMLELement, which, when clicked, pops up a Modal showing the changelog found at the `url` provided.
 * @param  {App} app
 * @param  {YourPlugin} plugin
 * @param  {HTMLElement} containerEl HTMLElement to add the button to
 * @param  {string} url Where to find the raw markdown content of your changelog file
 * @param  {string} [displayText="Changlog"] Text to display in the button
 */
function addChangelogButton(app, plugin, containerEl, url, displayText = "Changlog") {
    containerEl.createEl("button", { text: displayText }, (but) => but.onClickEvent(() => {
        new ChangelogModal(app, plugin, url).open();
    }));
}
exports.addChangelogButton = addChangelogButton;
