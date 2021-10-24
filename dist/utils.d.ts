import { TFile, Vault } from "obsidian";
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
 * Copy Text to the Users Clipboard.
 *
 * @param content The contend to be copied to clipboard.
 */
export declare function copy(content: string): Promise<void>;
