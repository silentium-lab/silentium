"use strict";
exports.__esModule = true;
exports.lateShared = void 0;
var Late_1 = require("../components/Late");
var SharedSource_1 = require("../components/SharedSource");
exports.lateShared = function (theValue) {
    var src = SharedSource_1.sharedSource(Late_1.late(theValue));
    return {
        value: src.value,
        give: src.give
    };
};
