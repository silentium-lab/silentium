import { DestroyableType, EventType } from "../types/EventType";
import { TransportType } from "../types/TransportType";

export const isFilled = <T>(
  value?: T,
): value is Exclude<T, null | undefined> => {
  return value !== undefined && value !== null;
};

export function isEvent<T>(o: T): o is T & EventType {
  return (
    o !== null &&
    typeof o === "object" &&
    "event" in o &&
    typeof (o as any).event === "function"
  );
}

export function isDestroyable<T>(o: T): o is T & DestroyableType {
  return (
    o !== null &&
    typeof o === "object" &&
    "destroy" in o &&
    typeof (o as any).destroy === "function"
  );
}

export function isTransport<T>(o: T): o is T & TransportType {
  return (
    o !== null &&
    typeof o === "object" &&
    "use" in o &&
    typeof (o as any).use === "function"
  );
}
