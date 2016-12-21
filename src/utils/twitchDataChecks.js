"use strict";
import Path from "path";

/**
 * Checks whether a specified game value is valid. If so, returns the value. Otherwise, returns "Games"
 * @param { string } game
 * @returns { string }
 */
export function checkGame(game) {
    if(game === null || game.length < 1) {
        return "Games";
    } else {
        return game;
    }
}

/**
 * Checks whether a specified logo value is valid. If so, returns the value. Otherwise, returns path of a placeholder
 * @param { string } logo
 * @returns { string }
 */
export function checkLogo(logo) {
    if(logo === null) {
        return Path.resolve(__dirname, "../assets/images/channel_placeholder.png");
    } else {
        return logo;
    }
}

/**
 * Checks whether a specified status value is valid. If so, return the value. Otherwise returns "No status set"
 * @param { string } status
 * @returns { string }
 */
export function checkStatus(status) {
    if(status === null || status.length < 1) {
        return "No status set";
    } else {
        return status;
    }
}