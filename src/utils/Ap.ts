import { InformationDataType } from "src/types";
import { I, Information } from "../Information";

export const ap = <T>(
  fn: (...args: Information[]) => Information<T>,
  ...args: unknown[]
) => {
  return fn(
    ...args.map((arg) => {
      return arg instanceof Information
        ? arg
        : I(arg as InformationDataType<any>);
    }),
  );
};
