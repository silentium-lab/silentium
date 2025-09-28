import { DataTypeDestroyable } from "src/types/DataType";
import { DataType, DataUserType } from "../types";
import { all } from "./All";

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
export const fromEvent = <T>(
  emitterSrc: DataType<any>,
  eventNameSrc: DataType<string>,
  subscribeMethodSrc: DataType<string>,
  unsubscribeMethodSrc?: DataType<string>,
): DataTypeDestroyable<T> => {
  let lastU: DataUserType<T> | null = null;
  const handler = (v: T) => {
    if (lastU) {
      lastU(v);
    }
  };
  return (u) => {
    lastU = u;
    const a = all(emitterSrc, eventNameSrc, subscribeMethodSrc);
    a(([emitter, eventName, subscribe]) => {
      if (!emitter?.[subscribe]) {
        return;
      }
      emitter[subscribe](eventName, handler);
    });

    return () => {
      lastU = null;
      if (!unsubscribeMethodSrc) {
        return;
      }
      const a = all(emitterSrc, eventNameSrc, unsubscribeMethodSrc);
      a(([emitter, eventName, unsubscribe]) => {
        emitter[unsubscribe](eventName, handler);
      });
    };
  };
};
