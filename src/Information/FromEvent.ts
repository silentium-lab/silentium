import { I } from "../Information";

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
export const fromEvent = <T extends []>(
  emitter: any,
  eventName: string,
  subscribeMethod: string,
  unsubscribeMethod?: string,
) => {
  return I((o) => {
    const handler = (...args: T) => {
      o.give(args);
    };
    emitter[subscribeMethod](eventName, handler);
    return () => {
      if (unsubscribeMethod !== undefined) {
        emitter[unsubscribeMethod](eventName, handler);
      }
    };
  });
};
