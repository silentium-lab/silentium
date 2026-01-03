import { describe, expect, test, vi } from "vitest";
import { Late } from "components/Late";
import { Shared } from "components/Shared";
import { Diagram } from "testing/Diagram";
import { Message } from "base/Message";

describe("Shared.test", () => {
  test("many users for one message", () => {
    const d = Diagram();
    const l = Late<number>(1);
    const s = Shared(l);

    s.then((v) => {
      d.resolver(`g1_${v}`);
    });
    s.then((v) => {
      d.resolver(`g2_${v}`);
    });

    expect(d.toString()).toBe("g1_1|g2_1");

    l.use(2);
    l.use(3);
    l.use(4);

    expect(d.toString()).toBe("g1_1|g2_1|g1_2|g2_2|g1_3|g2_3|g1_4|g2_4");

    s.destroy();
  });

  test("chain method forwards messages to shared", () => {
    const d = Diagram();
    const s = Shared(Late<number>());
    const m = Late<number>();

    s.then((v) => {
      d.resolver(`shared_${v}`);
    });

    s.chain(m);

    m.use(42);
    m.use(99);

    expect(d.toString()).toBe("shared_42|shared_99");

    s.destroy();
  });

  test("check what shared can accept one MessageSource argument", async () => {
    const $l = Late(1);
    const $sl = Shared($l);

    $sl.use(2);

    const v = await $l;
    expect(v).toBe(2);
  });

  test("checks if shared can't emit two messages from one base when using and resolving base", () => {
    const $l = Late();
    const $sl = Shared($l);

    $l.use(2);
    let count = 0;
    $sl.then(() => {
      count += 1;
    });

    expect(count).toBe(1);
  });

  test("destroy calls destroy on base message if base is destroyable", () => {
    const destroyMock = vi.fn();
    const baseMock = {
      then: vi.fn(),
      catch: vi.fn(),
      destroy: destroyMock,
    };
    const s = Shared(baseMock);

    s.destroy();

    expect(destroyMock).toHaveBeenCalledTimes(1);
  });

  test("destroy does not call destroy on base message if base is not destroyable", () => {
    const baseMock = {
      then: vi.fn(),
      catch: vi.fn(),
      // no destroy method
    };
    const s = Shared(baseMock);

    s.destroy();

    // No assertion needed, just ensure no error and destroy not called
  });

  test("many resolvers of shared don't touch executor", () => {
    let invokers = 0;
    const $m = Message((r) => {
      invokers += 1;
      r(123);
    });
    const id = () => {};

    $m.then(id).then(id).then(id);

    const shared = Shared($m);
    shared.then(id).then(id).then(id);
    shared.then((v) => console.log("Shared result = ", v));

    expect(invokers).toBe(4);
  });
});
