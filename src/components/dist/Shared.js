"use strict";
exports.__esModule = true;
exports.shared = void 0;
var helpers_1 = require("../helpers");
var Late_1 = require("../components/Late");
var Once_1 = require("../components/Once");
/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
exports.shared = function (baseSrc, stateless) {
    if (stateless === void 0) { stateless = false; }
    var ownersPool = new helpers_1.OwnerPool();
    var lastValue;
    var calls = Late_1.late();
    Once_1.once(calls.value)(function () {
        baseSrc(function (v) {
            lastValue = v;
            ownersPool.owner()(v);
        });
    });
    return {
        value: function (u) {
            calls.give(1);
            if (!stateless && helpers_1.isFilled(lastValue) && !ownersPool.has(u)) {
                u(lastValue);
            }
            ownersPool.add(u);
            return function () {
                ownersPool.remove(u);
            };
        },
        give: function (value) {
            lastValue = value;
            ownersPool.owner()(value);
        },
        pool: function () {
            return ownersPool;
        },
        destroy: function () {
            ownersPool.destroy();
        }
    };
};
