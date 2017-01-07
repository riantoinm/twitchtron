"use strict";
import { STREAMLINK_HEADER_ARG } from "../utils/globals";
import ErrorActions from "../actions/errorActions";

const exec = require("child_process").exec;
const execFile = require("child_process").execFile;

/**
 * Tries to find streamlink in the user's PATH or specified directory location. If found, it calls a method to start the stream.
 * Otherwise, it requests that an error be shown.
 * @param { string } streamUrl
 * @param { string } quality
 */
export function openInStreamlink(streamUrl, quality) {
    let errorActionObj = new ErrorActions();
    errorActionObj.showSnackbar("Connecting to streamlink...");
    exec("streamlink --version", (error, stdout, stderr) => {
        if(error) {
            if(localStorage.streamlinkLocation === "") {
                setTimeout(errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>Streamlink not found on your system. Check settings for more info`), 3000);
            } else {
                execFile(localStorage.streamlinkLocation, ["--version"], (error, stdout, stderr) => {
                    if(error) {
                        errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>Streamlink not found on your system. Check settings for more info`);
                    } else {
                        connectToStreamlinkDirec(streamUrl, quality);
                        errorActionObj.showSnackbar("Opening requested stream in VLC...");
                    }
                });
            }
        } else {
            connectToStreamlinkPath(streamUrl, quality);
            errorActionObj.showSnackbar("Opening requested stream in VLC...");
        }
    });
}

/**
 * Opens the specified stream url at the specified quality. If streamlink is not in the user's PATH, connectToStreamlinkDirect()
 * should be used instead.
 * @param { string } streamUrl
 * @param { string } quality
 */
function connectToStreamlinkPath(streamUrl, quality) {
    let errorActionObj = new ErrorActions();

    exec(`streamlink ${ STREAMLINK_HEADER_ARG } ${ streamUrl } ${ quality }`, (error, stdout, stderr) => {
        if(error) {
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>Could not open the requested stream in VLC`);
        }
    });
}

/**
 * Opens the specified stream url at the specified quality. If streamlink is not in the user's directory, connectToStreamlinkPath()
 * should be used instead.
 * @param { string } streamUrl
 * @param { string } quality
 */
function connectToStreamlinkDirec(streamUrl, quality) {
    let errorActionObj = new ErrorActions();

    execFile(localStorage.streamlinkLocation, [STREAMLINK_HEADER_ARG, streamUrl, quality], (error, stdout, stderr) => {
        if(error) {
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>Could not open the requested stream in VLC`);
        }
    });
}