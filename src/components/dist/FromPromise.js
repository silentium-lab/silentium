"use strict";
exports.__esModule = true;
exports.fromPromise = void 0;
/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
exports.fromPromise = function (p, errorOwner) {
    return function (u) {
        p.then(function (v) {
            u(v);
        })["catch"](function (e) {
            errorOwner === null || errorOwner === void 0 ? void 0 : errorOwner(e);
        });
    };
};
