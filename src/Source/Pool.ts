import { Guest } from "../Guest";
import { Source } from "../Source/Source";
import { GuestPool } from "../utils/GuestPool";

/**
 * Источник информации который помогает нескольким гостям обратиться
 * к одному источнику информации
 */
export const pool = <T>(baseSrc: Source<T>): Source<T> => {
  const guestsPool = new GuestPool<T>();
  let lastValue: T | undefined;
  let firstVisit = true;

  const src = new Source<T>((g) => {
    if (!firstVisit && lastValue !== undefined && !guestsPool.has(g)) {
      g.give(lastValue);
    }
    firstVisit = false;
    guestsPool.add(g);

    return () => {
      guestsPool.destroy();
      src.destroy();
    };
  }, "pool");
  baseSrc.subSource(src);

  src.executed(() => {
    const gp = guestsPool.guest();
    baseSrc.value(
      new Guest((v) => {
        gp.give(v);
        lastValue = v;
      }),
    );
  });

  return src;
};
