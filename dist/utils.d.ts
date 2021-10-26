import { App, Editor, TFile, Vault, View } from "obsidian";
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
 */
export declare function addFeatherIcon(name: string, attr?: {
    viewBox: string;
    width: string;
    height: string;
}): void;
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
 */
export declare function getSelectionFromCurrFile(app: App, cached?: boolean): Promise<string>;
/**
 * Check if `noteName` is the name of a note that exists in the vault.
 * @param  {App} app
 * @param  {string} noteName Basename of the note to search for.
 * @param  {string} [sourcePath=""] Optional file path to start searching from. Default is the current file.
 * @returns boolean
 */
export declare const isInVault: (app: App, noteName: string, sourcePath?: string) => boolean;
/**
 * @param  {MouseEvent} event
 * @param  {TView} view The view being hovered
 * @param  {string} to The basename of the note to preview
 * @returns void
 */
export declare function hoverPreview<TView extends View>(event: MouseEvent, view: TView, to: string): void;
/**
 * Create a new markdown note named `newName` in the user's preffered new-note-folder.
 * @param  {App} app
 * @param  {string} newName Name of new note (with or without '.md')
 * @param  {string} [currFilePath=""] File path of the current note. Use an empty string if there is no active file.
 * @returns {Promise<TFile>} new TFile
 */
export declare function createNewMDNote(app: App, newName: string, currFilePath?: string): Promise<TFile>;
/**
 * When clicking a link, check if that note is already open in another leaf, and switch to that leaf, if so. Otherwise, open the note in a new pane
 * @param  {App} app
 * @param  {string} dest Basename of note to open to open
 * @param  {MouseEvent} event
 * @param  {{createNewFile:boolean}} [options={createNewFile:true}]
 * @returns Promise
 */
export declare function openOrSwitch(app: App, dest: string, event: MouseEvent, options?: {
    createNewFile: boolean;
}): Promise<void>;
export interface ResolvedLinks {
    [from: string]: {
        [to: string]: number;
    };
}
/**
 * Given a list of resolved links from app.metadataCache, check if `from` has a link to `to`
 * @param  {ResolvedLinks} resolvedLinks
 * @param  {string} from Note name with link leaving (With or without '.md')
 * @param  {string} to Note name with link arriving (With or without '.md')
 * @param {boolean} [directed=true] Only check if `from` has a link to `to`. If not directed, check in both directions
 */
export declare function linkedQ(resolvedLinks: ResolvedLinks, from: string, to: string, directed?: boolean): boolean;
