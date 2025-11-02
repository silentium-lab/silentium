import { ComponentClass } from "../base/ComponentClass";
import { describe, expect, test } from "vitest";
import { expectTypeOf } from "expect-type";
import { SourceType } from "../types/SourceType";
import { DestroyableType, EventType } from "../types/EventType";
import { TransportType } from "../types/TransportType";
import { Transport } from "../base/Transport";
import { Primitive } from "../components/Primitive";
import { Of } from "../base/Of";

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

  class TheEv2<T> implements EventType<T> {
    public constructor(private $base: EventType<string>) {}

    public event(): this {
      return this;
    }

    public destroy(): this {
      return this;
    }
  }

  test("multiplication component", () => {
    const Tst = ComponentClass(TheEv);

    const r = Primitive(Tst(Of("123")));

    expect(r.primitiveWithException()).toBe("test_123");
  });

  test("types of component class", () => {
    const Tst = ComponentClass(TheEv);

    expectTypeOf(Tst(Of("111"))).toEqualTypeOf<SourceType<string>>();
    expectTypeOf(Tst<number>(Of("111"))).toEqualTypeOf<EventType<number>>();
    expectTypeOf(Tst<SourceType<number>>(Of("111"))).toEqualTypeOf<
      SourceType<number>
    >();
  });

  test("destroy types", () => {
    const Tst = ComponentClass(TheEv2);
    const t = Tst(Of("111"));

    expectTypeOf(t).toEqualTypeOf<EventType<string> & DestroyableType>();
  });
});
