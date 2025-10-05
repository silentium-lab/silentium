"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var Destructor_1 = require("../base/Destructor");
var Of_1 = require("../base/Of");
vitest_1.describe("Destructor.test", function () {
    vitest_1.test("Destructor always exists", function () {
        var src = Destructor_1.destructor(Of_1.of("1"));
        var user = vitest_1.vi.fn();
        var d = src.value(user);
        vitest_1.expect(user).toHaveBeenCalledWith("1");
        vitest_1.expect(typeof d).toBe("function");
    });
    vitest_1.test("Destructor can be grabbed", function () {
        var destructorUser = vitest_1.vi.fn();
        var d = function () { };
        d.theName = "destructor";
        var src = Destructor_1.destructor(function (user) {
            user("2");
            return d;
        }, destructorUser);
        var user = vitest_1.vi.fn();
        src.value(user);
        vitest_1.expect(user).toHaveBeenCalledWith("2");
        vitest_1.expect(destructorUser).toHaveBeenCalledWith(d);
    });
});
