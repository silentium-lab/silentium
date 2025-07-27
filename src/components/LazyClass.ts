import { OwnerType } from "../types";

export const lazyClass =
  (constrFn: any) =>
  (...args: any[]) => {
    const inst = new constrFn(...args);
    return (o: OwnerType<any>) => {
      inst.value(o);
    };
  };
