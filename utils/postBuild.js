const replaceInFiles = require("replace-in-files");
const fs = require("fs");

const oldName = "_next";
const newName = "next";

/**
 * This function renames the _next folder in the out folder to next.
 * This step is necessary because brave does not load an extension
 * when a foldername starts with and underscore.
 */
function renameNextFolder() {
  const oldPath = `./out/${oldName}`;
  const newPath = `./out/${newName}`;

  fs.rename(oldPath, newPath, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log(`'${oldName}' folder successfully renamed to '${newName}'`);
    }
  });
}

/**
 * Replaces all paths that direct to _next to next
 */
function replacePathInFiles() {
  const options = {
    files: "./out/*.html",
    from: /\/\_next\//g,
    to: `/${newName}/`,
  };
  replaceInFiles(options)
    .then(({ countOfMatchesByPaths }) => {
      console.log("Count of matches by paths:", countOfMatchesByPaths);
    })
    .catch((error) => {
      console.error("Error occurred:", error);
    });
}

renameNextFolder();
replacePathInFiles();
