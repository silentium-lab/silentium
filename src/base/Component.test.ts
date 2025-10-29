import { Of } from "../base/Of";
import { Component } from "../base/Component";
import { All, Applied, Primitive } from "../components";
import { EventType } from "../types";
import { describe, expect, test } from "vitest";

describe("Component.test.ts", () => {
  test("multiplication component", () => {
    const TwoOnTwo = Component(function (
      $a: EventType<number>,
      $b: EventType<number>,
    ) {
      Applied(All($a, $b), ([a, b]) => a * b).event(this);
    });

    const r = Primitive(TwoOnTwo(Of(2), Of(4)));

    expect(r.primitiveWithException()).toBe(8);
  });
});
