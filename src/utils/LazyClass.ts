import { LazyType } from "../types/LazyType";

interface Constructable<T> {
  new (...args: unknown[]): T;
}

interface Prototyped<T> {
  prototype: T;
}

/**
 * Helps create an object from a class
 * https://silentium-lab.github.io/silentium/#/en/utils/lazy-class
 */
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
