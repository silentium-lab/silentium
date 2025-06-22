import { Guest } from "../Guest";
import { Source } from "../Source/Source";
import { GuestPool } from "../utils/GuestPool";

/**
 * An information source that helps multiple guests access
 * a single information source
 */
export const pool = <T>(baseSrc: Source<T>) => {
  const guestsPool = new GuestPool<T>();
  let lastValue: T | undefined;

  const src = new Source<T>(
    (g) => {
      if (lastValue !== undefined && !guestsPool.has(g)) {
        g.give(lastValue);
      }
      guestsPool.add(g);

      return () => {
        guestsPool.destroy();
      };
    },
    "pool",
    false,
  );
  src.subSource(baseSrc);

  src.executed(() => {
    const gp = guestsPool.guest();
    baseSrc.value(
      new Guest((v) => {
        gp.give(v);
        lastValue = v;
      }),
    );
  });

  return [src, guestsPool] as const;
};
