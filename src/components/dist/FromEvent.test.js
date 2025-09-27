"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var base_1 = require("../base");
var FromEvent_1 = require("./FromEvent");
vitest_1.test("FromEvent.test", function () {
    var unsubscribed = false;
    var emitter = {
        on: function (name, h) {
            h(name + "123");
        },
        off: function () {
            unsubscribed = true;
        }
    };
    var i = FromEvent_1.fromEvent(base_1.of(emitter), base_1.of("click"), base_1.of("on"), base_1.of("off"));
    var o = vitest_1.vi.fn();
    i.value(o);
    vitest_1.expect(o).toBeCalledWith("click123");
    i.destroy();
    vitest_1.expect(unsubscribed).toBe(true);
});
