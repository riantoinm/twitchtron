"use strict";

/**
 * Calculates amount of time elapsed between specified stream start time and system's current time, returning time
 * formatted as HH:MM:SS. Returns "OFFLINE" is stream start time is null
 * @param { string } streamStartTime
 * @returns { string }
 */
export function getUptime(streamStartTime) {
    if(streamStartTime === null) {
        return "OFFLINE";
    } else {
        let startTime = null;
        if(isNaN(Date.parse(streamStartTime))) {
            return "00:00:00";
        } else {
            startTime = Date.parse(streamStartTime);
            let currentTime = Date.parse(new Date());
            let totalTime = currentTime - startTime;
            let x = totalTime / 1000;
            let seconds = Math.floor(x % 60);
            seconds = ("00" + seconds).slice(-2);
            x /= 60;
            let minutes = Math.floor(x % 60);
            minutes = ("00" + minutes).slice(-2);
            x /= 60;
            let hours = Math.floor(x);
            hours = ("00" + hours).slice(-2);
            return `${ hours }:${ minutes }:${ seconds }`;
        }
    }
}

/**
 * Converts time in total seconds specified to a time in the format HH:MM:SS. Returns "00:00:00" if total seconds is not
 * a number
 * @param { Number } totalSeconds
 * @returns { string }
 */
export function formatTimeFromSeconds(totalSeconds) {
    if(isNaN(totalSeconds)) {
        return "00:00:00";
    } else {
        let x = totalSeconds;
        let seconds = Math.floor(x % 60);
        seconds = ("00" + seconds).slice(-2);
        x /= 60;
        let minutes = Math.floor(x % 60);
        minutes = ("00" + minutes).slice(-2);
        x /= 60;
        let hours = Math.floor(x % 24);
        hours = ("00" + hours).slice(-2);

        return `${ hours }:${ minutes }:${ seconds }`;
    }
}

/**
 * Converts a utc date specified to a date in the format MM DD, YY. Returns "Jan 1, 1970" if an invalid date is supplied
 * @param { string } utcDate
 * @returns { string }
 */
export function formatDate(utcDate) {
    let myDate = new Date(utcDate);
    if(isNaN(myDate.getSeconds())) {
        return "Jan 1, 1970";
    } else {
        let month = __formatMonth(myDate.getMonth() + 1);
        let date = myDate.getDate();
        let year = myDate.getFullYear();

        return (`${ month } ${ date }, ${ year }`);
    }
}

/**
 * Converts the specified month number to its specified text, abbreviated to 3 characters
 * @param { Number } month
 * @returns { string }
 */
function __formatMonth(month) {
    switch(month) {
        case 1:
            return "Jan";
            break;
        case 2:
            return "Feb";
            break;
        case 3:
            return "Mar";
            break;
        case 4:
            return "Apr";
            break;
        case 5:
            return "May";
            break;
        case 6:
            return "Jun";
            break;
        case 7:
            return "Jul";
            break;
        case 8:
            return "Aug";
            break;
        case 9:
            return "Sep";
            break;
        case 10:
            return "Oct";
            break;
        case 11:
            return "Nov";
            break;
        case 12:
            return "Dec";
            break;
        default:
            break;
    }
}