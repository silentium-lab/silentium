"use strict";
exports.__esModule = true;
var LazyDestroyable_1 = require("../components/LazyDestroyable");
var vitest_1 = require("vitest");
vitest_1.test("LazyDestroyable.test", function () {
    var isDestroyed = false;
    var p = LazyDestroyable_1.lazyDestroyable(function () { return ({
        destroy: function () {
            isDestroyed = true;
        }
    }); });
    var inst = p.get();
    inst.destroy();
    vitest_1.expect(isDestroyed).toBe(true);
});
