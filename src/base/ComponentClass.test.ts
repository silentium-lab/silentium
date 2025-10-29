import { ComponentClass } from "../base/ComponentClass";
import { describe, expect, test } from "vitest";
import { expectTypeOf } from "expect-type";
import { EventType, SourceType, TransportType } from "../types";
import { Of, Transport } from "../base";
import { Primitive } from "../components";

describe("ComponentClass.test", () => {
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
    const Tst = ComponentClass(TheEv<string>);

    const r = Primitive(Tst(Of("123")));

    expect(r.primitiveWithException()).toBe("test_123");
  });

  test("types of component class", () => {
    const Tst = ComponentClass(TheEv);

    expectTypeOf(Tst(Of("111"))).toEqualTypeOf<TheEv<unknown>>();
    expectTypeOf(Tst<number>(Of("111"))).toEqualTypeOf<EventType<number>>();
    expectTypeOf(Tst<SourceType<number>>(Of("111"))).toEqualTypeOf<
      SourceType<number>
    >();
  });
});
