import { Diagram } from "../testing";
import { Late } from "../components/Late";
import { SharedSource } from "../components/SharedSource";
import { describe, expect, test, vi } from "vitest";
import { Applied } from "../components/Applied";
import { Transport } from "../base";

describe("SharedSource.test", () => {
  test("event with many transports", () => {
    const s = SharedSource(Late<number>(1), true);

    const g = vi.fn();
    s.event(Transport(g));
    s.use(1);

    expect(g).toBeCalledWith(1);

    const g2 = vi.fn();
    s.event(Transport(g2));
    expect(g2).not.toHaveBeenCalled();

    s.use(2);

    expect(g).toBeCalledWith(2);
    expect(g2).toBeCalledWith(2);
  });

  test("with diagram", () => {
    const d = Diagram();
    const s = SharedSource(Late<number>(), true);

    Applied(s, String).event(d.transport);

    s.use(1);

    expect(d.toString()).toBe("1");
  });
});
