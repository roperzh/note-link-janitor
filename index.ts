#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

import createLinkMap from "./lib/createLinkMap";
import readAllNotes from "./lib/readAllNotes";
import updateBacklinks from "./lib/updateBacklinks";

(async () => {
  const baseNotePath = process.argv[2];
  const notes = await readAllNotes(baseNotePath);
  const linkMap = createLinkMap(Object.values(notes));

  await Promise.all(
    Object.keys(notes).map(async notePath => {
      const noteBaseName = path.basename(notePath);
      let backlinks = linkMap.get(noteBaseName);

      const newContents = updateBacklinks(
        notes[notePath].parseTree,
        notes[notePath].noteContents,
        backlinks
          ? [...backlinks.keys()].map(sourceTitle => {
              return {
                sourceTitle: path.basename(sourceTitle),
                context: backlinks!.get(sourceTitle)!
              };
            })
          : []
      );
      if (newContents !== notes[notePath].noteContents) {
        await fs.promises.writeFile(
          path.join(baseNotePath, path.basename(notePath)),
          newContents,
          { encoding: "utf-8" }
        );
      }
    })
  );
})();
