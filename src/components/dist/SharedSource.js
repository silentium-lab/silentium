"use strict";
exports.__esModule = true;
exports.sharedSource = void 0;
var Shared_1 = require("../components/Shared");
exports.sharedSource = function (baseSrc, stateless) {
    if (stateless === void 0) { stateless = false; }
    var sharedSrc = Shared_1.shared(baseSrc.value, stateless);
    return {
        value: function (u) {
            sharedSrc.value(u);
        },
        give: function (v) {
            baseSrc.give(v);
        }
    };
};
