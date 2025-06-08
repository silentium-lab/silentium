const valueExact = (source2, guest) => {
  if (source2 === void 0 || source2 === null) {
    throw new Error("value didn't receive source argument");
  }
  if (guest === void 0 || source2 === null) {
    throw new Error("value didn't receive guest argument");
  }
  if (typeof source2 === "function") {
    source2(guest);
  } else if (typeof source2 === "object" && "value" in source2 && typeof source2.value === "function") {
    source2.value(guest);
  } else {
    give(source2, guest);
  }
  return source2;
};
const value = (source2, guest) => {
  if (source2 === void 0 || source2 === null) {
    throw new Error("value didn't receive source argument");
  }
  if (guest === void 0 || source2 === null) {
    throw new Error("value didn't receive guest argument");
  }
  if (Array.isArray(guest)) {
    guest.forEach((currentGuest) => {
      valueExact(source2, currentGuest);
    });
  } else {
    valueExact(source2, guest);
  }
  return source2;
};
const isSource = (mbSource) => {
  if (mbSource !== null && typeof mbSource === "object" && "value" in mbSource && typeof mbSource.value === "function") {
    return true;
  }
  return mbSource !== null && mbSource !== void 0;
};
const source = (source2) => {
  if (source2 === void 0) {
    throw new Error("Source constructor didn't receive executor function");
  }
  return (guest) => {
    value(source2, guest);
  };
};

const give = (data, guest2) => {
  if (data === void 0) {
    throw new Error("give didn't receive data argument");
  }
  if (guest2 === void 0) {
    return source(data);
  }
  if (typeof guest2 === "function") {
    guest2(data);
  } else {
    guest2.give(data);
  }
  return guest2;
};
const isGuest = (mbGuest) => {
  if (mbGuest === void 0) {
    throw new Error("isGuest didnt receive mbGuest argument");
  }
  return typeof mbGuest === "function" || typeof mbGuest?.give === "function";
};
const guest = (receiver) => {
  if (!receiver) {
    throw new Error("receiver function was not passed to Guest constructor");
  }
  const result = {
    give(value) {
      receiver(value);
      return result;
    }
  };
  return result;
};
const firstVisit = (afterFirstVisit) => {
  let isVisited = false;
  return () => {
    if (!isVisited) {
      afterFirstVisit();
    }
    isVisited = true;
  };
};

const guestCast = (sourceGuest, targetGuest) => {
  if (sourceGuest === void 0) {
    throw new Error("GuestCast didn't receive sourceGuest argument");
  }
  if (targetGuest === void 0) {
    throw new Error("GuestCast didn't receive targetGuest argument");
  }
  const result = {
    disposed(value) {
      const maybeDisposable = sourceGuest;
      return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
    },
    give(value) {
      give(value, targetGuest);
      return result;
    },
    introduction() {
      if (typeof sourceGuest === "function") {
        return "guest";
      }
      if (!sourceGuest.introduction) {
        return "guest";
      }
      return sourceGuest.introduction();
    }
  };
  return result;
};

const guestSync = (theValue) => {
  const result = {
    give(value) {
      theValue = value;
      return result;
    },
    value() {
      if (theValue === void 0) {
        throw new Error("no value in GuestSync!");
      }
      return theValue;
    }
  };
  return result;
};

const guestDisposable = (guest, disposeCheck) => {
  if (guest === void 0) {
    throw new Error("GuestDisposable didn't receive guest argument");
  }
  if (disposeCheck === void 0) {
    throw new Error("GuestDisposable didn't receive disposeCheck argument");
  }
  const result = {
    disposed(value) {
      return disposeCheck(value);
    },
    give(value) {
      give(value, guest);
      return result;
    }
  };
  return result;
};

const guestApplied = (baseGuest, applier) => {
  const result = {
    give(value) {
      give(applier(value), baseGuest);
      return result;
    }
  };
  return result;
};

const guestExecutorApplied = (baseGuest, applier) => {
  const result = {
    give: applier((v) => give(v, baseGuest))
  };
  return result;
};

const patronPriority = (g) => {
  let priority = 100;
  if ("priority" in g && typeof g.priority === "function") {
    priority = g.priority();
  }
  return priority;
};
const isPatron = (guest) => typeof guest === "object" && guest !== null && guest?.introduction?.() === "patron";
const introduction = () => "patron";
const patron = (willBePatron) => {
  if (willBePatron === void 0) {
    throw new Error("Patron didn't receive willBePatron argument");
  }
  const result = {
    give(value) {
      give(value, willBePatron);
      return result;
    },
    disposed(value) {
      const maybeDisposable = willBePatron;
      return maybeDisposable?.disposed?.(value) || false;
    },
    introduction
  };
  return result;
};
const systemPatron = (willBePatron) => {
  const p = patron(willBePatron);
  return {
    ...p,
    priority: () => 200
  };
};
const withPriority = (patron2, priority) => {
  return {
    ...patron2,
    priority: () => priority
  };
};

