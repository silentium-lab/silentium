import { describe, expect, test, vi } from "vitest";
import { Empty, Nothing } from "components/Empty";
import { Of } from "base/Of";

describe("Empty.test", () => {
  test("empty emits true when Nothing is passed", () => {
    const emp = Empty(Of(Nothing));

    const spyMessage = vi.fn();
    emp.message().then(spyMessage);

    expect(spyMessage).not.toHaveBeenCalled();

    const spyEmpty = vi.fn();
    emp.empty().then(spyEmpty);

    expect(spyEmpty).toHaveBeenCalledWith(true);
  });

  test("empty does not emit when value is passed", () => {
    const emp = Empty(Of(42));

    const spyMessage = vi.fn();
    emp.message().then(spyMessage);

    expect(spyMessage).toHaveBeenCalledWith(42);

    const spyEmpty = vi.fn();
    emp.empty().then(spyEmpty);

    expect(spyEmpty).not.toHaveBeenCalled();
  });
});
