import { Of } from "base/Of";
import { Component } from "base/Component";
import { describe, expect, test } from "vitest";
import { EventType } from "types/EventType";
import { Applied } from "components/Applied";
import { All } from "components/All";
import { Primitive } from "components/Primitive";

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
