"use strict";

const setupEvents = require("./installers/setupEvents");
if(setupEvents.handleSquirrelEvent()) {
    //squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";

const ipc = require("electron").ipcMain;

/** Global references to window objects. Prevents windows from being closed when objects garbage collected */
let win = null;
let pipWin = null;

/** Creates the main app window */
function createWindow() {
    win = new BrowserWindow({
        width: 480, height: 520,
        minWidth: 480, minHeight:520,
        maxWidth: 1370, maxHeight: 768,
        frame: false, resizable: false, movable: true, backgroundColor: "#4c4c4c",
        icon: path.join(__dirname, "/src/assets/images/TDM-Icon.png")
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, "/index.html"),
        protocol: "file",
        slashes: true
    }));

    win.once("ready-to-show", () => {
        win.show();
    });

    win.on("maximize", () => {
        win.webContents.send("sizeChange", { isMax: true });
    });

    win.on("unmaximize", () => {
        win.webContents.send("sizeChange", { isMax: false });
    });

    win.on("closed", () => {
        win = null;
        pipWin = null;
    });
}

/**
 * Creates the PiP window. The window loads the specified pathname of the PiP html file
 * @param { string } pathname
 */
function createPipWindow(pathname) {
    pipWin = new BrowserWindow({
        width: 320, height: 180,
        minWidth: 320, minHeight: 180,
        x: 20, y: 20,
        frame: false, resizable: false, movable: true, alwaysOnTop: true, skipTaskbar: true,
        icon: path.join(__dirname, "/src/assets/images/TDM-Icon.png")
    });

    pipWin.loadURL(url.format({
        pathname: pathname,
        protocol: "file",
        slashes: true
    }));

    pipWin.on("closed", () => {
       pipWin = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});

/**
 * Centers and resizes the specified window to a set of max dimensions
 * @param { Object } window
 */
function resizeWindow(window) {
    window.setMinimumSize(1024, 768);
    window.setSize(1024, 768);
    window.center();
}

/**
 * Shows the specified window if it has been hidden
 * @param { Object } window
 */
function displayWindow(window) {
    setTimeout(() => {
        window.show();
    }, 1000);
}

/** Listens for ipc message from renderer process. Hides the app window, then calls function to resize it */
ipc.on("hide-window", function(event, arg) {
    win.hide();
    setTimeout(() => {
        resizeWindow(win);
    }, 1000);
});

/** Listens for ipc message from renderer process. Calls function to display the app window if it is hidden */
ipc.on("show-window", function(event, arg) {
    displayWindow(win);
});

/** Listens for ipc message from renderer process. Calls functions to minimize, maximize, unmaximize, or close app window */
ipc.on("window-control", function(event, arg) {
    switch(arg) {
        case "min-btn":
            win.minimize();
            break;
        case "max-btn":
            win.isMaximized() ? win.unmaximize() : win.maximize();
            break;
        case "close-btn":
            app.quit();
            break;
        default:
            break;
    }
});

/** Listens for ipc message from renderer process. Calls function to create new PiP window */
ipc.on("openPip", function(event, arg) {
    createPipWindow(arg);
});

/** Listens for ipc message from renderer process. Calls function to close current PiP window */
ipc.on("closePip", function() {
    pipWin.close();
    pipWin = null;
});