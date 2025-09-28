"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var testing_1 = require("../testing");
var Late_1 = require("./Late");
var Shared_1 = require("./Shared");
vitest_1.test("Shared.test", function () {
    var d = testing_1.diagram();
    var l = Late_1.late(1);
    var s = Shared_1.shared(l.value);
    s.value(function (v) {
        d.user("g1_" + v);
    });
    s.value(function (v) {
        d.user("g2_" + v);
    });
    vitest_1.expect(d.toString()).toBe("g1_1|g2_1");
    l.give(2);
    l.give(3);
    l.give(4);
    vitest_1.expect(d.toString()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");
    s.destroy();
    vitest_1.expect(s.pool().size()).toBe(0);
});
