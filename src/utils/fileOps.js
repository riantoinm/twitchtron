"use strict";
import * as constants from "./globals";
import fs from "fs";
import path from "path";

/**
 * Replaces specified query with specified replacement in the file specified
 * @param { string } query
 * @param { string } replacement
 * @param { string } file
 * @returns { Object }
 */
export function replaceStringInFile(query, replacement, file) {
    return new Promise(function(resolve, reject) {
        fs.readFile(file, "utf8", function(readError, data) {
            if(readError) {
                reject(readError);
            } else {
                let result = data.replace(query, replacement);
                fs.writeFile(file, result, 'utf8', function(writeError) {
                    if(writeError) {
                        reject(writeError);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

/** Sets PiP html files to the default values specified in globals */
export function setPipToDefault() {
    let livePipFilename = path.join(__dirname, '../components/twitch/channel/livePictureInPicture.html');
    let videoPipFilename = path.join(__dirname, '../components/twitch/channel/videoPictureInPicture.html');
    __overwriteFile(livePipFilename, constants.PIP_LIVE_DEFAULT_HTML);
    __overwriteFile(videoPipFilename, constants.PIP_VIDEO_DEFAULT_HTML);
}

/**
 * Writes contents specified to the file specified
 * @param { string } file
 * @param { string } contents
 * @returns { Object }
 */
function __overwriteFile(file, contents) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(file, contents, 'utf8', function(writeError) {
           if(writeError) {
               reject(writeError);
           } else {
               resolve();
           }
        });
    });
}