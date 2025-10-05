"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var Local_1 = require("../base/Local");
var components_1 = require("../components");
vitest_1.describe("Local.test", function () {
    vitest_1.test("", function () {
        var src = components_1.late(1);
        var localSrc = Local_1.local(src.value);
        var g = vitest_1.vi.fn();
        var d = localSrc(g);
        vitest_1.expect(g).toHaveBeenCalledWith(1);
        src.give(2);
        vitest_1.expect(g).toHaveBeenCalledWith(2);
        d === null || d === void 0 ? void 0 : d();
        src.give(3);
        vitest_1.expect(g).toHaveBeenCalledWith(2);
    });
});
