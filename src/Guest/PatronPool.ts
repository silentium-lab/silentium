import { source } from "../Source/Source";
import { give } from "./Guest";
import { GuestDisposableType } from "./GuestDisposable";
import PrioritySet from "../utils/PrioritySet";
import { patronPriority } from "./Patron";
import { DestroyableType } from "../types";
import { GuestObjectType, GuestType } from "../types/GuestType";
import { SourceType } from "../types/SourceType";

const poolSets = new Map<PoolType, PrioritySet<GuestObjectType>>();
const poolsOfInitiators = new Map<SourceType, PoolType>();
const subSources = new Map<SourceType, SourceType[]>();
const subSourcesReverse = new Map<SourceType, SourceType[]>();

const poolsChangeFns: (() => void)[] = [];
const notifyPoolsChange = () => {
  poolsChangeFns.forEach((fn) => fn());
};
const lastPatronPoolsStatistic = {
  poolsCount: 0,
  patronsCount: 0,
};

/**
 * Helps debug the application and detect issues with frozen pools
 * @url https://silentium-lab.github.io/silentium/#/utils/patron-pools-statistic
 * @deprecated will be removed
 */
export const patronPoolsStatistic = source<{
  poolsCount: number;
  patronsCount: number;
}>((g) => {
  give(lastPatronPoolsStatistic, g);
  poolsChangeFns.push(() => {
    let patronsCount = 0;
    poolSets.forEach((set) => {
      patronsCount += set.size;
    });
    lastPatronPoolsStatistic.poolsCount = poolSets.size;
    lastPatronPoolsStatistic.patronsCount = patronsCount;
    give(lastPatronPoolsStatistic, g);
  });
});

/**
 * Helps to connect source and subsource, needed to destroy all sub sources
 * when base source will be destroyed
 * @url https://silentium-lab.github.io/silentium/#/utils/sub-source
 * @deprecated will be removed
 */
export const subSource = <T>(
  subSource: SourceType,
  source: SourceType<T>,
): SourceType<T> => {
  if (!subSources.has(source)) {
    subSources.set(source, []);
  }

  if (!subSourcesReverse.has(subSource)) {
    subSourcesReverse.set(subSource, []);
  }

  subSources.get(source)?.push(subSource);
  subSourcesReverse.get(subSource)?.push(source);

  return subSource;
};

/**
 * Helps to define many sources of one sub source
 * @deprecated will be removed
 */
export const subSourceMany = <T>(
  subSourceSrc: SourceType<T>,
  sourcesSrc: SourceType[],
): SourceType<T> => {
  sourcesSrc.forEach((source) => {
    subSource(subSourceSrc, source);
  });
  return subSourceSrc;
};

/**
 * Helps to check what given source is destroyable
 * @url https://silentium-lab.github.io/silentium/#/utils/is-destroyable
 * @deprecated will be removed
 */
export const isDestroyable = (s: unknown): s is DestroyableType => {
  return (
    typeof s === "object" &&
    s !== null &&
    "destroy" in s &&
    typeof s.destroy === "function"
  );
};

/**
 * Helps to remove all pools of related initiators
 * @url https://silentium-lab.github.io/silentium/#/utils/destroy
 * @deprecated will be removed
 */
export const destroy = (...initiators: SourceType[]) => {
  initiators.forEach((initiator) => {
    if (isDestroyable(initiator)) {
      initiator.destroy();
    }
    const pool = poolsOfInitiators.get(initiator);
    pool?.destroy();
    const foundSubSources = subSources.get(initiator);
    subSources.delete(initiator);
    if (foundSubSources) {
      destroy(...foundSubSources);
    }
  });
};

/**
 * Allows destruction of the source chain starting from a subsource
 * and moving up to the main source. This behavior is useful when you need
 * to destroy the entire chain while having only a reference to the subsource.
 * @deprecated will be removed
 */
export const destroyFromSubSource = (...initiators: SourceType[]) => {
  initiators.forEach((initiator) => {
    destroy(initiator);
    const foundSources = subSourcesReverse.get(initiator);
    if (foundSources) {
      destroyFromSubSource(...foundSources);
    }
  });
};

