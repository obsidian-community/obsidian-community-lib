/**
 * @jest-environment jsdom
 */

import { App } from "obsidian";
import * as ocl from "../src/index";

window.app = new App();

describe("getSelectionFromCurrFile", () => {
    test("returns selection From Window", async () => {
        expect(typeof await ocl.getSelectionFromCurrFile()).toBe("string");
    });
});