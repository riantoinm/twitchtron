"use strict";
import { observable } from "mobx";

/** Defines the app's store */
class streamStore {
    @observable streamData = {}; /** @param { Object } parsed data returned from most Twitch api calls */
    @observable streamDataChannelVideos = {}; /** @param { Object } parsed past broadcast data for a channel returned from Twitch api call */
    @observable streamDataTotals = {}; /** @param { Object } parsed data specifying totals of streamData returned from Twitch api calls */
    @observable streamsRemaining = 0; /** @param { Number } number of unfetched streams remaining for given set of streamData */
    @observable streamDataChannelViewers = 0; /** @param { Number } number of viewers for a channel when streamData stores channel data */
    @observable streamDataChannelUptime = ""; /** @param { string } string representing start time of a stream when streamData stores channel data */
    @observable userData = null; /** @param { Object } parsed authenticated user channel data returned from Twitch api call */
    @observable currentOffset = 0; /** @param { Number } number representing current offset of streamData when streamsRemaining > 0 */
    @observable isLoadingStreams = true; /** @param { bool } represents whether a network request for streams is active or not */
    @observable isOnline = true; /** @param { bool } represents whether user is currently online or not */
    @observable windowIsMax = false; /** @param { bool } represents whether the app window is maxed or not */
    @observable isWatchingEmbededStream = false; /** @param { bool } represents whether an embedded stream is active or not */
    @observable isLoadingOffsetStreams = false; /** @param { bool } represents whether a network request for offset streams is active or not */
    @observable pipIsActive = false; /** @param { bool } represents whether a PiP window is active or not */
    @observable pipChannelName = ""; /** @param { string } the channel name of the currently active PiP stream */
    @observable pipLogoUrl = ""; /** @param { string } the logo url of the currently active PiP stream */
    @observable loginModalShown = false; /** @param { bool } represents whether or not the login modal is shown */
    @observable userAccessToken = null; /** @param { string } the access token of the authenticated user */
    @observable userIsAuthenticated = false; /** @param { bool } represents whether or not the current user is authenticated */
    @observable userIsAuthorized = false; /** @param { bool } represents whether or not the current user has authorized the app */
    @observable followerCursor = null; /** @param { Number } stores the current cursor used when fetching offset followers of a channel */
    @observable currentFollowingStreamsLiveCount = null; /** @param { Number } stores number of current live streams that authenticated user is following */
    @observable canGoBack = false; /** @param { bool } represents whether or not the user can navigate back from current location */
    @observable requestError = false; /** @param { bool } represents whether or not an error has occurred during the current network request */
    @observable streamlinkLocation = null; /** @param { string } the directory of streamlink installation on user's system */
}

export default streamStore;