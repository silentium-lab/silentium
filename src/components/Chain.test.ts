import { describe, expect, test } from "vitest";
import { diagram } from "../testing";
import { chain } from "./Chain";
import { late } from "./Late";

describe("Chain.test", () => {
  test("event connected to over events", () => {
    const d = diagram();
    const triggerEv = late<string>("immediate");
    const valueEv = late<string>("the_value");

    const chainEv = chain(triggerEv.event, valueEv.event);
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
