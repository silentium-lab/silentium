"use strict";
exports.__esModule = true;
exports.lazyApplied = void 0;
/**
 * Lazy with applied function to its results
 */
exports.lazyApplied = function (baseLazy, applier) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return applier(baseLazy.apply(void 0, args));
    };
};
