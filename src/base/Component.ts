import { DestroyableType, EventType, EventTypeValue } from "types/EventType";
import { TransportType } from "types/TransportType";

/**
 * Create a function component that
 * will emit an event with specified arguments
 * and specified type
 */
export function Component<T, P extends Array<any>>(
  executor: (
    this: TransportType<P[0] extends EventType ? EventTypeValue<P[0]> : T>,
    ...args: P
  ) => void | (() => void),
): (
  ...args: P
) => (P[0] extends EventType ? EventType<EventTypeValue<P[0]>> : EventType<T>) &
  DestroyableType {
  return (...args) => {
    let destructor: void | (() => void);
    return {
      event(
        transport: TransportType<
          P[0] extends EventType ? EventTypeValue<P[0]> : T
        >,
      ) {
        destructor = executor.call(transport, ...args);
        return this;
      },
      destroy() {
        if (destructor !== undefined) {
          destructor();
        }
        return this;
      },
    } as any;
  };
}
