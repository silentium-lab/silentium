import { PersonalType } from "./Personal";

interface Constructable<T> {
  new (...args: unknown[]): T;
}

interface Prototyped<T> {
  prototype: T;
}

export const personalClass = <T>(
  constructorFn: Prototyped<T>,
  modules: Record<string, unknown> = {},
): PersonalType<T> => {
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
