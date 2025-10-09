import { DataType } from "../types";

export const primitive = <T>(
  baseSrc: DataType<T>,
  theValue: T | null = null,
) => {
  baseSrc(function PrimitiveBaseUser(v) {
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
};
