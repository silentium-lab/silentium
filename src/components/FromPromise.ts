import { EventType, EventUserType } from "../types";

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
export function FromPromise<T>(
  p: Promise<T>,
  errorOwner?: EventUserType,
): EventType<T> {
  return function FromPromiseEvent(user) {
    p.then(function FromPromiseThen(v) {
      user(v);
    }).catch(function FromPromiseCatch(e) {
      errorOwner?.(e);
    });
  };
}
