import { Context } from "components/Context";

/**
 * Track creation and destruction of components
 * uses Context component to send messages
 * when created sends action=created
 * when destroyed sends action=destroyed
 */
export function Trackable(name: string, target: object) {
  Context({
    transport: "trackable",
    params: {
      name,
      action: "created",
    },
  }).then(() => {});
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (prop === "destroy") {
        Context({
          transport: "trackable",
          params: {
            name,
            action: "destroyed",
          },
        }).then(() => {});
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}
