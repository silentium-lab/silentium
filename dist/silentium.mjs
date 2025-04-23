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
const destroy = (initiators) => {
  initiators.forEach((initiator) => {
    const pool = poolsOfInitiators.get(initiator);
    pool?.destroy();
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
    throw new Error("removePatronFromPools didnt receive patron argument");
  }
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};
const isPatronInPools = (patron) => {
  if (patron === void 0) {
    throw new Error("isPatronInPools didnt receive patron argument");
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
    return this;
  }
  remove(patron) {
    this.patrons.delete(patron);
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
  }
  sendValueToGuest(value, guest) {
    const isDisposed = this.guestDisposed(value, guest);
    if (!isDisposed) {
      give(value, guest);
    }
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

const sourceChangeable = (source) => {
  const createdSource = {};
  const thePool = new PatronPool(createdSource);
  const theEmptyPool = new PatronPool(createdSource);
  let isEmpty = source === void 0;
  if (source !== void 0 && isSource(source)) {
    value(
      source,
      patronOnce((unwrappedSourceDocument) => {
        isEmpty = unwrappedSourceDocument === void 0;
        source = unwrappedSourceDocument;
      })
    );
  } else {
    isEmpty = source === void 0;
  }
  createdSource.value = (g) => {
    if (isEmpty) {
      if (isPatron(g)) {
        theEmptyPool.add(g);
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
    isEmpty = false;
    source = value2;
    thePool.give(source);
    theEmptyPool.give(source);
    return createdSource;
  };
  return createdSource;
};

const sourceAll = (sources) => {
  const keysKnown = new Set(Object.keys(sources));
  const keysFilled = /* @__PURE__ */ new Set();
  const isAllFilled = () => {
    return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
  };
  const isSourcesArray = Array.isArray(sources);
  const theAll = sourceChangeable({});
  Object.entries(sources).forEach(([key, source]) => {
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
            give(isSourcesArray ? Object.values(value2) : value2, g);
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
    const sequenceSource = sourceChangeable();
    const source = targetSource.get(sequenceSource);
    value(
      baseSource,
      guestCast(guest, (theValue) => {
        let index = 0;
        const sources = [];
        theValue.forEach(() => {
          sources.push(sourceChangeable());
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
  return (guest) => {
    value(
      baseSource,
      guestCast(guest, (theValue) => {
        const sources = [];
        theValue.forEach((val) => {
          const source = targetSource.get(val);
          sources.push(source);
        });
        value(sourceAll(sources), guest);
      })
    );
    return void 0;
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

const sourceFiltered = (baseSource, predicate) => {
  return (g) => {
    value(
      baseSource,
      guestCast(g, (v) => {
        if (predicate(v) === true) {
          give(v, g);
        }
      })
    );
  };
};

const sourceOnce = (initialValue) => {
  let isFilled = initialValue !== void 0;
  const source = sourceChangeable(initialValue);
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

const sourceSync = (baseSource) => {
  const syncGuest = guestSync();
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

const personalClass = (constructorFn, modules = {}) => {
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

const personal = (buildingFn) => {
  if (buildingFn === void 0) {
    throw new Error("personal didn't receive buildingFn argument");
  }
  return {
    get(...args) {
      return buildingFn(...args);
    }
  };
};

export { PatronPool, destroy, give, guest, guestApplied, guestCast, guestDisposable, guestExecutorApplied, guestSync, introduction, isGuest, isPatron, isPatronInPools, isSource, patron, patronApplied, patronExecutorApplied, patronOnce, patronPools, personal, personalClass, removePatronFromPools, source, sourceAll, sourceApplied, sourceChangeable, sourceDynamic, sourceExecutorApplied, sourceFiltered, sourceMap, sourceOnce, sourceRace, sourceSequence, sourceSync, value };
//# sourceMappingURL=silentium.mjs.map
