import { App, Constructor, Editor, ItemView, Modal, Plugin, TFile, Vault } from "obsidian";
import { ResolvedLinks } from "./interfaces";
/**
 * You can await this Function to delay execution
 *
 * @param delay The delay in ms
 */
export declare function wait(delay: number): Promise<void>;
/**
 * Adds all official Feather Icons to Obsidian.
 * https://feathericons.com/
 *
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 *
 * @deprecated As of Obsidian 0.13.27 this is no longer needed, because Obsidian ships with `lucide`, a maintained fork of feather. (https://lucide.dev/)
 */
export declare function addAllFeatherIcons(attr?: {
    viewBox: string;
    width: string;
    height: string;
}): void;
/**
 * Adds a specific Feather Icon to Obsidian.
 *
 * @param name official Name of the Icon (https://feathericons.com/)
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 * @returns {string} Icon name
 *
 * @deprecated As of Obsidian 0.13.27 this is no longer needed, because Obsidian ships with `lucide`, a maintained fork of feather. (https://lucide.dev/)
 */
export declare function addFeatherIcon(name: string, attr?: {
    viewBox: string;
    width: string;
    height: string;
}): string | void;
/**
 * Convert a base64 String to an ArrayBuffer.
 * You can then use the ArrayBuffer to save the asset to disk.
 *
 * @param base64 base64 string to be converted.
 * @returns ArrayBuffer
 */
export declare function base64ToArrayBuffer(base64: string): ArrayBuffer;
/**
 * This is a helper method for an undocumented API of Obsidian.
 *
 * @param vault You can get this via `this.app.vault`
 * @param fileName The Filename for your Attachment
 * @param format The Fileformat of your Attachment
 * @param sourceFile The Sourcefile from where the Attachment gets added, this is needed because the Attachment Folder might be different based on where it gets inserted.
 * @returns The Attachment Path
 */
export declare function getAvailablePathForAttachments(vault: Vault, fileName: string, format: string, sourceFile: TFile): string;
/**
 * Copy `content` to the users clipboard.
 *
 * @param {string} content The content to be copied to clipboard.
 * @param {() => any} success The callback to run when text is successfully copied. Default throws a new `Notice`
 * @param {(reason?) => any} failure The callback to run when text was not able to be copied. Default throws a new `Notice`, and console logs the error.`
 */
export declare function copy(content: string, success?: () => any, failure?: (reason?: any) => any): Promise<void>;
/**
 * Given an editor, check if something is selected and return that selection, otherwise return the entire content of the editor
 * @param  {Editor} editor
 */
export declare function getSelectionFromEditor(editor: Editor): string;
/**
 * Check if something is selected in the current file and return that selection, otherwise return the entire content of the current file.
 * @param  {App} app
 * @param  {boolean} [cached=true] Use `cachedRead` or `read`. `cachedRead` by default.
 * @returns {string | null} `null` if not focussed on a markdown file
 */
export declare function getSelectionFromCurrFile(app: App, cached?: boolean): Promise<string | null>;
/**
 * Check if `noteName` is the name of a note that exists in the vault.
 * @param  {App} app
 * @param  {string} noteName Basename of the note to search for.
 * @param  {string} [sourcePath=""] Optional file path to start searching from. Default is the current file.
 * @returns boolean
 */
export declare const isInVault: (app: App, noteName: string, sourcePath?: string) => boolean;
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
export declare function hoverPreview<YourView extends ItemView>(event: MouseEvent, view: YourView, to: string): void;
/**
 * Create a new markdown note named `newName` in the user's preffered new-note-folder.
 * @param  {App} app
 * @param  {string} newName Name of new note (with or without '.md')
 * @param  {string} [currFilePath=""] File path of the current note. Use an empty string if there is no active file.
 * @returns {Promise<TFile>} new TFile
 */
export declare function createNewMDNote(app: App, newName: string, currFilePath?: string): Promise<TFile>;
/**
 * Add '.md' to `noteName` if it isn't already there.
 * @param  {string} noteName with or without '.md' on the end.
 * @returns {string} noteName with '.md' on the end.
 */