const patronOnce = (baseGuest) => {
  if (baseGuest === void 0) {
    throw new Error("PatronOnce didn't receive baseGuest argument");
  }
  let received = false;
  const result = {
    give(value) {
      if (!received) {
        received = true;
        give(value, baseGuest);
      }
      return result;
    },
    disposed(value) {
      if (received) {
        return true;
      }
      const maybeDisposable = baseGuest;
      return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
    },
    introduction
  };
  return result;
};

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
class PrioritySet {
  constructor() {
    __publicField$1(this, "items");
    __publicField$1(this, "sortedItems");
    this.items = /* @__PURE__ */ new Map();
    this.sortedItems = [];
  }
  findInsertPosition(priority) {
    let left = 0;
    let right = this.sortedItems.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.sortedItems[mid].priority > priority) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }
  findItemIndex(value) {
    return this.sortedItems.findIndex((item) => item.value === value);
  }
  add(value, priority = 100) {
    const existingItem = this.items.get(value);
    if (existingItem) {
      if (existingItem.priority !== priority) {
        const oldIndex = this.findItemIndex(value);
        if (oldIndex !== -1) {
          this.sortedItems.splice(oldIndex, 1);
        }
        existingItem.priority = priority;
        const newIndex = this.findInsertPosition(priority);
        this.sortedItems.splice(newIndex, 0, existingItem);
      }
    } else {
      const newItem = { value, priority };
      this.items.set(value, newItem);
      const insertIndex = this.findInsertPosition(priority);
      this.sortedItems.splice(insertIndex, 0, newItem);
    }
    return this;
  }
  delete(value) {
    const item = this.items.get(value);
    if (!item) {
      return false;
    }
    this.items.delete(value);
    const index = this.findItemIndex(value);
    if (index !== -1) {
      this.sortedItems.splice(index, 1);
    }
    return true;
  }
  has(value) {
    return this.items.has(value);
  }
  get size() {
    return this.items.size;
  }
  clear() {
    this.items.clear();
    this.sortedItems = [];
  }
  getPriority(value) {
    const item = this.items.get(value);
    return item?.priority;
  }
  setPriority(value, priority) {
    if (this.items.has(value)) {
      this.add(value, priority);
      return true;
    }
    return false;
  }
  forEach(callback) {
    this.sortedItems.forEach((item) => {
      callback(item.value, item.priority, this);
    });
  }
  values() {
    const values = this.sortedItems.map((item) => item.value);
    return values[Symbol.iterator]();
  }
  entries() {
    const entries = this.sortedItems.map(
      (item) => [item.value, item.priority]
    );
    return entries[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.values();
  }
  toArray() {
    return this.sortedItems.map((item) => item.value);
  }
  toArrayWithPriorities() {
    return [...this.sortedItems];
  }
  debug() {
    console.log("Map size:", this.items.size);
    console.log("Sorted array length:", this.sortedItems.length);
    console.log("Sorted items:", this.sortedItems);
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const poolSets = /* @__PURE__ */ new Map();
const poolsOfInitiators = /* @__PURE__ */ new Map();
const subSources = /* @__PURE__ */ new Map();
const poolsChangeFns = [];
const notifyPoolsChange = () => {
  poolsChangeFns.forEach((fn) => fn());
};
const lastPatronPoolsStatistic = {
  poolsCount: 0,
  patronsCount: 0
};
const patronPoolsStatistic = source((g) => {
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
const subSource = (subSource2, source2) => {
  if (!subSources.has(source2)) {
    subSources.set(source2, []);
  }
  subSources.get(source2)?.push(subSource2);
  return subSource2;
};
const subSourceMany = (subSourceSrc, sourcesSrc) => {
  sourcesSrc.forEach((source2) => {
    subSource(subSourceSrc, source2);
  });
  return subSourceSrc;
};
const isDestroyable = (s) => {
  return typeof s === "object" && s !== null && "destroy" in s && typeof s.destroy === "function";
};
const destroy = (...initiators) => {
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
const patronPools = (patron) => {
  const pools = [];
  poolSets.forEach((pool, poolInstance) => {
    if (pool.has(patron)) {
      pools.push(poolInstance);
    }
  });
  return pools;
};
const removePatronFromPools = (patron) => {
  if (patron === void 0) {
    throw new Error("removePatronFromPools didn't receive patron argument");
  }
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
  notifyPoolsChange();
};
const isPatronInPools = (patron) => {
  if (patron === void 0) {
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
class PatronPool {
  constructor(initiator) {
    this.initiator = initiator;
    __publicField(this, "patrons");
    __publicField(this, "give");
    this.patrons = new PrioritySet();
    poolSets.set(this, this.patrons);
    poolsOfInitiators.set(this.initiator, this);
    const doReceive = (value) => {
      this.patrons.forEach((target) => {
        this.sendValueToGuest(value, target);
      });
    };
    this.give = (value) => {
      doReceive(value);
      return this;
    };
    notifyPoolsChange();
  }
  size() {
    return this.patrons.size;
  }
  add(shouldBePatron) {
    if (shouldBePatron === void 0) {
      throw new Error("PatronPool add method received nothing!");
    }
    if (typeof shouldBePatron !== "function" && shouldBePatron.introduction && shouldBePatron.introduction() === "patron") {
      this.patrons.add(shouldBePatron, patronPriority(shouldBePatron));
    }
    notifyPoolsChange();
    return this;
  }
  remove(patron) {
    this.patrons.delete(patron);
    notifyPoolsChange();
    return this;
  }
  distribute(receiving, possiblePatron) {
    this.add(possiblePatron);
    this.sendValueToGuest(receiving, possiblePatron);
    return this;
  }
  destroy() {
    this.patrons.forEach((patron) => {
      this.remove(patron);
    });
    poolSets.delete(this);
    poolsOfInitiators.delete(this.initiator);
    notifyPoolsChange();
    return this;
  }
  sendValueToGuest(value, guest) {
    const isDisposed = this.guestDisposed(value, guest);
    if (!isDisposed) {
      give(value, guest);
    }
    return this;
  }
  guestDisposed(value, guest) {
    if (guest.disposed?.(value)) {
      this.remove(guest);
      return true;
    }
    return false;
  }
}

const patronApplied = (baseGuest, applier) => {
  const applied = guestApplied(baseGuest, applier);
  const result = {
    give(value) {
      applied.give(value);
      return result;
    },
    introduction
  };
  return result;
};

const patronExecutorApplied = (baseGuest, applier) => {
  const guestApplied = guestExecutorApplied(baseGuest, applier);
  const result = {
    give(value) {
      guestApplied.give(value);
      return result;
    },
    introduction
  };
  return result;
};

const sourceSync = (baseSource, defaultValue) => {
  const syncGuest = guestSync(defaultValue);
  value(baseSource, systemPatron(syncGuest));
  const result = {
    value(guest) {
      value(baseSource, guest);
      return this;
    },
    syncValue() {
      try {
        return syncGuest.value();
      } catch {
        throw new Error("No value in SourceSync");
      }
    }
  };
  subSource(result, baseSource);
  return result;
};

const sourceIsEmpty = (source) => source === void 0 || source === null;
const sourceOf = (source) => {
  const createdSource = {};
  const thePool = new PatronPool(createdSource);
  let isEmpty = sourceIsEmpty(source);
  if (!isEmpty && isSource(source)) {
    value(
      source,
      patronOnce((unwrappedSourceDocument) => {
        isEmpty = sourceIsEmpty(unwrappedSourceDocument);
        source = unwrappedSourceDocument;
      })
    );
  }
  createdSource.value = (g) => {
    if (isEmpty) {
      if (isPatron(g)) {
        thePool.add(g);
      }
      return createdSource;
    }
    if (typeof g === "function") {
      thePool.distribute(source, guest(g));
    } else {
      thePool.distribute(source, g);
    }
    return createdSource;
  };
  createdSource.give = (value2) => {
    isEmpty = sourceIsEmpty(value2);
    source = value2;
    if (!isEmpty) {
      thePool.give(source);
    }
    return createdSource;
  };
  return createdSource;
};
const sourceMemoOf = (source) => {
  const result = sourceOf(source);
  const baseSrcSync = sourceSync(result, null);
  const resultMemo = {
    value: result.value,
    give(value2) {
      if (baseSrcSync.syncValue() !== value2) {
        give(value2, result.give);
      }
      return resultMemo;
    }
  };
  return resultMemo;
};

const sourceAll = (sources) => {
  const keysKnown = new Set(Object.keys(sources));
  const keysFilled = /* @__PURE__ */ new Set();
  const isAllFilled = () => {
    return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
  };
  const theAll = sourceOf({});
  const patrons = [];
  const visited = firstVisit(() => {
    Object.entries(sources).forEach(([key, source]) => {
      subSource(theAll, source);
      keysKnown.add(key);
      const keyPatron = systemPatron((v) => {
        theAll.value(
          guest((all) => {
            keysFilled.add(key);
            const lastAll = {
              ...all,
              [key]: v
            };
            theAll.give(lastAll);
          })
        );
      });
      patrons.push(keyPatron);
      value(source, keyPatron);
    });
  });
  return {
    value(guest2) {
      visited();
      const mbPatron = guestCast(guest2, (value2) => {
        if (isAllFilled()) {
          give(Object.values(value2), guest2);
        }
      });
      patrons.push(mbPatron);
      theAll.value(mbPatron);
    },
    destroy() {
      patrons.forEach((patron) => {
        removePatronFromPools(patron);
      });
    }
  };
};

const sourceSequence = (baseSource, targetSource) => {
  if (baseSource === void 0) {
    throw new Error("SourceSequence didn't receive baseSource argument");
  }
  if (targetSource === void 0) {
    throw new Error("SourceSequence didn't receive targetSource argument");
  }
  return (guest) => {
    const sequenceSource = sourceOf();
    const source = targetSource.get(sequenceSource);
    value(
      baseSource,
      guestCast(guest, (theValue) => {
        let index = 0;
        const sources = [];
        theValue.forEach(() => {
          sources.push(sourceOf());
        });
        const nextItemHandle = () => {
          if (theValue[index + 1] !== void 0) {
            index = index + 1;
            handle();
          }
        };
        function handle() {
          const currentSource = sources[index];
          const nextValue = theValue[index];
          if (isSource(nextValue)) {
            value(
              nextValue,
              patronOnce((theNextValue) => {
                sequenceSource.give(theNextValue);
                value(source, currentSource);
                nextItemHandle();
              })
            );
          } else {
            sequenceSource.give(nextValue);
            value(source, currentSource);
            nextItemHandle();
          }
        }
        if (theValue[index] !== void 0) {
          handle();
          value(sourceAll(sources), guest);
        } else {
          give([], guest);
        }
      })
    );
  };
};

const sourceMap = (baseSource, targetSource) => {
  if (baseSource === void 0) {
    throw new Error("SourceMap didn't receive baseSource argument");
  }
  if (targetSource === void 0) {
    throw new Error("SourceMap didn't receive targetSource argument");
  }
  const result = sourceOf();
  const visited = firstVisit(() => {
    value(
      baseSource,
      systemPatron((theValue) => {
        const sources = [];
        theValue.forEach((val) => {
          const source = targetSource.get(val);
          subSource(source, baseSource);
          sources.push(source);
        });
        value(
          sourceAll(sources),
          patronOnce((v) => {
            destroy(...sources);
            give(v, result);
          })
        );
      })
    );
  });
  return (g) => {
    visited();
    result.value(g);
  };
};

const sourceRace = (sources) => {
  if (sources === void 0) {
    throw new Error("SourceRace didnt receive sources argument");
  }
  return (guest) => {
    let connectedWithSource = null;
    sources.forEach((source) => {
      value(
        source,
        guestCast(guest, (value2) => {
          if (!connectedWithSource || connectedWithSource === source) {
            give(value2, guest);
            connectedWithSource = source;
          }
        })
      );
    });
  };
};

const sourceChain = (...sources) => {
  const resultSrc = sourceOf();
  const respondedSources = /* @__PURE__ */ new WeakMap();
  const repeatValue = () => {
    value(resultSrc, resultSrc);
  };
  const handleSource = (index) => {
    const source = sources[index];
    const nextSource = sources[index + 1];
    value(
      source,
      systemPatron((v) => {
        let sourceKey = source;
        if ((typeof source !== "object" || source === null) && typeof source !== "function" && !Array.isArray(source)) {
          sourceKey = { source };
        }
        if (nextSource) {
          repeatValue();
        }
        if (!nextSource) {
          resultSrc.give(v);
        } else if (!respondedSources.has(sourceKey)) {
          handleSource(index + 1);
        }
        respondedSources.set(sourceKey, 1);
      })
    );
  };
  const visited = firstVisit(() => {
    handleSource(0);
  });
  return (g) => {
    visited();
    resultSrc.value(g);
  };
};

const sourceDynamic = (baseGuest, baseSource) => {
  if (baseGuest === void 0) {
    throw new Error("SourceDynamic didn't receive baseGuest argument");
  }
  if (baseSource === void 0) {
    throw new Error("SourceDynamic didn't receive baseSource argument");
  }
  const sourceObject = {
    value(guest) {
      value(baseSource, guest);
      return sourceObject;
    },
    give(value2) {
      give(value2, baseGuest);
      return this;
    }
  };
  return sourceObject;
};

const sourceApplied = (baseSource, applier) => {
  return (guest) => {
    value(
      baseSource,
      guestCast(guest, (v) => {
        give(applier(v), guest);
      })
    );
  };
};

const sourceExecutorApplied = (source, applier) => {
  return (g) => {
    value(
      source,
      guestCast(
        g,
        applier((v) => {
          give(v, g);
        })
      )
    );
  };
};

const sourceFiltered = (baseSource, predicate, defaultValue) => {
  return (g) => {
    value(
      baseSource,
      guestCast(g, (v) => {
        if (predicate(v) === true) {
          give(v, g);
        } else if (defaultValue !== void 0) {
          give(defaultValue, g);
        }
      })
    );
  };
};

const sourceOnce = (initialValue) => {
  let isFilled = initialValue !== void 0;
  const source = sourceOf(initialValue);
  return {
    value(guest) {
      value(source, guest);
      return this;
    },
    give(value2) {
      if (!isFilled) {
        source.give(value2);
        isFilled = true;
      }
      return this;
    }
  };
};

const sourceCombined = (...sources) => (source) => {
  const result = sourceOf();
  subSourceMany(result, sources);
  value(
    sourceAll(sources),
    systemPatron((actualValues) => {
      source(result.give, ...actualValues);
    })
  );
  return result.value;
};

const sourceResettable = (baseSrc, resettableSrc) => {
  const result = sourceOf();
  const visited = firstVisit(() => {
    value(
      resettableSrc,
      systemPatron(() => {
        give(null, result);
      })
    );
    value(baseSrc, systemPatron(result));
    subSource(result, baseSrc);
  });
  return sourceDynamic(result.give, (g) => {
    visited();
    result.value(g);
  });
};

const sourceAny = (sources) => {
  const lastSrc = sourceOf();
  const visited = firstVisit(() => {
    sources.forEach((source) => {
      value(source, systemPatron(lastSrc));
    });
  });
  return (g) => {
    visited();
    lastSrc.value(g);
  };
};

const sourceLazy = (lazySrc, args, destroySrc) => {
  let instance = null;
  const result = sourceOf();
  const resultResettable = sourceResettable(result, destroySrc ?? sourceOf());
  let wasInstantiated = false;
  const instantiate = () => {
    if (wasInstantiated) {
      return;
    }
    wasInstantiated = true;
    value(
      sourceAll(args),
      systemPatron(() => {
        if (!instance) {
          instance = lazySrc.get(...args);
          value(instance, systemPatron(result));
        }
      })
    );
  };
  if (destroySrc) {
    value(
      destroySrc,
      systemPatron(() => {
        destroy(instance);
        instance = null;
      })
    );
  }
  return (g) => {
    instantiate();
    value(resultResettable, g);
  };
};

const sourceDestroyable = (source) => {
  let destructor = null;
  return {
    value(g) {
      destructor = source(g);
      return this;
    },
    destroy() {
      if (destructor !== null && typeof destructor === "function") {
        destructor();
      }
      return this;
    }
  };
};

const lazyClass = (constructorFn, modules = {}) => {
  if (constructorFn === void 0) {
    throw new Error("PrivateClass didn't receive constructorFn argument");
  }
  return {
    get(...args) {
      return new constructorFn(
        ...args,
        modules
      );
    }
  };
};

const lazy = (buildingFn) => {
  if (buildingFn === void 0) {
    throw new Error("lazy didn't receive buildingFn argument");
  }
  return {
    get(...args) {
      return buildingFn(...args);
    }
  };
};

export { PatronPool, destroy, firstVisit, give, guest, guestApplied, guestCast, guestDisposable, guestExecutorApplied, guestSync, introduction, isDestroyable, isGuest, isPatron, isPatronInPools, isSource, lazy, lazyClass, patron, patronApplied, patronExecutorApplied, patronOnce, patronPools, patronPoolsStatistic, patronPriority, removePatronFromPools, source, sourceAll, sourceAny, sourceApplied, sourceChain, sourceCombined, sourceDestroyable, sourceDynamic, sourceExecutorApplied, sourceFiltered, sourceLazy, sourceMap, sourceMemoOf, sourceOf, sourceOnce, sourceRace, sourceResettable, sourceSequence, sourceSync, subSource, subSourceMany, systemPatron, value, withPriority };
//# sourceMappingURL=silentium.mjs.map
