"use strict";
exports.__esModule = true;
exports.lazyDestroyable = void 0;
/**
 * Lazy what can be destroyed
 */
exports.lazyDestroyable = function (baseLazy) {
    var instances = [];
    return {
        get: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var inst = baseLazy.apply(void 0, args);
            instances.push(inst);
            return inst;
        },
        destroy: function () {
            instances.forEach(function (i) { return i.destroy(); });
        }
    };
};