export declare const addMD: (noteName: string) => string;
/**
 * Strip '.md' off the end of a note name to get its basename.
 *
 * Works with the edgecase where a note has '.md' in its basename: `Obsidian.md.md`, for example.
 * @param  {string} noteName with or without '.md' on the end.
 * @returns {string} noteName without '.md'
 */
export declare const stripMD: (noteName: string) => string;
/**
 * When clicking a link, check if that note is already open in another leaf, and switch to that leaf, if so. Otherwise, open the note in a new pane.
 * @param  {App} app
 * @param  {string} dest Name of note to open. If you want to open a non-md note, be sure to add the file extension.
 * @param  {MouseEvent} event
 * @param  {{createNewFile:boolean}} [options={createNewFile:true}] Whether or not to create `dest` file if it doesn't exist. If `false`, simply return from the function.
 * @returns Promise
 */
export declare function openOrSwitch(app: App, dest: string, event: MouseEvent, options?: {
    createNewFile: boolean;
}): Promise<void>;
/**
 * Given a list of resolved links from app.metadataCache, check if `from` has a link to `to`
 * @param  {ResolvedLinks} resolvedLinks
 * @param  {string} from Note name with link leaving (With or without '.md')
 * @param  {string} to Note name with link arriving (With or without '.md')
 * @param {boolean} [directed=true] Only check if `from` has a link to `to`. If not directed, check in both directions
 */
export declare function isLinked(resolvedLinks: ResolvedLinks, from: string, to: string, directed?: boolean): boolean;
/**
 * Check if the link `from` → `to` is resolved or not.
 * @param  {App} app
 * @param  {string} to
 * @param  {string} from
 * @returns boolean
 */
export declare function isResolved(app: App, to: string, from: string): boolean;
/**
 * Open your view on the chosen `side` if it isn't already open
 * @param  {App} app
 * @param  {string} viewType
 * @param  {Constructor<YourView>} viewClass The class constructor of your view
 * @param  {"left"|"right"} [side="right"]
 * @returns {Promise<YourView>} The opened view
 */
export declare function openView<YourView extends ItemView>(app: App, viewType: string, viewClass: Constructor<YourView>, side?: "left" | "right"): Promise<YourView>;
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
export declare function saveViewSide<YourPlugin extends Plugin>(app: App, plugin: YourPlugin, viewType: string, settingName: string): Promise<"left" | "right">;
/**
 * A Modal used in {@link addRenderedMarkdownButton} to display rendered markdown from a raw string, or fetched from a provided url.
 *
 * ![](https://i.imgur.com/NMwM50E.png)
 * @param  {App} app
 * @param  {YourPlugin} plugin
 * @param  {string} source Raw markdown content or url to find raw markdown.
 * @param  {boolean} fetch True → fetch markdown from `source` as url. False → `source` is already a markdown string.
 */
export declare class RenderedMarkdownModal<YourPlugin extends Plugin> extends Modal {
    plugin: YourPlugin;
    source: string;
    fetch: boolean;
    constructor(app: App, plugin: YourPlugin, source: string, fetch: boolean);
    onOpen(): Promise<void>;
    onClose(): void;
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
export declare function addRenderedMarkdownButton<YourPlugin extends Plugin>(app: App, plugin: YourPlugin, containerEl: HTMLElement, source: string, fetch: boolean, displayText: string): void;
/**
 * Check if `app.metadataCache.ResolvedLinks` have fully initalised.
 *
 * Used with {@link waitForResolvedLinks}.
 * @param {App} app
 * @param  {number} noFiles Number of files in your vault.
 * @returns {boolean}
 */
export declare function resolvedLinksComplete(app: App, noFiles: number): boolean;
/**
 * Wait for `app.metadataCache.ResolvedLinks` to have fully initialised.
 * @param {App} app
 * @param  {number} [delay=1000] Number of milliseconds to wait between each check.
 * @param {number} [max=50] Maximum number of iterations to check before throwing an error and breaking out of the loop.
 */
export declare function waitForResolvedLinks(app: App, delay?: number, max?: number): Promise<void>;
/**
 * Check if the content of a note has YAML. If so, return an array of the YAML and the rest of the note. If not, return `['', content]`
 * @param  {string} content
 */
export declare function splitAtYaml(content: string): [string, string];
export declare function getActiveFileContent(app: App, cached?: boolean): Promise<string | null>;
