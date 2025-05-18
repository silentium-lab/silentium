const value = (source2, guest) => {
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
  if (source2 !== null && typeof source2 !== "object") {
    return source2;
  }
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
const destroy = (initiators) => {
  initiators.forEach((initiator) => {
    const pool = poolsOfInitiators.get(initiator);
    pool?.destroy();
    const relatedInitiators = subSources.get(initiator);
    if (relatedInitiators) {
      destroy(relatedInitiators);
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
    this.patrons = /* @__PURE__ */ new Set();
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
    if (!shouldBePatron) {
      throw new Error("PatronPool add method received nothing!");
    }
    if (typeof shouldBePatron !== "function" && shouldBePatron.introduction && shouldBePatron.introduction() === "patron") {
      this.patrons.add(shouldBePatron);
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
  value(baseSource, patron(syncGuest));
  return {
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
  Object.entries(sources).forEach(([key, source]) => {
    subSource(theAll, source);
    keysKnown.add(key);
    value(
      source,
      patron((v) => {
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
      })
    );
  });
  return (guest2) => {
    value((g) => {
      theAll.value(
        guestCast(g, (value2) => {
          if (isAllFilled()) {
            give(Object.values(value2), g);
          }
        })
      );
    }, guest2);
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
  value(
    baseSource,
    patron((theValue) => {
      const sources = [];
      theValue.forEach((val) => {
        const source = targetSource.get(val);
        subSource(source, baseSource);
        sources.push(source);
      });
      value(
        sourceAll(sources),
        patronOnce((v) => {
          destroy(sources);
          give(v, result);
        })
      );
    })
  );
  return result.value;
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
  const respondedSources = /* @__PURE__ */ new Set();
  let lastSourceValue = null;
  sources.forEach((source, index) => {
    value(
      source,
      patron((value2) => {
        respondedSources.add(index);
        if (index === sources.length - 1) {
          lastSourceValue = value2;
        }
        if (respondedSources.size === sources.length && lastSourceValue !== null) {
          resultSrc.give(lastSourceValue);
        }
      })
    );
  });
  return resultSrc.value;
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
  return applier((g) => {
    value(source, g);
  });
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
    patron((actualValues) => {
      source(result.give, ...actualValues);
    })
  );
  return result.value;
};

const sourceResettable = (baseSrc, resettableSrc) => {
  const result = sourceOf();
  value(
    resettableSrc,
    patron(() => {
      give(null, result);
    })
  );
  value(baseSrc, patron(result));
  subSource(result, baseSrc);
  return result;
};

const sourceAny = (sources) => {
  const lastSrc = sourceOf();
  sources.forEach((source) => {
    value(source, patron(lastSrc));
  });
  return lastSrc;
};

const sourceLazy = (lazySrc, args, resetSrc) => {
  let instance = null;
  const result = sourceOf();
  const resultResettable = sourceResettable(result, resetSrc ?? sourceOf());
  value(
    sourceAll(args),
    patron(() => {
      if (!instance) {
        instance = lazySrc.get(...args);
        value(instance, patron(result));
      }
    })
  );
  if (resetSrc) {
    value(
      resetSrc,
      patron(() => {
        destroy([instance]);
        instance = null;
      })
    );
  }
  return resultResettable;
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

export { PatronPool, destroy, give, guest, guestApplied, guestCast, guestDisposable, guestExecutorApplied, guestSync, introduction, isGuest, isPatron, isPatronInPools, isSource, lazy, lazyClass, patron, patronApplied, patronExecutorApplied, patronOnce, patronPools, patronPoolsStatistic, removePatronFromPools, source, sourceAll, sourceAny, sourceApplied, sourceChain, sourceCombined, sourceDynamic, sourceExecutorApplied, sourceFiltered, sourceLazy, sourceMap, sourceMemoOf, sourceOf, sourceOnce, sourceRace, sourceResettable, sourceSequence, sourceSync, subSource, subSourceMany, value };
//# sourceMappingURL=silentium.mjs.map
