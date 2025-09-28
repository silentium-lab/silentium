"use strict";
exports.__esModule = true;
var Applied_1 = require("../components/Applied");
var vitest_1 = require("vitest");
var testing_1 = require("../testing");
var Late_1 = require("./Late");
var SharedSource_1 = require("./SharedSource");
vitest_1.test("SharedSource._diagram.test", function () {
    var d = testing_1.diagram();
    var s = SharedSource_1.sharedSource(Late_1.late(), true);
    Applied_1.applied(s.value, String)(d.user);
    s.give(1);
    vitest_1.expect(d.toString()).toBe("1");
});
