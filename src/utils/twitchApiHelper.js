"use strict";
import * as constants from "./globals";

/**
 * Constructs Twitch endpoint url based on the type specified in the request params.
 * @param { Object } requestParams
 * @returns { string }
 */
function __constructUrl(requestParams) {
    switch(requestParams.type){
        case constants.FEATURED_STREAMS:
            return`https://api.twitch.tv/kraken/streams/featured?limit=${ requestParams.limit }&offset=${ requestParams.offset }`;
            break;
        case constants.TOP_GAMES:
            return `https://api.twitch.tv/kraken/games/top?limit=${ requestParams.limit }&offset=${ requestParams.offset }`;
            break;
        case constants.LIVE_STREAMS:
            return `https://api.twitch.tv/kraken/streams?limit=${ requestParams.limit }&offset=${ requestParams.offset }`;
            break;
        case constants.TOP_VIDEOS:
            return requestParams.gameTitle === undefined
                ? `https://api.twitch.tv/kraken/videos/top?limit=${ requestParams.limit }&offset=${ requestParams.offset }&period=week`
                : `https://api.twitch.tv/kraken/videos/top?limit=${ requestParams.limit }&offset=${ requestParams.offset }&period=week&game=${ requestParams.gameTitle }`;
            break;
        case constants.SEARCH_CHANNELS:
            return `https://api.twitch.tv/kraken/search/channels?limit=${ requestParams.limit }&offset=${ requestParams.offset }&query=${ requestParams.query }`;
            break;
        case constants.SEARCH_STREAMS:
            return `https://api.twitch.tv/kraken/search/streams?limit=${ requestParams.limit }&offset=${ requestParams.offset }&query=${ requestParams.query }`;
            break;
        case constants.SEARCH_GAMES:
            return `https://api.twitch.tv/kraken/search/games?type=suggest&live=${ requestParams.onlyLive }&query=${ requestParams.query }`;
            break;
        case constants.CHANNEL_PAGE:
            return `https://api.twitch.tv/kraken/channels/${ requestParams.channelName }`;
            break;
        case constants.CHANNEL_STREAM:
            return `https://api.twitch.tv/kraken/streams/${ requestParams.channelName }`;
            break;
        case constants.VIDEO_BY_ID:
            return `https://api.twitch.tv/kraken/videos/${ requestParams.videoId }`;
            break;
        case constants.VIDEOS_BY_CHANNEL:
            return `https://api.twitch.tv/kraken/channels/${ requestParams.channelName }/videos?limit=${ requestParams.limit }&offset=${ requestParams.offset }&broadcasts=true`;
            break;
        case constants.STREAMS_BY_GAME:
            return `https://api.twitch.tv/kraken/streams?game=${ requestParams.gameName }&limit=${ requestParams.limit }&offset=${ requestParams.offset }&stream_type=${ requestParams.resultsType }`;
            break;
        case constants.HOMEPAGE_LIVE:
            return `https://api.twitch.tv/kraken/streams/followed?limit=${ requestParams.limit }&offset=${ requestParams.offset }&stream_type=live&oauth_token=${ requestParams.accessToken }`;
            break;
        case constants.FOLLOWING_BY_CHANNEL:
            return `https://api.twitch.tv/kraken/users/${ requestParams.channelName }/follows/channels?limit=${ requestParams.limit }&offset=${ requestParams.offset }`;
            break;
        case constants.FOLLOWERS_BY_CHANNEL:
            if(requestParams.cursor === null) {
                return `https://api.twitch.tv/kraken/channels/${ requestParams.channelName }/follows?limit=${ requestParams.limit }`;
            } else {
                return `https://api.twitch.tv/kraken/channels/${ requestParams.channelName }/follows?limit=${ requestParams.limit }&cursor=${ requestParams.cursor }`;
            }
            break;
        case constants.AUTH_USER:
            return `https://api.twitch.tv/kraken/user?oauth_token=${ requestParams.accessToken }`;
            break;
    }
}

