import { EventType, DestroyableType, SourceType } from "../types";
import { isFilled, OwnerPool } from "../helpers";
import { late } from "../components/Late";
import { once } from "../components/Once";

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
export const shared = <T>(
  baseEv: EventType<T>,
  stateless = false,
): SourceType<T> & {
  pool: () => OwnerPool<T>;
  touched: () => void;
} & DestroyableType => {
  const ownersPool = new OwnerPool<T>();
  let lastValue: T | undefined;

  const calls = late();
  once(calls.event)(function SharedCallsUser() {
    baseEv(function SharedBaseUser(v) {
      lastValue = v;
      ownersPool.owner()(v);
    });
  });

  return {
    event: function SharedEvent(u) {
      calls.use(1);
      if (!stateless && isFilled(lastValue) && !ownersPool.has(u)) {
        u(lastValue);
      }
      ownersPool.add(u);
      return () => {
        ownersPool.remove(u);
      };
    },
    use: function SharedUser(value: T) {
      calls.use(1);
      lastValue = value;
      ownersPool.owner()(value);
    },
    touched() {
      calls.use(1);
    },
    pool() {
      return ownersPool;
    },
    destroy() {
      ownersPool.destroy();
    },
  };
};
