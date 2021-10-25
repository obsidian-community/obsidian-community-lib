import * as feather from "feather-icons";
import {
  addIcon,
  TFile,
  Vault,
  Notice,
  Editor,
  App,
  View,
  normalizePath,
  WorkspaceLeaf,
  MarkdownView,
} from "obsidian";

declare module "obsidian" {
  interface App {
    plugins: {
      plugins: { [plugin: string]: any };
    };
    commands: {
      removeCommand: (id: string) => unknown;
    };
  }

  interface Editor {
    cm: {
      findWordAt: (pos: EditorPosition) => EditorSelection | null;
      state: {
        wordAt: (offset: number) => { fromOffset: number; toOffset: number };
      };
    };
  }
}

/**
 * You can await this Function to delay execution
 *
 * @param delay The delay in ms
 */
export async function wait(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Adds all official Feather Icons to Obsidian.
 * https://feathericons.com/
 *
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 */
export function addAllFeatherIcons(
  attr = { viewBox: "0 0 24 24", width: "100", height: "100" }
): void {
  Object.values(feather.icons).forEach((i) => {
    const svg = i.toSvg(attr);
    addIcon("feather-" + i.name, svg);
  });
}

/**
 * Adds a specific Feather Icon to Obsidian.
 *
 * @param name official Name of the Icon (https://feathericons.com/)
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 */
export function addFeatherIcon(
  name: string,
  attr = { viewBox: "0 0 24 24", width: "100", height: "100" }
): void {
  if (feather.icons[name]) {
    addIcon(`feather-${name}`, feather.icons[name].toSvg(attr));
  } else {
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
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
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
export function getAvailablePathForAttachments(
  vault: Vault,
  fileName: string,
  format: string,
  sourceFile: TFile
): string {
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
export async function copy(
  content: string,
  success: () => any = () => new Notice("Copied to clipboard"),
  failure: (reason?: any) => any = (reason) => {
    new Notice("Could not copy to clipboard");
    console.log({ reason });
  }
) {
  await navigator.clipboard.writeText(content).then(success, failure);
}

/**
 * Given an editor, check if something is selected and return that selection, otherwise return the entire content of the editor
 * @param  {Editor} editor
 */
export function getSelectionFromEditor(editor: Editor): string {
  if (editor.somethingSelected()) {
    return editor.getSelection();
  } else {
    return editor.getValue();
  }
}

/**
 * Check if something is selected in the current file and return that selection, otherwise return the entire content of the current file.
 * @param  {App} app
 * @param  {boolean} [cached=true] Use `cachedRead` or `read`. `cachedRead` by default.
 */
export async function getSelectionFromCurrFile(
  app: App,
  cached: boolean = true
): Promise<string> {
  const text = window?.getSelection()?.toString();
  if (text) {
    return text;
  } else {
    const currFile = app.workspace.getActiveFile();
    if (currFile instanceof TFile) {
      if (cached) {
        return await app.vault.cachedRead(currFile);
      } else {
        return await app.vault.read(currFile);
      }
    } else {
      new Notice("You must be focused on a markdown file.");
    }
  }
}
/**
 * Check if `noteName` is the name of a note that exists in the vault.
 * @param  {App} app
 * @param  {string} noteName Basename of the note to search for.
 * @param  {string} [sourcePath=""] Optional file path to start searching from. Default is the current file.
 * @returns boolean
 */
export const isInVault = (
  app: App,
  noteName: string,
  sourcePath: string = ""
): boolean => !!app.metadataCache.getFirstLinkpathDest(noteName, sourcePath);

/**
 * @param  {MouseEvent} event
 * @param  {TView} view The view being hovered
 * @param  {string} to The basename of the note to preview
 * @returns void
 */
export function hoverPreview<TView extends View>(
  event: MouseEvent,
  view: TView,
  to: string
): void {
  const targetEl = event.target as HTMLElement;

  view.app.workspace.trigger("hover-link", {
    event,
    source: view.getViewType(),
    hoverParent: view,
    targetEl,
    linktext: to,
  });
}

/**
 * Create a new note named `newName` in the user's preffered new-note-folder.
 * @param  {App} app
 * @param  {string} newName Basename of new note
 * @param  {string} [currFilePath=""] File path of the current note. Use an empty string if there is no active file.
 * @returns {Promise<TFile>} new TFile
 */
export async function createNewNote(
  app: App,
  newName: string,
  currFilePath: string = ""
): Promise<TFile> {
  const newFileFolder = app.fileManager.getNewFileParent(currFilePath).path;
  const newFilePath = normalizePath(
    `${newFileFolder}${newFileFolder === "/" ? "" : "/"}${newName}.md`
  );
  return await app.vault.create(newFilePath, "");
}

/**
 * When clicking a link, check if that note is already open in another leaf, and switch to that leaf, if so. Otherwise, open the note in a new pane
 * @param  {App} app
 * @param  {string} dest Basename of note to open to open
 * @param  {MouseEvent} event
 * @param  {{createNewFile:boolean}} [options={createNewFile:true}]
 * @returns Promise
 */
export async function openOrSwitch(
  app: App,
  dest: string,
  event: MouseEvent,
  options: {
    createNewFile: boolean;
  } = { createNewFile: true }
): Promise<void> {
  const { workspace } = app;
  const currFile = workspace.getActiveFile();
  let destFile = app.metadataCache.getFirstLinkpathDest(dest, currFile.path);

  // If dest doesn't exist, make it
  if (!destFile) {
    if (options.createNewFile) {
      destFile = await createNewNote(app, dest, currFile.path);
    } else return;
  }

  // Check if it's already open
  const leavesWithDestAlreadyOpen: WorkspaceLeaf[] = [];
  // For all open leaves, if the leave's basename is equal to the link destination, rather activate that leaf instead of opening it in two panes
  workspace.iterateAllLeaves((leaf) => {
    if (leaf.view instanceof MarkdownView) {
      if (leaf.view?.file?.basename === dest) {
        leavesWithDestAlreadyOpen.push(leaf);
      }
    }
  });

  // Rather switch to it if it is open
  if (leavesWithDestAlreadyOpen.length > 0) {
    workspace.setActiveLeaf(leavesWithDestAlreadyOpen[0]);
  } else {
    const mode = (app.vault as any).getConfig("defaultViewMode");
    const leaf =
      event.ctrlKey || event.getModifierState("Meta")
        ? workspace.splitActiveLeaf()
        : workspace.getUnpinnedLeaf();

    await leaf.openFile(destFile, { active: true, mode });
  }
}
