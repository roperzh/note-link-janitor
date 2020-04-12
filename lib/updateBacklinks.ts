import * as MDAST from "mdast";

import getBacklinksBlock from "./getBacklinksBlock";
import processor from "./processor";

export interface BacklinkEntry {
  sourceTitle: string;
  context: MDAST.BlockContent[];
}

export default function updateBacklinks(
  tree: MDAST.Root,
  noteContents: string,
  backlinks: BacklinkEntry[]
): string {
  let insertionOffset: number;
  let oldEndOffset: number = -1;

  const backlinksInfo = getBacklinksBlock(tree);
  if (backlinksInfo.isPresent) {
    insertionOffset = backlinksInfo.start.position!.start.offset!;
    oldEndOffset = backlinksInfo.until
      ? backlinksInfo.until.position!.start.offset!
      : noteContents.length;
  } else {
    insertionOffset = backlinksInfo.insertionPoint
      ? backlinksInfo.insertionPoint.position!.start.offset!
      : noteContents.length;
  }

  if (oldEndOffset === -1) {
    oldEndOffset = insertionOffset;
  }

  let backlinksString = "";
  if (backlinks.length > 0) {
    backlinksString = `## Backlinks\n\n${backlinks
      .map(
        entry =>
          `* [[${entry.sourceTitle}]]\n${entry.context
            .map(
              block =>
                `\t* ${processor.stringify(block).replace(/\n/g, "\n\t")}\n`
            )
            .join("")}`
      )
      .join("")}`;
  }

  let beforeBacklinks = noteContents.slice(0, insertionOffset);

  if (backlinksString.length) {
    return beforeBacklinks.trim() + "\n\n" + backlinksString.trim() + "\n";
  } else {
    return beforeBacklinks;
  }
}
