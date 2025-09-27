"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var base_1 = require("../base");
var Filtered_1 = require("./Filtered");
vitest_1.test("Filtered._defaultValue.test", function () {
    var info = Filtered_1.filtered(base_1.of(11), function (v) { return v === 11; });
    var g1 = vitest_1.vitest.fn();
    info(g1);
    vitest_1.expect(g1).toBeCalledWith(11);
    var info2 = Filtered_1.filtered(base_1.of(11), function (v) { return v === 22; }, 33);
    var g2 = vitest_1.vitest.fn();
    info2(g2);
    vitest_1.expect(g2).toBeCalledWith(33);
});
