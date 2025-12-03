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
    $chain.then(d.resolver);

    expect(d.toString()).toBe("the_value");

    $value.use("second_value");
    $trigger.use("done");

    expect(d.toString()).toBe("the_value|second_value");

    $value.use("third_value");
    expect(d.toString()).toBe("the_value|second_value|third_value");

    $trigger.use("done2");
    $trigger.use("done3");
    $trigger.use("done4");

    expect(d.toString()).toBe("the_value|second_value|third_value");
  });
});
