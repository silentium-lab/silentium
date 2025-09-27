"use strict";
exports.__esModule = true;
exports.fromEvent = void 0;
var All_1 = require("./All");
/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
exports.fromEvent = function (emitterSrc, eventNameSrc, subscribeMethodSrc, unsubscribeMethodSrc) {
    var lastU = null;
    var handler = function (v) {
        if (lastU) {
            lastU(v);
        }
    };
    return {
        value: function (u) {
            lastU = u;
            var a = All_1.all(emitterSrc, eventNameSrc, subscribeMethodSrc);
            a(function (_a) {
                var emitter = _a[0], eventName = _a[1], subscribe = _a[2];
                if (!(emitter === null || emitter === void 0 ? void 0 : emitter[subscribe])) {
                    return;
                }
                emitter[subscribe](eventName, handler);
            });
        },
        destroy: function () {
            if (!unsubscribeMethodSrc) {
                return;
            }
            var a = All_1.all(emitterSrc, eventNameSrc, unsubscribeMethodSrc);
            a(function (_a) {
                var emitter = _a[0], eventName = _a[1], unsubscribe = _a[2];
                emitter[unsubscribe](eventName, handler);
            });
        }
    };
};
