"use strict";
import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";

if(require("electron-squirrel-startup")) {
    app.quit();
}

const ipc = require("electron").ipcMain;

/** Global references to window objects. Prevents windows from being closed when objects garbage collected */
let win, pipWin, preloadWin = null;

/** Creates the main app window */
function createWindow() {
    win = new BrowserWindow({
        width: 480, height: 520,
        minWidth: 480, minHeight:520,
        show: false,
        frame: false, resizable: false, movable: true, backgroundColor: "#4c4c4c",
        icon: path.join(__dirname, "/src/assets/images/TDM-Icon.png")
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, "/index.html"),
        protocol: "file",
        slashes: true
    }));

    win.webContents.on("did-finish-load", () => {
        preloadWin.close();
        win.show();
        createPipWindow();
    });

    win.on("maximize", () => {
        win.webContents.send("sizeChange", { isMax: true });
    });

    win.on("unmaximize", () => {
        win.webContents.send("sizeChange", { isMax: false });
    });

    win.on("closed", () => {
        pipWin = null;
        win = null;
    });
}

/** Creates the preloader window */
function createPreloadWindow() {
    preloadWin = new BrowserWindow({
        width: 480, height: 300,
        minWidth: 480, minHeight:300,
        maxWidth: 480, maxHeight: 300,
        show: true,
        frame: false, resizable: false, backgroundColor: "#4c4c4c",
        icon: path.join(__dirname, "/src/assets/images/TDM-Icon.png")
    });

    preloadWin.loadURL(url.format({
        pathname: path.join(__dirname, "/src/components/startup/preload.html"),
        protocol: "file",
        slashes: true
    }));

    preloadWin.webContents.on("did-finish-load", () => {
        createWindow();
    });

    preloadWin.on("closed", () => {
        preloadWin = null;
    });
}

/** Creates the PiP window */
function createPipWindow() {
    pipWin = new BrowserWindow({
        width: 320, height: 180,
        minWidth: 320, minHeight: 180,
        x: 20, y: 20,
        frame: false, resizable: false, movable: true, alwaysOnTop: true, skipTaskbar: true, show: false,
        icon: path.join(__dirname, "/src/assets/images/TDM-Icon.png"),
    });

    pipWin.loadURL(url.format({
        pathname: path.join(__dirname, "/src/components/twitch/channel/pipContainer.html"),
        protocol: "file",
        slashes: true
    }));

    pipWin.on("closed", () => {
        pipWin = null;
    });
}

app.on("ready", createPreloadWindow);

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
ipc.once("hide-window", function() {
    win.hide();
    setTimeout(() => {
        resizeWindow(win);
    }, 1000);
});

/** Listens for ipc message from renderer process. Calls function to display the app window if it is hidden */
ipc.once("show-window", function() {
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

/** Listens for ipc message from renderer process. Sends pip info message to pipWin markup script, then shows the
 * pip window */
ipc.on("openPip", function(event, contentType, contentIdentifier) {
    pipWin.webContents.send("pipInfoReceived", { contentType: contentType, contentIdentifier: contentIdentifier });
    pipWin.show();
});

/** Listens for ipc message from renderer process. Sends closed status message to pipWin markup script, then hides the
 * pip window */
ipc.on("closePip", function() {
    pipWin.webContents.send("pipCloseReceived");
    pipWin.hide();
});
