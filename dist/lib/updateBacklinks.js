"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBacklinksBlock_1 = require("./getBacklinksBlock");
const processor_1 = require("./processor");
function updateBacklinks(tree, noteContents, backlinks) {
    let insertionOffset;
    let oldEndOffset = -1;
    const backlinksInfo = getBacklinksBlock_1.default(tree);
    if (backlinksInfo.isPresent) {
        insertionOffset = backlinksInfo.start.position.start.offset;
        oldEndOffset = backlinksInfo.until
            ? backlinksInfo.until.position.start.offset
            : noteContents.length;
    }
    else {
        insertionOffset = backlinksInfo.insertionPoint
            ? backlinksInfo.insertionPoint.position.start.offset
            : noteContents.length;
    }
    if (oldEndOffset === -1) {
        oldEndOffset = insertionOffset;
    }
    let backlinksString = "";
    if (backlinks.length > 0) {
        backlinksString = `## Backlinks\n\n${backlinks
            .map(entry => `* [[${entry.sourceTitle}]]\n${entry.context
            .map(block => `\t* ${processor_1.default.stringify(block).replace(/\n/g, "\n\t")}\n`)
            .join("")}`)
            .join("")}`;
    }
    let beforeBacklinks = noteContents.slice(0, insertionOffset);
    if (backlinksString.length) {
        return beforeBacklinks.trim() + "\n\n" + backlinksString.trim() + "\n";
    }
    else {
        return beforeBacklinks;
    }
}
exports.default = updateBacklinks;
//# sourceMappingURL=updateBacklinks.js.map