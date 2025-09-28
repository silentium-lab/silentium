"use strict";
exports.__esModule = true;
exports.once = void 0;
/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
exports.once = function (baseSrc) {
    return function (u) {
        var isFilled = false;
        baseSrc(function (v) {
            if (!isFilled) {
                isFilled = true;
                u(v);
            }
        });
    };
};
