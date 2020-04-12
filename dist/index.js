#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const createLinkMap_1 = require("./lib/createLinkMap");
const readAllNotes_1 = require("./lib/readAllNotes");
const updateBacklinks_1 = require("./lib/updateBacklinks");
(async () => {
    const baseNotePath = process.argv[2];
    const notes = await readAllNotes_1.default(baseNotePath);
    const linkMap = createLinkMap_1.default(Object.values(notes));
    await Promise.all(Object.keys(notes).map(async (notePath) => {
        const noteBaseName = path.basename(notePath);
        let backlinks = linkMap.get(noteBaseName);
        const newContents = updateBacklinks_1.default(notes[notePath].parseTree, notes[notePath].noteContents, backlinks
            ? [...backlinks.keys()].map(sourceTitle => {
                return {
                    sourceTitle: path.basename(sourceTitle),
                    context: backlinks.get(sourceTitle)
                };
            })
            : []);
        if (newContents !== notes[notePath].noteContents) {
            await fs.promises.writeFile(path.join(baseNotePath, path.basename(notePath)), newContents, { encoding: "utf-8" });
        }
    }));
})();
//# sourceMappingURL=index.js.map