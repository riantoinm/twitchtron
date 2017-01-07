"use strict";
import { action } from "mobx";
import { openInStreamlink } from "../utils/streamlink";

const { dialog } = require("electron").remote;
const ipc = require("electron").ipcRenderer;
const shell = require("electron").shell;

/** Handles opening and closing live streams */
class StreamPlaybackActions {

    /**
     * Opens specified Twitch chat url with the channelName in the user's default browser
     * @param { String } channelName - name of the channel for which to open the chat window
     */
    __openChatInBrowser(channelName) {
        shell.openExternal(`https://www.twitch.tv/${ channelName }/chat`);
    }

    /**
     * Updates store to indicate that an embedded stream has been requested to open
     * @param { Object } store
     * @param { String } channelName
     */
    @action openStreamInApp(store, channelName) {
        store.isWatchingEmbededStream = true;
        this.__openChatInBrowser(channelName);
    }

    /**
     * Updates pip data in store to based on contentType and contentIdentifier, then sends message to main process to open
     * the PiP window
     * @param { Object } store
     * @param { string } contentType
     * @param { string } contentIdentifier
     * @param { String } channelName
     */
    @action openStreamInPip(store, contentType, contentIdentifier, channelName) {
        if(contentType === "channel") {
            store.pipChannelName = store.streamData.channel.display_name;
            store.pipLogoUrl = store.streamData.channel.logo;
        } else {
            store.pipChannelName = store.streamData.channelPastBroadcast.channel.display_name;
            store.pipLogoUrl = store.streamData.channel.logo;
        }

        ipc.send("openPip", contentType, contentIdentifier);
        store.pipIsActive = true;
        this.__openChatInBrowser(channelName);
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
     * @param { String } channelName
     */
    @action openStreamInVlc(streamUrl, quality, channelName) {
        openInStreamlink(streamUrl, quality);
        this.__openChatInBrowser(channelName);
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