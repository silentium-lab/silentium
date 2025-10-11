import { EventType } from "../types";

/**
 * Create local copy of source what can be destroyed
 */
export const local = <T>(baseEv: EventType<T>): EventType<T> => {
  return function LocalEvent(user) {
    let destroyed = false;
    const d = baseEv(function LocalBaseUser(v) {
      if (!destroyed) {
        user(v);
      }
    });
    return () => {
      destroyed = true;
      d?.();
    };
  };
};
