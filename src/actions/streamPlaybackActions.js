"use strict";
import * as constants from "../utils/globals";
import { action } from "mobx";
import { openInStreamlink } from "../utils/streamlink";
import { replaceStringInFile, setPipToDefault } from "../utils/fileOps";

const { dialog } = require("electron").remote;
const ipc = require("electron").ipcRenderer;

/** Handles opening and closing live streams */
class StreamPlaybackActions {

    /**
     * Updates store to indicate that an embedded stream has been requested to open
     * @param { Object } store
     */
    @action openStreamInApp(store) {
        store.isWatchingEmbededStream = true;
    }

    /**
     * Requests an update of the PiP html file located in target source directory to contain the specified content type and
     * content identifier, then updates store to indicate that a PiP stream has been requested to open
     * @param { Object } store
     * @param { string } contentType
     * @param { string } contentIdentifier
     * @param { string } targetSourceDir
     */
    @action openStreamInPip(store, contentType, contentIdentifier, targetSourceDir) {
        let contentKey = "";
        let contentPathname = "";

        if(contentType === "channel") {
            contentKey = constants.PIP_LIVE_KEY;
            contentPathname = constants.PIP_LIVE_PATHNAME;
            store.pipChannelName = store.streamData.channel.display_name;
            store.pipLogoUrl = store.streamData.channel.logo;
        } else {
            contentKey = constants.PIP_VIDEO_KEY;
            contentPathname = constants.PIP_VIDEO_PATHNAME;
            store.pipChannelName = store.streamData.channelPastBroadcast.channel.display_name;
            store.pipLogoUrl = store.streamData.channel.logo;
        }

        let targetFilename = targetSourceDir + contentPathname;
        replaceStringInFile(contentKey, contentIdentifier, targetFilename).then(
            result => {
                ipc.send("openPip", targetFilename);
                store.pipIsActive = true;
            }
        );
    }

    /**
     * Updates store to indicate that the active PiP stream has been requested to close, then calls method to reset the
     * PiP html to its default state
     * @param { Object } store
     */
    @action closePipStream(store) {
        ipc.send('closePip');
        store.pipIsActive = false;
        setPipToDefault();
    }

    /**
     * Sends request to streamlink helper to open requested stream url in VLC at specified quality
     * @param { string } streamUrl
     * @param { string } quality
     */
    @action openStreamInVlc(streamUrl, quality) {
        openInStreamlink(streamUrl, quality);
    }

    /**
     * Opens a system dialog allowing the user to select the location of the streamlink executable, then calls method
     * to store location
     * @param { Object } store
     */
    @action selectStreamlinkLocation(store) {
        let newStreamlinkLocation = dialog.showOpenDialog({
            title: "Location of streamlink.exe",
            filters: [{ name: "Executables", extensions: ["exe"] }],
            properties: ["openFile"]
        });
        if(newStreamlinkLocation !== undefined) {
            this.setStreamlinkLocation(newStreamlinkLocation[0], store);
        }
    }

    /**
     * Stores the location of streamlink in user's persistent local storage as well as the store
     * @param { string } location
     * @param { Object } store
     */
    @action setStreamlinkLocation(location, store) {
        localStorage.streamlinkLocation = location;
        store.streamlinkLocation = location;
    }
}

export default StreamPlaybackActions;