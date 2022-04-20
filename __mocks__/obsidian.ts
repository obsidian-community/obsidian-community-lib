/* Based on https://github.com/blacksmithgu/obsidian-dataview/tree/master/__mocks__ with some additions*/

import { EventEmitter } from "events";

/** Basic obsidian abstraction for any file or folder in a vault. */
export abstract class TAbstractFile {
    /**
     * @public
     */
    vault: Vault;
    /**
     * @public
     */
    path: string;
    /**
     * @public
     */
    name: string;
    /**
     * @public
     */
    parent: TFolder;
}

/** Tracks file created/modified time as well as file system size. */
export interface FileStats {
    /** @public */
    ctime: number;
    /** @public */
    mtime: number;
    /** @public */
    size: number;
}

/** A regular file in the vault. */
export class TFile extends TAbstractFile {
    stat: FileStats;
    basename: string;
    extension: string;
}

/** A folder in the vault. */
export class TFolder extends TAbstractFile {
    children: TAbstractFile[];

    isRoot(): boolean {
        return false;
    }
}

export class Vault extends EventEmitter {
    getFiles() {
        return [];
    }
    trigger(name: string, ...data: any[]): void {
        this.emit(name, ...data);
    }
    async cachedRead(file: TFile): Promise<string> {
        return new Promise((resolve) => resolve("Cached File Contents"));
    }
}

export class Component {
    registerEvent() {}
}

/* Additions: */

export class Modal {

}

export class Editor {
    somethingSelected(): boolean {
        return Math.random() < 0.5;
    }

    getSelection(): string {
        return "Current selection";
    }

    getValue(): string {
        return "Whole Document";
    }
}

export class App {
    workspace = {
        getActiveFile() {
            return new TFile();
        }
    }

    vault = new Vault();
}