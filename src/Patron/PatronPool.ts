import { source, SourceType } from "../Source/Source";
import { give, GuestObjectType, GuestType } from "../Guest/Guest";
import { GuestDisposableType } from "../Guest/GuestDisposable";

const poolSets = new Map<PoolType, Set<GuestObjectType>>();
const poolsOfInitiators = new Map<SourceType, PoolType>();
const subSources = new Map<SourceType, SourceType[]>();

const poolsChangeFns: (() => void)[] = [];
const notifyPoolsChange = () => {
  poolsChangeFns.forEach((fn) => fn());
};
const lastPatronPoolsStatistic = {
  poolsCount: 0,
  patronsCount: 0,
};
/**
 * Helps to debug application and see is it have problems with frozen pools
 * @url https://silentium-lab.github.io/silentium/#/utils/patron-pools-statistic
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
 */
export const subSource = (source: SourceType, subSource: SourceType) => {
  // sub sources can appear only on SourceObjectType
  if (source !== null && typeof source !== "object") {
    return;
  }

  if (!subSources.has(source)) {
    subSources.set(source, []);
  }

  subSources.get(source)?.push(subSource);
};

/**
 * Helps to define many sources of one sub source
 */
export const subSourceMany = (subSource: SourceType, sources: SourceType[]) => {
  sources.forEach((source) => {
    subSource(source, subSource);
  });
};

/**
 * Helps to remove all pools of related initiators
 * @url https://silentium-lab.github.io/silentium/#/utils/destroy
 */
export const destroy = (initiators: SourceType[]) => {
  initiators.forEach((initiator) => {
    const pool = poolsOfInitiators.get(initiator);
    pool?.destroy();
    const relatedInitiators = subSources.get(initiator);
    if (relatedInitiators) {
      destroy(relatedInitiators);
    }
  });
};

/**
 * Returns all pools related to one patron
 * @url https://silentium-lab.github.io/silentium/#/utils/patron-pools
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
 */
export const removePatronFromPools = (patron: GuestObjectType) => {
  if (patron === undefined) {
    throw new Error("removePatronFromPools didn't receive patron argument");
  }
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};

/**
 * Checks what patron is connected with any pool
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron-in-pools
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
 */
export class PatronPool<T> implements PoolType<T> {
  private patrons: Set<GuestObjectType<T>>;

  public give: (value: T) => this;

  public constructor(private initiator: SourceType) {
    this.patrons = new Set<GuestObjectType<T>>();
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
    if (!shouldBePatron) {
      throw new Error("PatronPool add method received nothing!");
    }
    if (
      typeof shouldBePatron !== "function" &&
      shouldBePatron.introduction &&
      shouldBePatron.introduction() === "patron"
    ) {
      this.patrons.add(shouldBePatron);
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
