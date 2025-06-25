var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
const _Information = class _Information {
  constructor(info, theName = "unknown", onlyOneOwner = true) {
    this.info = info;
    this.theName = theName;
    this.onlyOneOwner = onlyOneOwner;
    __publicField$1(this, "theSubInfos", []);
    __publicField$1(this, "destructor");
    __publicField$1(this, "owner");
    __publicField$1(this, "executedCbs");
    __publicField$1(this, "alreadyExecuted", false);
    _Information.instances += 1;
  }
  /**
   * Следующее значение источника
   */
  next(value) {
    if (this.owner !== void 0) {
      this.owner.give(value);
    }
    return this;
  }
  /**
   * Возможность гостю получить информацию от источника
   */
  value(owner) {
    if (this.onlyOneOwner && this.owner !== void 0) {
      throw new Error(`owner already connected to info ${this.name()}`);
    }
    this.owner = owner;
    if (this.executedCbs !== void 0 && !this.alreadyExecuted) {
      this.executedCbs.forEach((cb) => cb(owner));
      this.alreadyExecuted = true;
    }
    if (this.info === void 0) {
      return this;
    }
    if (typeof this.info === "function") {
      const mbDestructor = this.info(owner);
      if (this.destructor === void 0 && mbDestructor !== void 0 && this.info !== mbDestructor && typeof mbDestructor === "function") {
        this.destructor = mbDestructor;
      }
    } else if (typeof this.info === "object" && this.info !== null && "value" in this.info && typeof this.info.value === "function") {
      this.info.value(owner);
    } else {
      this.next(this.info);
    }
    return this;
  }
  /**
   * Ability to destroy the information info
   */
  destroy() {
    while (this.theSubInfos.length > 0) {
      const subInfo = this.theSubInfos.shift();
      subInfo?.destroy();
    }
    if (this.destructor) {
      this.destructor();
    }
    this.owner = void 0;
    this.executedCbs = void 0;
    this.destructor = void 0;
    return this;
  }
  /**
   * The ability to link another info to the current info
   */
  subInfo(info) {
    this.theSubInfos.push(info);
    return this;
  }
  subInfos() {
    return this.theSubInfos;
  }
  name() {
    return `#info_${this.theName}_${_Information.instances}`;
  }
  executed(cb) {
    if (!this.executedCbs) {
      this.executedCbs = [];
    }
    this.executedCbs.push(cb);
    if (this.alreadyExecuted && this.owner !== void 0) {
      cb(this.owner);
    }
    return this;
  }
  hasOwner() {
    return !!this.owner;
  }
};
__publicField$1(_Information, "instances", 0);
let Information = _Information;
const I = (info, theName = "unknown", onlyOneOwner = true) => new Information(info, theName, onlyOneOwner);

class Owner {
  constructor(ownerFn, errorFn, disposedFn) {
    this.ownerFn = ownerFn;
    this.errorFn = errorFn;
    this.disposedFn = disposedFn;
  }
  give(value) {
    if (!this.disposed()) {
      this.ownerFn(value);
    }
    return this;
  }
  error(cause) {
    if (this.errorFn !== void 0) {
      this.errorFn(cause);
    }
    return this;
  }
  disposed() {
    return this.disposedFn !== void 0 ? this.disposedFn() : false;
  }
}
const O = (ownerFn) => new Owner(ownerFn);

const all = (...infos) => {
  const i = new Information((g) => {
    const keysKnown = new Set(Object.keys(infos));
    const keysFilled = /* @__PURE__ */ new Set();
    const isAllFilled = () => {
      return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
    };
    const result = {};
    Object.entries(infos).forEach(([key, info]) => {
      i.subInfo(info);
      keysKnown.add(key);
      info.value(
        new Owner((v) => {
          keysFilled.add(key);
          result[key] = v;
          if (isAllFilled()) {
            g.give(Object.values(result));
          }
        })
      );
    });
  });
  return i;
};

const any = (...infos) => {
  const info = I((g) => {
    infos.forEach((info2) => {
      info2.value(g);
      info2.subInfo(info2);
    });
  });
  return info;
};

const chain = (...infos) => {
  let theOwner;
  let lastValue;
  const respondedI = /* @__PURE__ */ new WeakMap();
  const handleI = (index) => {
    const info2 = infos[index];
    const nextI = infos[index + 1];
    info2.value(
      O((v) => {
        if (!nextI) {
          lastValue = v;
          theOwner?.give(v);
        }
        if (nextI && lastValue !== void 0 && theOwner !== void 0) {
          theOwner.give(lastValue);
        }
        if (nextI && !respondedI.has(info2)) {
          handleI(index + 1);
        }
        respondedI.set(info2, 1);
      })
    );
  };
  const info = I((g) => {
    theOwner = g;
  });
  info.executed(() => {
    handleI(0);
  });
  return info;
};

const executorApplied = (base, applier) => {
  const i = new Information((g) => {
    base.value(applier(g));
  });
  i.subInfo(base);
  return i;
};

const filtered = (base, predicate, defaultValue) => {
  return new Information((g) => {
    base.value(
      O((v) => {
        if (predicate(v)) {
          g.give(v);
        } else if (defaultValue !== void 0) {
          g.give(defaultValue);
        }
      })
    );
  }).subInfo(base);
};

