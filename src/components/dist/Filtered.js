"use strict";
exports.__esModule = true;
exports.filtered = void 0;
/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
exports.filtered = function (baseSrc, predicate, defaultValue) {
    return function (u) {
        baseSrc(function (v) {
            if (predicate(v)) {
                u(v);
            }
            else if (defaultValue !== undefined) {
                u(defaultValue);
            }
        });
    };
};
