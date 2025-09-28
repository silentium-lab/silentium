"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var Late_1 = require("./Late");
var Once_1 = require("./Once");
vitest_1.test("Once._main.test", function () {
    var l = Late_1.late(123);
    var info = Once_1.once(l.value);
    var g = vitest_1.vitest.fn();
    info(g);
    l.give(321);
    vitest_1.expect(g).toBeCalledWith(123);
});