/**
 * Fetches data based on values stored in request params
 * @param { Object } requestParams
 * @param { Number } [retryInterval = 1500]
 * @param { Number } [retryCount = 3]
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function fetchStreams(requestParams, retryInterval = 1500, retryCount = 3) {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();

        request.onreadystatechange = function(event) {
            if(this.readyState === constants.REQUEST_DONE) {
                if(this.status === constants.HTTP_SUCCESS) {
                    resolve(this.response);
                } else {
                    if(retryCount === 1) {
                        if(this.status === 401) {
                            return reject(constants.ERROR_UNAUTHORIZED);
                        } else {
                            return reject(constants.ERROR_SERVER);
                        }
                    } else {
                        setTimeout(fetchStreams(requestParams, retryInterval * 2, retryCount - 1).then(
                            response => {
                                return resolve(response);
                            }, error => {
                                return reject(error);
                            }
                        ), retryInterval);
                    }
                }
            }
        };

        let url = __constructUrl(requestParams);
        request.open("GET", url);
        request.setRequestHeader("Accept", constants.ACCEPT);
        request.setRequestHeader("Client-ID", constants.CLIENT_ID);
        request.send();
    });
}

/**
 * Fetches background data based on values stored in request params
 * @param { Object } requestParams
 * @param { Number } [retryInterval = 1500]
 * @param { Number } [retryCount = 3]
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function backgroundFetchStreams(requestParams, retryInterval = 1500, retryCount = 3) {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();

        request.onreadystatechange = function(event) {
            if(this.readyState === constants.REQUEST_DONE) {
                if(this.status === constants.HTTP_SUCCESS) {
                    resolve(this.response);
                } else {
                    if(retryCount === 1) {
                        return reject(constants.ERROR_SERVER);
                    } else {
                        setTimeout(backgroundFetchStreams(requestParams, retryInterval * 2, retryCount - 1).then(
                            response => {
                                return resolve(response);
                            }, error => {
                                return reject(error);
                            }
                        ), retryInterval);
                    }
                }
            }
        };

        let url = __constructUrl(requestParams);
        request.open("GET", url);
        request.setRequestHeader("Accept", constants.ACCEPT);
        request.setRequestHeader("Client-ID", constants.CLIENT_ID);
        request.send();
    });
}

/**
 * Calls method to fetch authenticated user data
 * @param { string } accessToken - access token of the authenticated user
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function getAuthenticatedUser(accessToken) {
    return new Promise(function(resolve, reject) {
        let results = "";
        let requestParams = {
            type: constants.AUTH_USER,
            accessToken: accessToken
        };

        fetchStreams(requestParams).then(
            response => {
                results = response;
                resolve(results);
            }, error => { return reject(error); }
        );
    });
}

/**
 * Calls method to fetch channel data and stream data for a live channel
 * @param { string } channelName - name of desired live channel
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function getChannelLive(channelName) {
    return new Promise(function(resolve, reject) {
        let results = {
            channelData: "",
            channelStreamData: "",
        };
        let getChannelParams = {
            type: constants.CHANNEL_PAGE,
            channelName: channelName
        };
        let getChannelStreamParams = {
            type: constants.CHANNEL_STREAM,
            channelName: channelName
        };

        fetchStreams(getChannelParams).then(
            channelResponse => {
                results.channelData = channelResponse;
                fetchStreams(getChannelStreamParams).then(
                    channelStreamResponse => {
                        results.channelStreamData = channelStreamResponse;
                        resolve(results);
                    },
                    channelStreamError => { return reject(channelStreamError); }
                );
            },
            channelError => { return reject(channelError); }
        );
    });
}

/**
 * Calls method to fetch channel data and past broadcast stream data for a past broadcast
 * @param { string } channelName - name of desired channel
 * @param { string } videoId - videoId of the desired past broadcast
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function getChannelPastBroadcast(channelName, videoId) {
    return new Promise(function(resolve, reject) {
        let results = {
            channelData: "",
            channelPastBroadcastData: "",
        };
        let getChannelParams = {
            type: constants.CHANNEL_PAGE,
            channelName: channelName
        };
        let getChannelPastBroadcastParams = {
            type: constants.VIDEO_BY_ID,
            videoId: videoId
        };

        fetchStreams(getChannelParams).then(
            channelResponse => {
                results.channelData = channelResponse;
                fetchStreams(getChannelPastBroadcastParams).then(
                    channelPastBroadcastResponse => {
                        results.channelPastBroadcastData = channelPastBroadcastResponse;
                        resolve(results);
                    },
                    channelPastBroadcastError => { return reject(channelPastBroadcastError); }
                );
            },
            channelError => { return reject(channelError); }
        );
    });
}

/**
 * Calls method to fetch followers for a specified channel
 * @param { string } channelName - name of channel for which followers are desired
 * @param { Number } limit - max number of results desired
 * @param { Number } cursor - value representing the current offset of fetched follower data
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function getFollowerChannels(channelName, limit, cursor) {
    return new Promise(function(resolve, reject) {
        let results = "";
        let requestParams = {
            type: constants.FOLLOWERS_BY_CHANNEL,
            channelName: channelName,
            limit: limit,
            cursor: cursor,
        };

        fetchStreams(requestParams).then(
            response => {
                results = response;
                resolve(results);
            }, error => { return reject(error); }
        );
    });
}

/**
 * Calls method to fetch channels that specified channel is following
 * @param { string } channelName - name of channel for which channels followed are desired
 * @param { Number } limit - max number of results desired
 * @param { Number } offset -  current offset of fetched data
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function getFollowingChannels(channelName, limit, offset) {
    return new Promise(function(resolve, reject) {
        let results = "";
        let requestParams = {
            type: constants.FOLLOWING_BY_CHANNEL,
            channelName: channelName,
            limit: limit,
            offset: offset,
        };

        fetchStreams(requestParams).then(
            response => {
                results = response;
                resolve(results);
            }, error => { return reject(error); }
        );
    });
}

/**
 * Calls method to fetch streams for a specified game
 * @param { string } gameName - name of game for which streams are desired
 * @param { Number } limit - max number of results desired
 * @param { Number } offset -  current offset of fetched data
 * @param { string } [resultsType = "live"] -  type of streams that should be fetched
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function getStreamsByGame(gameName, limit, offset, resultsType = "live") {
    return new Promise(function(resolve, reject) {
        let results = "";
        let requestParams = {
            type: constants.STREAMS_BY_GAME,
            gameName: encodeURIComponent(gameName.trim()),
            limit: limit,
            offset: offset,
            resultsType: resultsType
        };

        fetchStreams(requestParams).then(
            response => {
                results = response;
                resolve(results);
            }, error => { return reject(error); }
        );
    });
}

/**
 * Calls method to fetch live streams for channels that authenticated user is following
 * @param { Number } limit - max number of results desired
 * @param { Number } offset -  current offset of fetched data
 * @param { string } accessToken -  access token of authenticated user
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function getStreamsForUser(limit, offset, accessToken) {
    return new Promise(function(resolve, reject) {
        let results = "";
        let requestParams = {
            type: constants.HOMEPAGE_LIVE,
            limit: limit,
            offset: offset,
            accessToken: accessToken
        };

        fetchStreams(requestParams).then(
            response => {
                results = response;
                resolve(results);
            }, error => { return reject(error); }
        );
    });
}

/**
 * Calls method to fetch live streams for channels that authenticated user is following in the background
 * @param { Number } limit - max number of results desired
 * @param { Number } offset -  current offset of fetched data
 * @param { string } accessToken -  access token of authenticated user
 * @returns { Object } - promise resolved with response data or rejected without an error
 */
