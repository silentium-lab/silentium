import { DestroyableType, DestroyedType } from "types/DestroyableType";
import { MessageType } from "types/MessageType";

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
export function isMessage(o: unknown): o is MessageType {
  return (
    o !== null &&
    typeof o === "object" &&
    "then" in o &&
    typeof (o as any).then === "function"
  );
}

/**
 * Checks that the object is destroyable
 */
export function isDestroyable(o: unknown): o is DestroyableType {
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
export function isDestroyed(o: unknown): o is DestroyedType {
  return (
    o !== null &&
    typeof o === "object" &&
    "destroyed" in o &&
    typeof (o as any).destroyed === "function"
  );
}
