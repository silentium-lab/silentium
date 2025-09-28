"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var base_1 = require("../base");
var Chain_1 = require("../components/Chain");
var Late_1 = require("../components/Late");
var LazyApplied_1 = require("../components/LazyApplied");
vitest_1.test("LazyApplied.test", function () {
    var l = Late_1.late();
    var lazyInf = LazyApplied_1.lazyApplied(function (v) { return v; }, function (i) { return Chain_1.chain(l.value, i); });
    var inf = lazyInf(base_1.of(1));
    var g = vitest_1.vi.fn();
    inf(g);
    vitest_1.expect(g).not.toHaveBeenCalled();
    l.give(1);
    vitest_1.expect(g).toHaveBeenCalledTimes(1);
    vitest_1.expect(g).toBeCalledWith(1);
});
