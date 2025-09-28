"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var base_1 = require("../base");
var LazyArgs_1 = require("../components/LazyArgs");
vitest_1.test("LazyApplied.test", function () {
    var g = vitest_1.vi.fn();
    var p = LazyArgs_1.lazyArgs(function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return base_1.of(a);
    }, [2, 3], 2);
    p(1)(g);
    vitest_1.expect(g).toHaveBeenLastCalledWith([1, undefined, 2, 3]);
    p(1, 2)(g);
    vitest_1.expect(g).toHaveBeenLastCalledWith([1, 2, 2, 3]);
    p(1, 9, 11)(g);
    vitest_1.expect(g).toHaveBeenLastCalledWith([1, 9, 2, 3]);
});
