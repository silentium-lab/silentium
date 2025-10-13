import { Diagram } from "../testing";
import { Late } from "../components/Late";
import { SharedSource } from "../components/SharedSource";
import { describe, expect, test, vi } from "vitest";
import { Applied } from "../components/Applied";

describe("SharedSource.test", () => {
  test("event with many users", () => {
    const s = SharedSource(Late<number>(1), true);

    const g = vi.fn();
    s.event(g);
    s.use(1);

    expect(g).toBeCalledWith(1);

    const g2 = vi.fn();
    s.event(g2);
    expect(g2).not.toHaveBeenCalled();

    s.use(2);

    expect(g).toBeCalledWith(2);
    expect(g2).toBeCalledWith(2);
  });

  test("with diagram", () => {
    const d = Diagram();
    const s = SharedSource(Late<number>(), true);

    Applied(s.event, String)(d.user);

    s.use(1);

    expect(d.toString()).toBe("1");
  });
});
