import { EventTypeDestroyable } from "../types/EventType";
import { EventType, EventUserType } from "../types";
import { All } from "./All";

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
export function FromEvent<T>(
  emitterEv: EventType<any>,
  eventNameEv: EventType<string>,
  subscribeMethodEv: EventType<string>,
  unsubscribeMethodEv?: EventType<string>,
): EventTypeDestroyable<T> {
  let lastU: EventUserType<T> | null = null;
  const handler = function FromEventHandler(v: T) {
    if (lastU) {
      lastU(v);
    }
  };
  return function FromEventEvent(u) {
    lastU = u;
    const a = All(emitterEv, eventNameEv, subscribeMethodEv);
    a(function FromEventAllUser([emitter, eventName, subscribe]) {
      if (!emitter?.[subscribe]) {
        return;
      }
      emitter[subscribe](eventName, handler);
    });

    return function FromEventDestructor() {
      lastU = null;
      if (!unsubscribeMethodEv) {
        return;
      }
      const a = All(emitterEv, eventNameEv, unsubscribeMethodEv);
      a(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, handler);
      });
    };
  };
}
