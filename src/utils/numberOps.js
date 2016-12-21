"use strict";

/**
 * Converts a number to a string with commas added in appropriate locations
 * @param { Number } val
 * @returns { string }
 */
export function numberWithCommas(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}