import { describe, expect, test } from "vitest";
import { Chain } from "components/Chain";
import { Late } from "components/Late";
import { Diagram } from "testing/Diagram";

describe("Chain.test", () => {
  test("message connected to over messages", () => {
    const d = Diagram();
    const $trigger = Late<string>("immediate");
    const $value = Late<string>("the_value");

    const $chain = Chain($trigger, $value);
    $chain.to(d.transport);

    expect(d.toString()).toBe("the_value");

    $trigger.use("done");

    expect(d.toString()).toBe("the_value|the_value");

    $value.use("new_value");
    expect(d.toString()).toBe("the_value|the_value|new_value");

    $trigger.use("done2");

    expect(d.toString()).toBe("the_value|the_value|new_value|new_value");
  });
});
