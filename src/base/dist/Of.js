"use strict";
exports.__esModule = true;
exports.of = void 0;
exports.of = function (v) {
    return function Of(u) {
        return u(v);
    };
};
