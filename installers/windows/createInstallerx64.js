"use strict";
const createWindowsInstaller = require("electron-winstaller").createWindowsInstaller;
const path = require("path");

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });

function getInstallerConfig() {
    console.log("creating windowsx64 installer");
    const rootPath = path.join("./");
    const outPath = path.join(rootPath, "release-builds");

    return Promise.resolve({
        appDirectory: path.join(outPath, "Twitchtron-win32-x64/"),
        authors: "Twitchtron",
        noMsi: true,
        outputDirectory: path.join(outPath, "windowsx64-installer"),
        exe: "Twitchtron.exe",
        setupExe: "TwitchtronSetup.exe",
        setupIcon: path.join(rootPath, "src", "assets", "images", "icons", "TDM-Icon.ico")
    });
}