import { EventType } from "../types";

export function Primitive<T>(baseEv: EventType<T>, theValue: T | null = null) {
  baseEv(function PrimitiveBaseUser(v) {
    theValue = v;
  });

  return {
    [Symbol.toPrimitive]() {
      return theValue;
    },
    primitive() {
      return theValue;
    },
    primitiveWithException() {
      if (theValue === null) {
        throw new Error("Primitive value is null");
      }
      return theValue;
    },
  };
}
