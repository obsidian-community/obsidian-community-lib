import { Editor } from "../__mocks__/obsidian";
import * as ocl from "../src/index";

describe("wait", () => {
    test("actually waits atleast 1000ms", async () => {
        const start = new Date().getTime();
        await ocl.wait(1000);
        const elapsed = new Date().getTime() - start;
        expect(elapsed).toBeGreaterThanOrEqual(1000);
    });

    test("actually waits atleast 50ms", async () => {
        const start = new Date().getTime();
        await ocl.wait(50);
        const elapsed = new Date().getTime() - start;
        expect(elapsed).toBeGreaterThanOrEqual(50);
    });
});

describe("getSelectionFromEditor", () => {
    test("returns string", () => {
        //@ts-expect-error
        expect(typeof ocl.getSelectionFromEditor(new Editor())).toEqual("string");
    });
});

describe("addMD", () => {
    test("Doesn't add duplicate .md to end of filename", () => {
        expect(ocl.addMD("filename.md")).toEqual("filename.md");
    });

    test("Does add .md to end of filename", () => {
        expect(ocl.addMD("filename")).toEqual("filename.md");
    });

    test("Does add .md to end of filename", () => {
        expect(ocl.addMD("filenamemd")).toEqual("filenamemd.md");
    });

    test("Does add .md to end of filename", () => {
        expect(ocl.addMD(".md")).toEqual(".md");
    });

    test("Doesn't add .md to end of filename when .MD is present", () => {
        expect(ocl.addMD("filename.MD")).toEqual("filename.MD");
    });
});

describe("stripMD", () => {
    test("If .md isn't present, return the same string", () => {
        expect(ocl.stripMD("base_.md_name")).toEqual("base_.md_name");
    });

    test("If .md is present, strip it", () => {
        expect(ocl.stripMD("filename.md")).toEqual("filename");
    });

    test("If .MD is present, strip it", () => {
        expect(ocl.stripMD("filename.MD")).toEqual("filename");
    });

    test("If .md is not at the end, don't strip it", () => {
        expect(ocl.stripMD("file_.md_name.md")).toEqual("file_.md_name");
    });
});

describe("splitAtYaml", () => {
    test("Properly splits Yaml and Note (Yaml present)", () => {
        const [yaml, note] = ocl.splitAtYaml(`---
tags: ["Test"]
aliases: ["asdf"]
---

# Note

Lorem *ipsum*
`);
        expect(yaml).toEqual(`---
tags: ["Test"]
aliases: ["asdf"]
---`);
        expect(note).toEqual(`

# Note

Lorem *ipsum*
`)
    });

    test("Properly splits Yaml and note (Yaml not present)", () => {
        const[yaml, note] = ocl.splitAtYaml("# Note\nLorem *ipsum*");
        expect(yaml).toEqual("");
        expect(note).toEqual("# Note\nLorem *ipsum*")
    });
});