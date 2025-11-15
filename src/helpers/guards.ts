import { DestroyableType, DestroyedType } from "types/DestroyableType";
import { MessageType } from "types/MessageType";
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
 * Checks that the object is an message
 */
export function isMessage<T>(o: T): o is T & MessageType {
  return (
    o !== null &&
    typeof o === "object" &&
    "to" in o &&
    typeof (o as any).to === "function"
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
