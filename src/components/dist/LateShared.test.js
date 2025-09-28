"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var LateShared_1 = require("../components/LateShared");
vitest_1.test("LateShared.test", function () {
    var l = LateShared_1.lateShared();
    var o = vitest_1.vi.fn();
    l.value(o);
    var o2 = vitest_1.vi.fn();
    l.value(o2);
    vitest_1.expect(o).not.toHaveBeenCalled();
    vitest_1.expect(o2).not.toHaveBeenCalled();
    l.give(1);
    vitest_1.expect(o).toHaveBeenCalledWith(1);
    vitest_1.expect(o2).toHaveBeenCalledWith(1);
    l.give(2);
    vitest_1.expect(o).toHaveBeenCalledWith(1);
    vitest_1.expect(o2).toHaveBeenCalledWith(1);
});
