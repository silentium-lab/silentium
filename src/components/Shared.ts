import { isFilled, onExecuted, OwnerPool } from "../helpers";
import { InformationType, OwnerType } from "../types";

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
export const shared = <T>(base: InformationType<T>) => {
  const ownersPool = new OwnerPool<T>();
  let lastValue: T | undefined;

  const executed = onExecuted(() => {
    const gp = ownersPool.owner();
    base((v) => {
      gp(v);
      lastValue = v;
    });
  });

  const i = (g: OwnerType<T>) => {
    executed();
    if (isFilled(lastValue) && !ownersPool.has(g)) {
      g(lastValue);
    }
    ownersPool.add(g);
    return () => {
      ownersPool.destroy();
    };
  };

  return [i, ownersPool] as const;
};

export const sharedStateless = <T>(base: InformationType<T>) => {
  const ownersPool = new OwnerPool<T>();

  const executed = onExecuted((g: OwnerType<T>) => {
    ownersPool.add(g);
    base(ownersPool.owner());
  });

  const i = (g: OwnerType<T>) => {
    executed(g);
    ownersPool.add(g);
    return () => {
      ownersPool.destroy();
    };
  };

  return [i, ownersPool] as const;
};
