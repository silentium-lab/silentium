import { Owner } from "../Owner";
import { Information } from "./Information";
import { OwnerPool } from "../utils/OwnerPool";

/**
 * An information info that helps multiple owners access
 * a single information info
 */
export const pool = <T>(base: Information<T>) => {
  const ownersPool = new OwnerPool<T>();
  let lastValue: T | undefined;

  const i = new Information<T>(
    (g) => {
      if (lastValue !== undefined && !ownersPool.has(g)) {
        g.give(lastValue);
      }
      ownersPool.add(g);

      return () => {
        ownersPool.destroy();
      };
    },
    "pool",
    false,
  );
  i.subInfo(base);

  i.executed(() => {
    const gp = ownersPool.owner();
    base.value(
      new Owner((v) => {
        gp.give(v);
        lastValue = v;
      }),
    );
  });

  return [i, ownersPool] as const;
};
