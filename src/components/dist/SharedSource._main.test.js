"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var SharedSource_1 = require("../components/SharedSource");
var Late_1 = require("./Late");
vitest_1.test("SharedSource._main.test", function () {
    var s = SharedSource_1.sharedSource(Late_1.late(1), true);
    var g = vitest_1.vi.fn();
    s.value(g);
    s.give(1);
    vitest_1.expect(g).toBeCalledWith(1);
    var g2 = vitest_1.vi.fn();
    s.value(g2);
    vitest_1.expect(g2).not.toHaveBeenCalled();
    s.give(2);
    vitest_1.expect(g).toBeCalledWith(2);
    vitest_1.expect(g2).toBeCalledWith(2);
});