/**
 * Returns all pools related to one patron
 * @url https://silentium-lab.github.io/silentium/#/utils/patron-pools
 * @deprecated will be removed
 */
export const patronPools = (patron: GuestObjectType) => {
  const pools: PoolType[] = [];
  poolSets.forEach((pool, poolInstance) => {
    if (pool.has(patron)) {
      pools.push(poolInstance);
    }
  });
  return pools;
};

/**
 * Removes patron from all existed pools
 * @url https://silentium-lab.github.io/silentium/#/utils/remove-patron-from-pools
 * @deprecated will be removed
 */
export const removePatronFromPools = (patron: GuestObjectType) => {
  if (patron === undefined) {
    throw new Error("removePatronFromPools didn't receive patron argument");
  }
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
  notifyPoolsChange();
};

/**
 * Checks what patron is connected with any pool
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron-in-pools
 * @deprecated will be removed
 */
export const isPatronInPools = (patron: GuestObjectType) => {
  if (patron === undefined) {
    throw new Error("isPatronInPools didn't receive patron argument");
  }
  let inPool = false;
  poolSets.forEach((pool) => {
    if (!inPool) {
      inPool = pool.has(patron);
    }
  });
  return inPool;
};

/**
 * Returns an array of all patrons in any pool
 * @url https://silentium-lab.github.io/silentium/#/utils/all-patrons
 * @deprecated will be removed
 */
export const allPatrons = () => {
  let patrons: GuestType[] = [];
  poolSets.forEach((pool) => {
    patrons = patrons.concat(Array.from(pool.values()));
  });
  return patrons;
};

/**
 * @deprecated will be removed
 */
export interface PoolType<T = any> extends GuestObjectType<T> {
  add(guest: GuestObjectType<T>): this;
  distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
  remove(patron: GuestObjectType<T>): this;
  size(): number;
  destroy(): void;
}

/**
 * Pool class helps to implement dispatching for patron about new values
 * what may appear in sources
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-pool
 * @deprecated will be removed
 */
export class PatronPool<T> implements PoolType<T> {
  // TODO remove
  private patrons: PrioritySet<GuestObjectType<T>>;

  public give: (value: T) => this;

  public constructor(private initiator: SourceType) {
    this.patrons = new PrioritySet<GuestObjectType<T>>();
    poolSets.set(this, this.patrons);
    poolsOfInitiators.set(this.initiator, this);
    const doReceive = (value: T) => {
      this.patrons.forEach((target) => {
        this.sendValueToGuest(value, target);
      });
    };
    this.give = (value: T) => {
      doReceive(value);
      return this;
    };
    notifyPoolsChange();
  }

  public size(): number {
    return this.patrons.size;
  }

  public add(shouldBePatron: GuestType<T>) {
    if (shouldBePatron === undefined) {
      throw new Error("PatronPool add method received nothing!");
    }
    if (
      typeof shouldBePatron !== "function" &&
      shouldBePatron.introduction &&
      shouldBePatron.introduction() === "patron"
    ) {
      this.patrons.add(shouldBePatron, patronPriority(shouldBePatron));
    }
    notifyPoolsChange();
    return this;
  }

  public remove(patron: GuestObjectType<T>) {
    this.patrons.delete(patron);
    notifyPoolsChange();
    return this;
  }

  public distribute(receiving: T, possiblePatron: GuestType<T>): this {
    this.add(possiblePatron);
    this.sendValueToGuest(receiving, possiblePatron);
    return this;
  }

  public destroy() {
    this.patrons.forEach((patron) => {
      this.remove(patron);
    });
    poolSets.delete(this);
    poolsOfInitiators.delete(this.initiator);
    notifyPoolsChange();
    return this;
  }

  private sendValueToGuest(value: T, guest: GuestType<T>) {
    const isDisposed = this.guestDisposed(value, guest);
    if (!isDisposed) {
      give(value, guest);
    }
    return this;
  }

  private guestDisposed(value: T, guest: GuestType<T>) {
    if ((guest as GuestDisposableType).disposed?.(value)) {
      this.remove(guest as GuestObjectType);
      return true;
    }
    return false;
  }
}
