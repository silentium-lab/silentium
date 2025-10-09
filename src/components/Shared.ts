import { DataType, DestroyableType, SourceType } from "../types";
import { isFilled, OwnerPool } from "../helpers";
import { late } from "../components/Late";
import { once } from "../components/Once";

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
export const shared = <T>(
  baseSrc: DataType<T>,
  stateless = false,
): SourceType<T> & { pool: () => OwnerPool<T> } & DestroyableType => {
  const ownersPool = new OwnerPool<T>();
  let lastValue: T | undefined;

  const calls = late();
  once(calls.value)(function SharedCallsUser() {
    baseSrc(function SharedBaseUser(v) {
      lastValue = v;
      ownersPool.owner()(v);
    });
  });

  return {
    value: function Shared(u) {
      calls.give(1);
      if (!stateless && isFilled(lastValue) && !ownersPool.has(u)) {
        u(lastValue);
      }
      ownersPool.add(u);
      return () => {
        ownersPool.remove(u);
      };
    },
    give: function SharedUser(value: T) {
      lastValue = value;
      ownersPool.owner()(value);
    },
    pool() {
      return ownersPool;
    },
    destroy() {
      ownersPool.destroy();
    },
  };
};
