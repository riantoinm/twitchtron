"use strict";
import * as ApiHelper from "../utils/twitchApiHelper";
import * as constants from "../utils/globals";
import { action } from "mobx";
import ErrorActions from "./errorActions";

/** Handles interfacing between app components, the twitchApiHelper, and the store */
class StreamActions {

    /**
     * Clears store data that must be reset before initiating new api requests
     * @param { Object } store
     */
    __clearStoreData(store) {
        store.currentOffset = 0;
        store.isWatchingEmbededStream = false;
        store.followerCursor = null;
        store.streamsRemaining = 0;
        store.requestError = false;

    }

    /**
     * Updates store based on the stream type requested with the appropriate data from the api response. If following a
     * request for offset stream data, __setStreamOffsetData should be used instead
     * @param { Object } store
     * @param { Object } responseData
     * @param { string } streamType
     */
    __setStreamData(store, responseData, streamType) {
        switch(streamType) {
            case constants.FEATURED_STREAMS:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).featured;
                return;
            case constants.LIVE_STREAMS:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).streams;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
            case constants.TOP_GAMES:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).top;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
            case constants.TOP_VIDEOS:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).videos;
                store.streamDataTotals = 100; //arbitrary value, as Twitch api does not define a _total key for Top Videos
                return;
            case constants.SEARCH_ALL:
                store.streamData = {};
                store.streamData.channels = (JSON.parse(responseData.searchChannelsData)).channels;
                store.streamData.streams = (JSON.parse(responseData.searchStreamsData)).streams;
                store.streamData.games = (JSON.parse(responseData.searchGamesData)).games;
                return;
            case constants.SEARCH_CHANNELS:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).channels;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
            case constants.SEARCH_STREAMS:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).streams;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
            case constants.SEARCH_GAMES:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).games;
                return;
            case constants.STREAMS_BY_GAME:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).streams;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
            case constants.CHANNEL_PAGE:
                store.streamData = {};
                store.streamDataChannelViewers = 0;
                store.streamDataChannelUptime = "";
                store.streamData.channel = JSON.parse(responseData.channelData);
                store.streamData.channelStream = (JSON.parse(responseData.channelStreamData)).stream;
                if(store.streamData.channelStream !== null) {
                    store.streamDataChannelViewers = (JSON.parse(responseData.channelStreamData)).stream.viewers;
                    store.streamDataChannelUptime = (JSON.parse(responseData.channelStreamData)).stream.created_at;
                }
                return;
            case constants.CHANNEL_PAGE_UPDATE:
                if((JSON.parse(responseData.channelStreamData)).stream !== null) {
                    store.streamDataChannelViewers = (JSON.parse(responseData.channelStreamData)).stream.viewers;
                    store.streamDataChannelUptime = (JSON.parse(responseData.channelStreamData)).stream.created_at;
                }
                return;
            case constants.CHANNEL_PAST_BROADCAST:
                store.streamData = {};
                store.streamData.channel = JSON.parse(responseData.channelData);
                store.streamData.channelPastBroadcast = JSON.parse(responseData.channelPastBroadcastData);
                return;
            case constants.AUTH_USER:
                store.userData = {};
                store.userData = (JSON.parse(responseData));
                return;
            case constants.HOMEPAGE_LIVE:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).streams;
                store.currentFollowingStreamsLiveCount = (JSON.parse(responseData))._total;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
            case constants.FOLLOWING_BY_CHANNEL:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).follows;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
            case constants.FOLLOWERS_BY_CHANNEL:
                store.streamData = {};
                store.streamData = (JSON.parse(responseData)).follows;
                store.followerCursor = (JSON.parse(responseData))._cursor;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
            case constants.VIDEOS_BY_CHANNEL:
                store.streamDataChannelVideos = {};
                store.streamDataChannelVideos = (JSON.parse(responseData)).videos;
                store.streamDataTotals = (JSON.parse(responseData))._total;
                return;
        }
    }

    /**
     * Updates store based on the stream type requested with the appropriate offset data from the api response. If following
     * an request for initial stream data, __setStreamData should be used instead
     * @param { Object } store
     * @param { Object } responseData
     * @param { string } streamType
     */
    __setStreamOffsetData(store, responseData, streamType) {
        let finalData = null;
        switch(streamType) {
            case constants.LIVE_STREAMS:
                finalData = responseData.streams;
                store.streamData.push(...finalData);
                return;
            case constants.TOP_GAMES:
                finalData = responseData.top;
                store.streamData.push(...finalData);
                return;
            case constants.TOP_VIDEOS:
                finalData = responseData.videos;
                store.streamData.push(...finalData);
                return;
            case constants.SEARCH_CHANNELS:
                finalData = responseData.channels;
                store.streamData.push(...finalData);
                return;
            case constants.SEARCH_GAMES:
                finalData = responseData.games;
                store.streamData.push(...finalData);
                return;
            case constants.SEARCH_STREAMS:
                finalData = responseData.streams;
                store.streamData.push(...finalData);
                return;
            case constants.CHANNEL_VIDEOS:
                finalData = responseData.videos;
                store.streamData.push(...finalData);
                return;
            case constants.STREAMS_BY_GAME:
                finalData = responseData.streams;
                store.streamData.push(...finalData);
                return;
            case constants.HOMEPAGE_LIVE:
                finalData = responseData.streams;
                store.streamData.push(...finalData);
                return;
            case constants.FOLLOWING_BY_CHANNEL:
                finalData = responseData.follows;
                store.streamData.push(...finalData);
                return;
            case constants.FOLLOWERS_BY_CHANNEL:
                finalData = responseData.follows;
                store.streamData.push(...finalData);
                store.followerCursor = responseData._cursor;
                return;
            case constants.VIDEOS_BY_CHANNEL:
                finalData = responseData.videos;
                store.streamDataChannelVideos.push(...finalData);
                return;
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch streams of type streamType
     * @param { Object } store
     * @param { string } streamType
     */
    @action setTwitchStreams(store, streamType) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            let limit = this.getStreamLimitByStreamType(streamType);
            let requestParams = {
                type: streamType,
                limit: limit,
                offset: constants.INITIAL_OFFSET
            };

            if(store.userIsAuthenticated && store.userIsAuthorized && store.userData === null) {
                this.getAuthenticatedUser(store);
            }

            ApiHelper.fetchStreams(requestParams).then(
                response => {
                    this.__setStreamData(store, response, streamType);
                    store.streamsRemaining = store.streamDataTotals - limit;
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch offset streams of type streamType
     * @param { Object } store
     * @param { string } streamType
     */
    @action setTwitchStreamsOffset(store, streamType) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            let streamLimit = this.getStreamLimitByStreamType(streamType);
            let newOffset = store.currentOffset + streamLimit;
            if(store.streamsRemaining < 1) {
                return;
            }
            store.isLoadingOffsetStreams = true;
            let requestParams = {
                type: streamType,
                limit: streamLimit,
                offset: newOffset,
            };

            ApiHelper.fetchStreams(requestParams).then(
                response => {
                    this.__setStreamOffsetData(store, JSON.parse(response), streamType);
                    store.streamsRemaining = store.streamsRemaining - streamLimit;
                    store.currentOffset = newOffset;
                    store.isLoadingOffsetStreams = false;
                }, error => {
                    errorActionObj.reportOffsetLoadError(store);
                }
            );
        } else {
            errorActionObj.reportOffsetLoadError(store);
        }
    }

    /**
     * Sends request to twitchApiHelper to execute a top results search based on the query
     * @param { string } query
     * @param { Object } store
     */
    @action setSearchAllStreamData(query, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.searchAll(query).then(
                response=> {
                    this.__setStreamData(store, response, constants.SEARCH_ALL);
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to execute a channels search based on the query
     * @param { string } query
     * @param { Object } store
     */
    @action setSearchChannelsData(query, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.searchChannels(query, constants.DEFAULT_STREAMS_LIMIT, constants.INITIAL_OFFSET).then(
                response=> {
                    this.__setStreamData(store, response, constants.SEARCH_CHANNELS);
                    store.streamsRemaining = store.streamDataTotals - constants.DEFAULT_STREAMS_LIMIT;
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to execute an offset channels search based on the query
     * @param { string } query
     * @param { Object } store
     */
    @action setSearchChannelsDataOffset(query, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            let streamLimit = constants.DEFAULT_STREAMS_LIMIT;
            let newOffset = store.currentOffset + streamLimit;
            if(store.streamsRemaining < 1) {
                return;
            }
            store.isLoadingOffsetStreams = true;

            ApiHelper.searchChannels(query, streamLimit, newOffset).then(
                response=> {
                    this.__setStreamOffsetData(store, JSON.parse(response), constants.SEARCH_CHANNELS);
                    store.streamsRemaining = store.streamsRemaining - streamLimit;
                    store.currentOffset = newOffset;
                    store.isLoadingOffsetStreams = false;
                }, error => {
                    errorActionObj.reportOffsetLoadError(store);
                }
            );
        } else {
            errorActionObj.reportOffsetLoadError(store);
        }
    }

    /**
     * Sends request to twitchApiHelper to execute a games search based on the query
     * @param { string } query
     * @param { Object } store
     */
    @action setSearchGamesData(query, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.searchGames(query).then(
                response=> {
                    this.__setStreamData(store, response, constants.SEARCH_GAMES);
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to execute a streams search based on the query
     * @param { string } query
     * @param { Object } store
     */
    @action setSearchStreamsData(query, store) {
        let errorActionObj = new ErrorActions();


        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.searchStreams(query, constants.DEFAULT_STREAMS_LIMIT, constants.INITIAL_OFFSET).then(
                response=> {
                    this.__setStreamData(store, response, constants.SEARCH_STREAMS);
                    store.streamsRemaining = store.streamDataTotals - constants.DEFAULT_STREAMS_LIMIT;
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to execute an offset streams search based on the query
     * @param { string } query
     * @param { Object } store
     */
    @action setSearchStreamsDataOffset(query, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            let streamLimit = constants.DEFAULT_STREAMS_LIMIT;
            let newOffset = store.currentOffset + streamLimit;
            if(store.streamsRemaining < 1) {
                return;
            }
            store.isLoadingOffsetStreams = true;

            ApiHelper.searchStreams(query, streamLimit, newOffset).then(
                response=> {
                    this.__setStreamOffsetData(store, JSON.parse(response), constants.SEARCH_STREAMS);
                    store.streamsRemaining = store.streamsRemaining - streamLimit;
                    store.currentOffset = newOffset;
                    store.isLoadingOffsetStreams = false;
                }, error => {
                    errorActionObj.reportOffsetLoadError(store);
                }
            );
        } else {
            errorActionObj.reportOffsetLoadError(store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch live channel data based on channel name
     * @param { string } channelName
     * @param { Object } store
     */
    @action loadChannelLive(channelName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.getChannelLive(channelName).then(
                response => {
                    this.__setStreamData(store, response, constants.CHANNEL_PAGE);
                    this.getVideosByChannel(channelName, store);
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch updated live channel data based on channel name
     * @param { string } channelName
     * @param { Object } store
     */
    @action loadChannelLiveUpdate(channelName, store) {
        if(store.isOnline) {
            ApiHelper.getChannelLive(channelName).then(
                response => {
                    this.__setStreamData(store, response, constants.CHANNEL_PAGE_UPDATE);
                } //no error reporting needed for background updates
            );
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch channel past broadcast data based on the channel name and video id
     * @param { string } channelName
     * @param { string } videoId
     * @param { Object } store
     */
    @action loadChannelPastBroadcast(channelName, videoId, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.getChannelPastBroadcast(channelName, videoId).then(
                response => {
                    this.__setStreamData(store, response, constants.CHANNEL_PAST_BROADCAST);
                    this.getVideosByChannel(channelName, store);
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch games stream data based on game name
     * @param { string } gameName
     * @param { Object } store
     */
    @action getStreamsByGame(gameName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            let limit = constants.DEFAULT_STREAMS_LIMIT;

            ApiHelper.getStreamsByGame(gameName, limit, constants.INITIAL_OFFSET).then(
                response => {
                    this.__setStreamData(store, response, constants.STREAMS_BY_GAME);
                    store.streamsRemaining = store.streamDataTotals - limit;
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch offset games stream data based on game name
     * @param { string } gameName
     * @param { Object } store
     */
    @action getStreamsByGameOffset(gameName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            let limit = constants.DEFAULT_STREAMS_LIMIT;
            let newOffset = store.currentOffset + limit;
            if(store.streamsRemaining < 1) {
                return;
            }
            store.isLoadingOffsetStreams = true;

            ApiHelper.getStreamsByGame(gameName, limit, newOffset).then(
                response => {
                    this.__setStreamOffsetData(store, JSON.parse(response), constants.STREAMS_BY_GAME);
                    store.streamsRemaining = store.streamsRemaining - limit;
                    store.currentOffset = newOffset;
                    store.isLoadingOffsetStreams = false;
                }, error => {
                    errorActionObj.reportOffsetLoadError(store);
                }
            );
        } else {
            errorActionObj.reportOffsetLoadError(store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch data for authenticated user based on user access token in the store
     * @param { Object } store
     */
    @action getAuthenticatedUser(store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;

            ApiHelper.getAuthenticatedUser(store.userAccessToken).then(
                response => {
                    this.__setStreamData(store, response, constants.AUTH_USER);
                    ApiHelper.getStreamsForUser(constants.DEFAULT_STREAMS_LIMIT, constants.INITIAL_OFFSET, store.userAccessToken).then(
                        response => {
                            store.currentFollowingStreamsLiveCount = (JSON.parse(response))._total;
                        }, error => store.requestError = error
                    );
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch updated count of live channels that authenticated user is following
     * based on user access token in the store
     * @param { Object } store
     */
    @action updateLiveChannelsFollowingCount(store) {
        if(store.isOnline) {
            ApiHelper.getStreamsForUserUpdate(constants.DEFAULT_STREAMS_LIMIT, constants.INITIAL_OFFSET, store.userAccessToken).then(
                response => {
                    store.currentFollowingStreamsLiveCount = (JSON.parse(response))._total;
                } //no error reporting needed for background updates
            );
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch live streams for the authenticated user based on user access token in the store
     * @param { Object } store
     */
    @action getHomepageLiveStreams(store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.getStreamsForUser(constants.HOMEPAGE_STREAMS_LIMIT, constants.INITIAL_OFFSET, store.userAccessToken).then(
                response => {
                    this.__setStreamData(store, response, constants.HOMEPAGE_LIVE);
                    store.streamsRemaining = store.streamDataTotals - constants.HOMEPAGE_STREAMS_LIMIT;
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch offset live streams for the authenticated user based on user access
     * token in the store
     * @param { Object } store
     */
    @action getHomepageLiveStreamsOffset(store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            let streamLimit = constants.DEFAULT_STREAMS_LIMIT;
            let newOffset = store.currentOffset + streamLimit;
            if(store.streamsRemaining < 1) {
                return;
            }
            store.isLoadingOffsetStreams = true;

            ApiHelper.getStreamsForUser(streamLimit, newOffset, store.userAccessToken).then(
                response=> {
                    this.__setStreamOffsetData(store, JSON.parse(response), constants.HOMEPAGE_LIVE);
                    store.streamsRemaining = store.streamsRemaining - streamLimit;
                    store.currentOffset = newOffset;
                    store.isLoadingOffsetStreams = false;
                }, error => {
                    errorActionObj.reportOffsetLoadError(store);
                }
            );
        } else {
            errorActionObj.reportOffsetLoadError(store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch channels that specified channel name is following
     * @param { string } channelName
     * @param { Object } store
     */
    @action getFollowingChannels(channelName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.getFollowingChannels(channelName, constants.CHANNELS_LIMIT, constants.INITIAL_OFFSET).then(
                response => {
                    this.__setStreamData(store, response, constants.FOLLOWING_BY_CHANNEL);
                    store.streamsRemaining = store.streamDataTotals - constants.CHANNELS_LIMIT;
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch offset channels that specified channel name is following
     * @param { string } channelName
     * @param { Object } store
     */
    @action getFollowingChannelsOffset(channelName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            let streamLimit = constants.CHANNELS_LIMIT;
            let newOffset = store.currentOffset + streamLimit;
            if(store.streamsRemaining < 1) {
                return;
            }
            store.isLoadingOffsetStreams = true;

            ApiHelper.getFollowingChannels(channelName, streamLimit, newOffset).then(
                response=> {
                    this.__setStreamOffsetData(store, JSON.parse(response), constants.FOLLOWING_BY_CHANNEL);
                    store.streamsRemaining = store.streamsRemaining - streamLimit;
                    store.currentOffset = newOffset;
                    store.isLoadingOffsetStreams = false;
                }, error => {
                    errorActionObj.reportOffsetLoadError(store);
                }
            );
        } else {
            errorActionObj.reportOffsetLoadError(store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch followers of specified channel name
     * @param { string } channelName
     * @param { Object } store
     */
    @action getFollowerChannels(channelName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.getFollowerChannels(channelName, constants.CHANNELS_LIMIT, null).then(
                response => {
                    this.__setStreamData(store, response, constants.FOLLOWERS_BY_CHANNEL);
                    store.streamsRemaining = store.streamDataTotals - constants.CHANNELS_LIMIT;
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch offset followers of specified channel name
     * @param { string } channelName
     * @param { Object } store
     */
    @action getFollowerChannelsOffset(channelName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            let streamLimit = constants.CHANNELS_LIMIT;
            if(store.followerCursor === undefined) {
                return;
            }
            store.isLoadingOffsetStreams = true;

            ApiHelper.getFollowerChannels(channelName, streamLimit, store.followerCursor).then(
                response=> {
                    this.__setStreamOffsetData(store, JSON.parse(response), constants.FOLLOWERS_BY_CHANNEL);
                    store.streamsRemaining = store.streamsRemaining - streamLimit;
                    store.isLoadingOffsetStreams = false;
                },  error => {
                    errorActionObj.reportOffsetLoadError(store);
                }
            );
        } else {
            errorActionObj.reportOffsetLoadError(store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch past broadcasts for specified channel name
     * @param { string } channelName
     * @param { Object } store
     */
    @action getVideosByChannel(channelName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            store.isLoadingStreams = true;
            this.__clearStoreData(store);

            ApiHelper.getVideosByChannel(channelName, constants.CHANNEL_VIDEOS_LIMIT, constants.INITIAL_OFFSET).then(
                response => {
                    this.__setStreamData(store, response, constants.VIDEOS_BY_CHANNEL);
                    store.streamsRemaining = store.streamDataTotals - constants.CHANNEL_VIDEOS_LIMIT;
                    store.isLoadingStreams = false;
                }, error => {
                    errorActionObj.reportError(error, store);
                }
            );
        } else {
            errorActionObj.reportError(constants.ERROR_OFFLINE, store);
        }
    }

    /**
     * Sends request to twitchApiHelper to fetch offset past broadcasts for specified channel name
     * @param { string } channelName
     * @param { Object } store
     */
    @action getVideosByChannelOffset(channelName, store) {
        let errorActionObj = new ErrorActions();

        if(store.isOnline) {
            let streamLimit = constants.CHANNEL_VIDEOS_LIMIT;
            let newOffset = store.currentOffset + streamLimit;
            if(store.streamsRemaining < 1) {
                return;
            }
            store.isLoadingOffsetStreams = true;

            ApiHelper.getVideosByChannel(channelName, streamLimit, newOffset).then(
                response=> {
                    this.__setStreamOffsetData(store, JSON.parse(response), constants.VIDEOS_BY_CHANNEL);
                    store.streamsRemaining = store.streamsRemaining - streamLimit;
                    store.currentOffset = newOffset;
                    store.isLoadingOffsetStreams = false;
                }, error => {
                    errorActionObj.reportOffsetLoadError(store);
                }
            );
        } else {
            errorActionObj.reportOffsetLoadError(store);
        }
    }

    /**
     * Gets the limit on the number of streams to request from the Twitch api based on the stream type
     * @param { string } streamType
     * @return { Number } streamLimit
     */
    getStreamLimitByStreamType(streamType) {
        switch(streamType) {
            case constants.FEATURED_STREAMS:
                return constants.FEATURED_LIMIT;
                break;
            case constants.TOP_GAMES:
                return constants.GAMES_LIMIT;
                break;
            default:
                return constants.DEFAULT_STREAMS_LIMIT;
                break;
        }
    }
}

export default StreamActions;