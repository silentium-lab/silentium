import { DestroyableType, DestroyedType } from "types/DestroyableType";
import { EventType } from "types/EventType";
import { TransportType } from "types/TransportType";

/**
 * Checks that the value is neither undefined nor null
 */
export const isFilled = <T>(
  value?: T,
): value is Exclude<T, null | undefined> => {
  return value !== undefined && value !== null;
};

/**
 * Checks that the object is an event
 */
export function isEvent<T>(o: T): o is T & EventType {
  return (
    o !== null &&
    typeof o === "object" &&
    "event" in o &&
    typeof (o as any).event === "function"
  );
}

/**
 * Checks that the object is destroyable
 */
export function isDestroyable<T>(o: T): o is T & DestroyableType {
  return (
    o !== null &&
    typeof o === "object" &&
    "destroy" in o &&
    typeof (o as any).destroy === "function"
  );
}

/**
 * Checks that the object can indicate whether it has been destroyed or not
 */
export function isDestroyed<T>(o: T): o is T & DestroyedType {
  return (
    o !== null &&
    typeof o === "object" &&
    "destroyed" in o &&
    typeof (o as any).destroy === "function"
  );
}

/**
 * Checks that the object is a transport
 */
export function isTransport<T>(o: T): o is T & TransportType {
  return (
    o !== null &&
    typeof o === "object" &&
    "use" in o &&
    typeof (o as any).use === "function"
  );
}
