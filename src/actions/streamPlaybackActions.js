"use strict";
import { action } from "mobx";
import { openInStreamlink } from "../utils/streamlink";

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
     * Updates pip data in store to based on contentType and contentIdentifier, then sends message to main process to open
     * the PiP window
     * @param { Object } store
     * @param { string } contentType
     * @param { string } contentIdentifier
     */
    @action openStreamInPip(store, contentType, contentIdentifier) {
        if(contentType === "channel") {
            store.pipChannelName = store.streamData.channel.display_name;
            store.pipLogoUrl = store.streamData.channel.logo;
        } else {
            store.pipChannelName = store.streamData.channelPastBroadcast.channel.display_name;
            store.pipLogoUrl = store.streamData.channel.logo;
        }

        ipc.send("openPip", contentType, contentIdentifier);
        store.pipIsActive = true;
    }

    /**
     * Sends message to main process to close the active PiP window, then updates store to indicate that the active PiP
     * stream has been requested to close
     * @param { Object } store
     */
    @action closePipStream(store) {
        ipc.send('closePip');
        store.pipIsActive = false;
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