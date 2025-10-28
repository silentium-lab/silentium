import { DestroyableType, EventType, TransportType } from "../types";

/**
 * Create a function component that
 * will emit an event with specified arguments
 * and specified type
 */
export function Component<T, P extends Array<any>>(
  executor: (this: TransportType<T>, ...args: P) => void | (() => void),
): (...args: P) => EventType<T> & DestroyableType {
  return (...args) => {
    let destructor: void | (() => void);
    return {
      event(transport) {
        destructor = executor.call(transport, ...args);
        return this;
      },
      destroy() {
        if (destructor !== undefined) {
          destructor();
        }
        return this;
      },
    };
  };
}
