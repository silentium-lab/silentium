import { InformationType } from "../types";

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
export const fromEvent = (
  emitter: any,
  eventName: string,
  subscribeMethod: string,
  unsubscribeMethod?: string,
): InformationType => {
  return (o) => {
    const handler = (...args: any[]) => {
      o(args);
    };
    emitter[subscribeMethod](eventName, handler);
    return () => {
      if (unsubscribeMethod !== undefined) {
        emitter[unsubscribeMethod](eventName, handler);
      }
    };
  };
};
