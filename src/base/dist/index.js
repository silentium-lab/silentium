"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./Destructor"), exports);
__exportStar(require("./Local"), exports);
var Of_1 = require("./Of");
__createBinding(exports, Of_1, "of");
var On_1 = require("./On");
__createBinding(exports, On_1, "on");
var Void_1 = require("./Void");
__createBinding(exports, Void_1, "_void");
