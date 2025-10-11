import { diagram } from "../testing";
import { late } from "../components/Late";
import { sharedSource } from "../components/SharedSource";
import { describe, expect, test, vi } from "vitest";
import { applied } from "../components/Applied";

describe("SharedSource.test", () => {
  test("event with many users", () => {
    const s = sharedSource(late<number>(1), true);

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
    const d = diagram();
    const s = sharedSource(late<number>(), true);

    applied(s.event, String)(d.user);

    s.use(1);

    expect(d.toString()).toBe("1");
  });
});
