import { I } from "../Information";

/**
 * When receiving a reference to a function expecting a callback, the component
 * creates its own callback, and the data received in this callback
 * will become the value of the information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-callback
 */
export const fromCallback = <T>(waitForCb: (cb: (v: T) => any) => unknown) => {
  return I((o) => {
    waitForCb((v) => {
      o.give(v);
    });
  });
};
