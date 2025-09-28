import { DataType } from "../types";

export const primitive = <T>(
  baseSrc: DataType<T>,
  theValue: T | null = null,
) => {
  baseSrc((v) => {
    theValue = v;
  });

  return {
    [Symbol.toPrimitive]() {
      return theValue;
    },
    primitive() {
      return theValue;
    },
  };
};
