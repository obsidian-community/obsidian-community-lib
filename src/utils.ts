/**
 * This module contains various utility functions commonly used in Obsidian plugins.
 * @module obsidian-community-lib
 */
import * as feather from "feather-icons";
import {
  addIcon,
  App,
  Constructor,
  Editor,
  ItemView,
  MarkdownRenderer,
  MarkdownView,
  Modal,
  normalizePath,
  Notice,
  Plugin,
  request,
  TFile,
  Vault,
  WorkspaceLeaf,
} from "obsidian";

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
export function addFeatherIcon(
  name: string,
  attr = { viewBox: "0 0 24 24", width: "100", height: "100" }
): string | void {
  if (feather.icons[name]) {
    const iconName = `feather-${name}`;
    addIcon(iconName, feather.icons[name].toSvg(attr));
    return iconName;
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
 * When hovering a link going to `to`, show the Obsidian hover-preview of that note.
 *
 * You probably have to hold down `Ctrl` when hovering the link for the preview to appear!
 * @param  {MouseEvent} event
 * @param  {YourView} view The view with the link being hovered
 * @param  {string} to The basename of the note to preview. Not necessary if the element being hovered has `to` as its `innerText`
 * @template YourView The ViewType of your view
 * @returns void
 */
export function hoverPreview<YourView extends ItemView>(
  event: MouseEvent,
  view: YourView,
  to?: string
): void {
  const targetEl = event.target as HTMLElement;
  const linkText = to ?? targetEl.innerText;

  view.app.workspace.trigger("hover-link", {
    event,
    source: view.getViewType(),
    hoverParent: view,
    targetEl,
    linkText,
  });
}

/**
 * Create a new markdown note named `newName` in the user's preffered new-note-folder.
 * @param  {App} app
 * @param  {string} newName Name of new note (with or without '.md')
 * @param  {string} [currFilePath=""] File path of the current note. Use an empty string if there is no active file.
 * @returns {Promise<TFile>} new TFile
 */
export async function createNewMDNote(
  app: App,
  newName: string,
  currFilePath: string = ""
): Promise<TFile> {
  const newFileFolder = app.fileManager.getNewFileParent(currFilePath).path;
  if (!newName.endsWith(".md")) {
    newName += ".md";
  }
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
      destFile = await createNewMDNote(app, dest, currFile.path);
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
    // @ts-ignore
    const mode = app.vault.getConfig("defaultViewMode") as string;
    const leaf =
      event.ctrlKey || event.getModifierState("Meta")
        ? workspace.splitActiveLeaf()
        : workspace.getUnpinnedLeaf();

    await leaf.openFile(destFile, { active: true, mode });
  }
}

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
export function linkedQ(
  resolvedLinks: ResolvedLinks,
  from: string,
  to: string,
  directed: boolean = true
) {
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
  } else return fromTo;
}

/**
 * Open your view on the chosen `side` if it isn't already open
 * @param  {App} app
 * @param  {string} viewType
 * @param  {Constructor<YourView>} viewClass The class constructor of your view
 * @param  {"left"|"right"} [side="right"]
 * @returns {Promise<void>}
 */
export async function openView<YourView extends ItemView>(
  app: App,
  viewType: string,
  viewClass: Constructor<YourView>,
  side: "left" | "right" = "right"
): Promise<void> {
  let leaf: WorkspaceLeaf = null;
  for (leaf of app.workspace.getLeavesOfType(viewType)) {
    if (leaf.view instanceof viewClass) {
      return;
    }
    await leaf.setViewState({ type: "empty" });
    break;
  }

  leaf =
    leaf ?? side === "right"
      ? app.workspace.getRightLeaf(false)
      : app.workspace.getLeftLeaf(false);

  leaf.setViewState({
    type: viewType,
    active: true,
  });
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
export async function saveViewSide<YourPlugin extends Plugin>(
  app: App,
  plugin: YourPlugin,
  viewType: string,
  settingName: string
): Promise<"left" | "right"> {
  const leaf = app.workspace.getLeavesOfType(viewType)[0];
  //@ts-ignore
  const side: "left" | "right" = leaf.getRoot().side;
  //@ts-ignore
  plugin.settings[settingName] = side;
  //@ts-ignore
  await plugin.saveSettings();
  return side;
}

/**
 * A Modal used in {@link addChangelogButton} to display a changelog fetched from a provided url.
 *
 * ![](https://i.imgur.com/NMwM50E.png)
 * @param  {App} app
 * @param  {YourPlugin} plugin
 * @param  {string} url Where to find the raw markdown content of your changelog file
 */
export class ChangelogModal<YourPlugin extends Plugin> extends Modal {
  plugin: YourPlugin;
  url: string;

  constructor(app: App, plugin: YourPlugin, url: string) {
    super(app);
    this.plugin = plugin;
    this.url = url;
  }

  async onOpen() {
    let { contentEl, url, plugin } = this;
    const changelog = await request({ url });
    const logDiv = contentEl.createDiv();
    MarkdownRenderer.renderMarkdown(changelog, logDiv, "", plugin);
  }

  onClose() {
    this.contentEl.empty();
  }
}
/**
 * Add a button to an HTMLELement, which, when clicked, pops up a {@link ChangelogModal} showing the changelog found at the `url` provided.
 *
 * ![](https://i.imgur.com/Hi4gyyv.png)
 * @param  {App} app
 * @param  {YourPlugin} plugin
 * @param  {HTMLElement} containerEl HTMLElement to add the button to
 * @param  {string} url Where to find the raw markdown content of your changelog file
 * @param  {string} [displayText="Changlog"] Text to display in the button
 */
export function addChangelogButton<YourPlugin extends Plugin>(
  app: App,
  plugin: YourPlugin,
  containerEl: HTMLElement,
  url: string,
  displayText: string = "Changlog"
) {
  containerEl.createEl("button", { text: displayText }, (but) =>
    but.onClickEvent(() => {
      new ChangelogModal(app, plugin, url).open();
    })
  );
}
