"use strict";
exports.__esModule = true;
var isFilled_1 = require("../helpers/isFilled");
var vitest_1 = require("vitest");
var expect_type_1 = require("expect-type");
vitest_1.test("isFilled.test", function () {
    expect_type_1.expectTypeOf(isFilled_1.isFilled().guards.toBeString());
});
