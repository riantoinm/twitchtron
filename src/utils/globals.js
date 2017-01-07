/** Network request constants */
export const REQUEST_DONE = 4;
export const HTTP_SUCCESS = 200;
export const ACCEPT = "application/vnd.twitchtv.v3+json";
export const CLIENT_ID = "swfdx7wfcwfkupsbxggi76lweoy9ene";
export const REDIRECT_URI = "https://localhost/";
export const DEFAULT_SCOPES = "user_read+user_follows_edit+channel_subscriptions+user_subscriptions+channel_read";
export const ACCESS_TOKEN_URI = "https://localhost/#access_token=";
export const ACCESS_DENIED_URI = "https://localhost/?error=access_denied&error_description=The+user+denied+you+access";
export const AUTH_URL = `https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=${ CLIENT_ID }&redirect_uri=${ REDIRECT_URI }&scope=${ DEFAULT_SCOPES }`;

/** streamlink */
export const STREAMLINK_HEADER_ARG = `--http-header Client-ID=${ CLIENT_ID }`;
export const STREAMLINK_QUALITY_HIGH = "best,source,720p,high,medium,low,worst,mobile";
export const STREAMLINK_QUALITY_MED = "medium,high,low,best,720p,worst,source,mobile";
export const STREAMLINK_QUALITY_LOW = "low,mobile,medium,worst,high,720p,source,best";
export const STREAMLINK_QUALITY_AUDIO = "audio,mobile,worst,low,medium,high,720p,source,best";

/** error codes */
export const ERROR_SERVER = "errorServer";
export const ERROR_UNAUTHORIZED = "errorUnauthorized";
export const ERROR_OFFLINE = "errorOffline";

/** stream types */
export const FEATURED_STREAMS = "featuredStreams";
export const TOP_GAMES = "topGames";
export const LIVE_STREAMS = "liveStreams";
export const TOP_VIDEOS = "topVideos";
export const SEARCH_CHANNELS = "searchChannels";
export const SEARCH_STREAMS = "searchStreams";
export const SEARCH_GAMES = "searchGames";
export const SEARCH_ALL = "searchAll";
export const CHANNEL_PAGE = "channelPage";
export const CHANNEL_PAGE_UPDATE = "channelPageUpdate";
export const CHANNEL_PAST_BROADCAST = "channelPastBroadcast";
export const CHANNEL_FOLLOWING = "channelFollowing";
export const CHANNEL_FOLLOWERS = "channelFollowers";
export const CHANNEL_STREAM = "channelStream";
export const CHANNEL_VIDEOS = "channelVideos";
export const STREAMS_BY_GAME = "streamsByGame";
export const VIDEOS_BY_CHANNEL = "videosByChannel";
export const FOLLOWING_BY_CHANNEL = "followingByChannel";
export const FOLLOWERS_BY_CHANNEL = "followersByChannel";
export const VIDEO_BY_ID = "videoById";
export const HOMEPAGE_LIVE = "homepageLive";
export const HOMEPAGE_FOLLOWING = "homepageFollowing";
export const HOMEPAGE_FOLLOWERS = "homepageFollowers";
export const HOMEPAGE_VIDEOS = "homepageVideos";
export const SETTINGS_STREAMLINK = "settingsStreamlink";
export const AUTH_USER = "authUser";

/** section titles */
export const TITLE_FEATURED_STREAMS = "Featured Streams";
export const TITLE_LIVE_STREAMS = "Streams";
export const TITLE_PAST_BROADCASTS = "Past Broadcasts";
export const TITLE_SEARCH_CHANNELS_RESULTS = "Channels";
export const TITLE_SEARCH_GAMES_RESULTS = "Games";
export const TITLE_SEARCH_STREAMS_RESULTS = "Live Streams";
export const TITLE_SEARCH_TOP_RESULTS = "Top Results";
export const TITLE_TOP_GAMES = "Top Games";
export const TITLE_TOP_STREAMS = "Top Streams";
export const TITLE_TOP_VIDEOS = "Top Videos";
export const TITLE_HOMEPAGE_LIVE = "Streams You Follow";

/** stream fetch limit values */
export const FEATURED_LIMIT = 6;
export const DEFAULT_STREAMS_LIMIT = 35;
export const GAMES_LIMIT = 35;
export const CHANNELS_LIMIT = 35;
export const CHANNEL_VIDEOS_LIMIT = 25;
export const INITIAL_OFFSET = 0;
export const INITIAL_SEARCH_LIMIT = 5;
export const HOMEPAGE_STREAMS_LIMIT = 35;