const ownerApplied = (base, applier) => {
  return new Owner(
    (v) => {
      base.give(applier(v));
    },
    (cause) => {
      base.error(cause);
    },
    () => base.disposed()
  );
};

const ownerExecutorApplied = (base, applier) => {
  const executor = applier((v) => base.give(v));
  return new Owner((v) => {
    executor(v);
  });
};

const ownerSync = (base, defaultValue) => {
  let lastValue;
  base.value(
    O((v) => {
      lastValue = v;
    })
  );
  return {
    syncValue() {
      if (lastValue === void 0 && defaultValue === void 0) {
        throw new Error("info sync is empty");
      }
      return lastValue || defaultValue;
    }
  };
};

const lazyS = (lazyI, destroyI) => {
  const info = new Information((g) => {
    const instance = lazyI.get();
    info.subInfo(instance);
    instance.value(g);
  });
  if (destroyI) {
    info.subInfo(destroyI);
    destroyI.value(
      O(() => {
        info.destroy();
      })
    );
  }
  return info;
};

const map = (base, targetI) => {
  const i = new Information((g) => {
    base.value(
      O((v) => {
        const infos = [];
        v.forEach((val) => {
          let valInfo = val;
          if (!(valInfo instanceof Information)) {
            valInfo = I(val);
          }
          const info = targetI.get(valInfo);
          infos.push(info);
        });
        const allI = all(...infos).value(g);
        i.subInfo(allI);
      })
    );
  });
  i.subInfo(base);
  return i;
};

const of = (incomeI) => {
  let sharedValue = incomeI;
  let relatedO;
  const notifyO = () => {
    if (relatedO !== void 0) {
      relatedO.give(sharedValue);
    }
  };
  const info = new Information((g) => {
    relatedO = g;
    if (sharedValue !== void 0 && sharedValue !== null) {
      notifyO();
    }
  }, "of");
  return [
    info,
    new Owner((v) => {
      sharedValue = v;
      notifyO();
    })
  ];
};

const once = (base) => {
  const info = new Information((g) => {
    let isFilled = false;
    base.value(
      O((v) => {
        if (!isFilled) {
          isFilled = true;
          g.give(v);
        }
      })
    );
  });
  info.subInfo(base);
  return info;
};

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class OwnerPool {
  constructor() {
    __publicField(this, "owners");
    __publicField(this, "innerOwner");
    this.owners = /* @__PURE__ */ new Set();
    this.innerOwner = new Owner(
      (v) => {
        this.owners.forEach((g) => {
          g.give(v);
        });
      },
      (cause) => {
        this.owners.forEach((g) => {
          g.error(cause);
        });
      }
    );
  }
  owner() {
    return this.innerOwner;
  }
  size() {
    return this.owners.size;
  }
  has(owner) {
    return this.owners.has(owner);
  }
  add(shouldBePatron) {
    this.owners.add(shouldBePatron);
    return this;
  }
  remove(g) {
    this.owners.delete(g);
    return this;
  }
  destroy() {
    this.owners.forEach((g) => {
      this.remove(g);
    });
    return this;
  }
}

const pool = (base) => {
  const ownersPool = new OwnerPool();
  let lastValue;
  const i = new Information(
    (g) => {
      if (lastValue !== void 0 && !ownersPool.has(g)) {
        g.give(lastValue);
      }
      ownersPool.add(g);
      return () => {
        ownersPool.destroy();
      };
    },
    "pool",
    false
  );
  i.subInfo(base);
  i.executed(() => {
    const gp = ownersPool.owner();
    base.value(
      new Owner((v) => {
        gp.give(v);
        lastValue = v;
      })
    );
  });
  return [i, ownersPool];
};

const sequence = (base) => {
  const i = I((o) => {
    const result = [];
    base.value(
      O((v) => {
        result.push(v);
        o.give(result);
      })
    );
  });
  i.subInfo(base);
  return i;
};

const stream = (base) => {
  const i = I((o) => {
    base.value(
      O((v) => {
        v.forEach((cv) => {
          o.give(cv);
        });
      })
    );
  });
  return i;
};

const fromCallback = (waitForCb) => {
  return I((o) => {
    waitForCb((v) => {
      o.give(v);
    });
  });
};

const fromEvent = (emitter, eventName, subscribeMethod, unsubscribeMethod) => {
  return I((o) => {
    const handler = (...args) => {
      o.give(args);
    };
    emitter[subscribeMethod](eventName, handler);
    return () => {
      if (unsubscribeMethod !== void 0) {
        emitter[unsubscribeMethod](eventName, handler);
      }
    };
  });
};

const fromPromise = (p) => {
  return I((o) => {
    p.then((v) => {
      o.give(v);
    }).catch((e) => {
      o.error(e);
    });
  });
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

export { I, Information, O, Owner, OwnerPool, all, any, chain, executorApplied, filtered, fromCallback, fromEvent, fromPromise, lazy, lazyClass, lazyS, map, of, once, ownerApplied, ownerExecutorApplied, ownerSync, pool, sequence, stream };
//# sourceMappingURL=silentium.mjs.map
