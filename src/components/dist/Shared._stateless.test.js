"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var Late_1 = require("./Late");
var Shared_1 = require("./Shared");
vitest_1.test("Shared._stateless.test", function () {
    var l = Late_1.late(1);
    var s = Shared_1.shared(l.value, true);
    var g = vitest_1.vi.fn();
    s.value(g);
    l.give(1);
    vitest_1.expect(g).toBeCalledWith(1);
    var g2 = vitest_1.vi.fn();
    s.value(g2);
    vitest_1.expect(g2).not.toHaveBeenCalled();
    l.give(2);
    vitest_1.expect(g).toBeCalledWith(2);
    vitest_1.expect(g2).toBeCalledWith(2);
});
