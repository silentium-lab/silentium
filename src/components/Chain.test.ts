import { describe, expect, test } from "vitest";
import { Diagram } from "../testing";
import { Chain } from "./Chain";
import { Late } from "./Late";

describe("Chain.test", () => {
  test("event connected to over events", () => {
    const d = Diagram();
    const triggerEv = Late<string>("immediate");
    const valueEv = Late<string>("the_value");

    const chainEv = Chain(triggerEv.event, valueEv.event);
    chainEv(d.user);

    expect(d.toString()).toBe("the_value");

    triggerEv.use("done");

    expect(d.toString()).toBe("the_value|the_value");

    valueEv.use("new_value");
    expect(d.toString()).toBe("the_value|the_value|new_value");

    triggerEv.use("done2");

    expect(d.toString()).toBe("the_value|the_value|new_value|new_value");
  });
});
