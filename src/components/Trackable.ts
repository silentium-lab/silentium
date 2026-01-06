import { Void } from "base/Void";
import { Context } from "components/Context";

/**
 * Track creation and destruction of components
 * uses Context component to send messages
 * when created sends action=created
 * when destroyed sends action=destroyed
 */
export function Trackable(name: string, target: object) {
  Context("trackable", { name, action: "created" }).then(Void());
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (prop === "then") {
        Context("trackable", { name, action: "executed" }).then(Void());
      }
      if (prop === "destroy") {
        Context("trackable", { name, action: "destroyed" }).then(Void());
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}
