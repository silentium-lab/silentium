import { ComponentClass } from "../base/ComponentClass";
import { describe, expect, test } from "vitest";
import { EventType, SourceType, TransportType } from "../types";
import { Of, Transport } from "../base";
import { Primitive } from "../components";

describe("Component.test.ts", () => {
  class TheEv<T> implements SourceType<T> {
    public constructor(private $base: EventType<string>) {}

    public event(user: TransportType<T, null>): this {
      this.$base.event(
        Transport((v) => {
          user.use(`test_${v}` as T);
        }),
      );
      return this;
    }

    public use(): this {
      return this;
    }
  }

  test("multiplication component", () => {
    const Tst = ComponentClass(TheEv);

    const r = Primitive(Tst(Of("123")));

    expect(r.primitiveWithException()).toBe("test_123");
  });
});