export function getStreamsForUserUpdate(limit, offset, accessToken) {
    return new Promise(function(resolve, reject) {
        let results = "";
        let requestParams = {
            type: constants.HOMEPAGE_LIVE,
            limit: limit,
            offset: offset,
            accessToken: accessToken
        };

        backgroundFetchStreams(requestParams).then(
            response => {
                results = response;
                resolve(results);
            }, error => { return reject(); }
        );
    });
}

/**
 * Calls method to fetch past broadcasts for specified channel
 * @param { string } channelName - name of channel for which channels past broadcasts are desired
 * @param { Number } limit - max number of results desired
 * @param { Number } offset -  current offset of fetched data
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function getVideosByChannel(channelName, limit, offset) {
    return new Promise(function(resolve, reject) {
        let results = "";
        let requestParams = {
            type: constants.VIDEOS_BY_CHANNEL,
            channelName: channelName,
            limit: limit,
            offset: offset,
        };

        fetchStreams(requestParams).then(
            response => {
                results = response;
                resolve(results);
            }, error => { return reject(error); }
        );
    });
}

/**
 * Calls method to search channels, streams, and games based on query
 * @param { string } query - search query
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function searchAll(query) {
    return new Promise(function(resolve, reject) {
        let results = {
            searchChannelsData: "",
            searchStreamsData: "",
            searchGamesData: ""
        };

        let searchChannelsRequestParams = {
            type: constants.SEARCH_CHANNELS,
            limit: constants.INITIAL_SEARCH_LIMIT,
            offset: constants.INITIAL_OFFSET,
            query: query
        };
        let searchStreamsRequestParams = {
            type: constants.SEARCH_STREAMS,
            limit: constants.INITIAL_SEARCH_LIMIT,
            offset: constants.INITIAL_OFFSET,
            query: query
        };
        let searchGamesRequestParams = {
            type: constants.SEARCH_GAMES,
            limit: constants.INITIAL_SEARCH_LIMIT,
            offset: constants.INITIAL_OFFSET,
            onlyLive: true,
            query: query,
        };

        fetchStreams(searchChannelsRequestParams).then(
            channelsResponse => {
                results.searchChannelsData = channelsResponse;
                fetchStreams(searchStreamsRequestParams).then(
                    streamsResponse => {
                        results.searchStreamsData = streamsResponse;
                        fetchStreams(searchGamesRequestParams).then(
                            gamesResponse => {
                                results.searchGamesData = gamesResponse;
                                resolve(results);
                            }, gamesError => { return reject(gamesError); }
                        );
                    }, streamsError => { return reject(streamsError); }
                );
            }, channelsError => { return reject(channelsError); }
        );
    });
}

/**
 * Calls method to search channels based on query
 * @param { string } query - search query
 * @param { Number } limit - max number of results desired
 * @param { Number } offset -  current offset of fetched data
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function searchChannels(query, limit, offset) {
    return new Promise(function(resolve, reject) {
        let results = "";

        let searchChannelsRequestParams = {
            type: constants.SEARCH_CHANNELS,
            limit: limit,
            offset: offset,
            query: query
        };

        fetchStreams(searchChannelsRequestParams).then(
            channelsResponse => {
                results = channelsResponse;
                resolve(results);
            }, channelsError => { return reject(channelsError); }
        );
    });
}

/**
 * Calls method to search games based on specified query
 * @param { string } query - search query
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function searchGames(query) {
    return new Promise(function(resolve, reject) {
        let results = "";

        let searchGamesRequestParams = {
            type: constants.SEARCH_GAMES,
            onlyLive: false,
            query: query
        };

        fetchStreams(searchGamesRequestParams).then(
            gamesResponse => {
                results = gamesResponse;
                resolve(results);
            }, gamesError => { return reject(gamesError); }
        );
    });
}

/**
 * Calls method to search streams based on specified query
 * @param { string } query - search query
 * @param { Number } limit - max number of results desired
 * @param { Number } offset -  current offset of fetched data
 * @returns { Object } - promise resolved with response data or rejected with error
 */
export function searchStreams(query, limit, offset) {
    return new Promise(function(resolve, reject) {
        let results = "";

        let searchStreamsRequestParams = {
            type: constants.SEARCH_STREAMS,
            limit: limit,
            offset: offset,
            query: query
        };

        fetchStreams(searchStreamsRequestParams).then(
            streamsResponse => {
                results = streamsResponse;
                resolve(results);
            }, streamsError => { return reject(streamsError); }
        );
    });
}