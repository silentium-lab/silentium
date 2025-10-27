import { describe, expect, test } from "vitest";
import { Diagram } from "../testing";
import { Chain } from "./Chain";
import { Late } from "./Late";

describe("Chain.test", () => {
  test("event connected to over events", () => {
    const d = Diagram();
    const $trigger = Late<string>("immediate");
    const $value = Late<string>("the_value");

    const $chain = Chain($trigger, $value);
    $chain.event(d.transport);

    expect(d.toString()).toBe("the_value");

    $trigger.use("done");

    expect(d.toString()).toBe("the_value|the_value");

    $value.use("new_value");
    expect(d.toString()).toBe("the_value|the_value|new_value");

    $trigger.use("done2");

    expect(d.toString()).toBe("the_value|the_value|new_value|new_value");
  });
});
