"use strict";
exports.__esModule = true;
exports.local = void 0;
/**
 * Create local copy of source what can be destroyed
 */
exports.local = function (baseSrc) {
    return function Local(user) {
        var destroyed = false;
        var d = baseSrc(function (v) {
            if (!destroyed) {
                user(v);
            }
        });
        return function () {
            destroyed = true;
            d === null || d === void 0 ? void 0 : d();
        };
    };
};
