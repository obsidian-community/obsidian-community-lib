import * as feather from "feather-icons";
import { addIcon, TFile, Vault } from "obsidian";

/**
 * You can await this Function to delay execution
 * 
 * @param delay The delay in ms
 */
export async function wait(delay: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}
/**
 * Adds all official Feather Icons to Obsidian.
 * https://feathericons.com/
 * 
 * @param attr SVG Attributes for the Icon. The default should work for most usecases.
 */
export function addAllFeatherIcons(attr = { viewBox: "0 0 24 24", width: "100", height: "100" }): void {
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
export function addFeatherIcon(name: string, attr = { viewBox: "0 0 24 24", width: "100", height: "100" }): void {
  if (feather.icons[name]) {
    addIcon(
      `feather-${name}`,
      feather.icons[name].toSvg(attr)
    );
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
  for (var i = 0; i < len; i++) {
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
export function getAvailablePathForAttachments(vault: Vault, fileName: string, format: string, sourceFile: TFile): string {
  //@ts-expect-error
  return vault.getAvailablePathForAttachments(fileName, format, sourceFile);
}