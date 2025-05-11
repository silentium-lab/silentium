import { LazyType } from "./Lazy";

interface Constructable<T> {
  new (...args: unknown[]): T;
}

interface Prototyped<T> {
  prototype: T;
}

export const lazyClass = <T>(
  constructorFn: Prototyped<T>,
  modules: Record<string, unknown> = {},
): LazyType<T> => {
  if (constructorFn === undefined) {
    throw new Error("PrivateClass didn't receive constructorFn argument");
  }

  return {
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT {
      return new (constructorFn as Constructable<T>)(
        ...args,
        modules,
      ) as CT extends null ? T : CT;
    },
  };
};
