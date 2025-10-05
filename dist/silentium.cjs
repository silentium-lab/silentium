'use strict';

const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
const all = (...theInfos) => {
  const keysKnown = new Set(Object.keys(theInfos));
  const keysFilled = /* @__PURE__ */ new Set();
  return (u) => {
    const result = {};
    Object.entries(theInfos).forEach(([key, info]) => {
      keysKnown.add(key);
      info((v) => {
        keysFilled.add(key);
        result[key] = v;
        if (isAllFilled(keysFilled, keysKnown)) {
          u(Object.values(result));
        }
      });
    });
  };
};

const any = (...infos) => {
  return (u) => {
    infos.forEach((info) => {
      info(u);
    });
  };
};

const applied = (baseSrc, applier) => {
  return (u) => {
    baseSrc((v) => {
      u(applier(v));
    });
  };
};

const chain = (...infos) => {
  return (u) => {
    let lastValue;
    const handleI = (index) => {
      const info = infos[index];
      const nextI = infos[index + 1];
      info((v) => {
        if (!nextI) {
          lastValue = v;
        }
        if (lastValue) {
          u(lastValue);
        }
        if (nextI && !lastValue) {
          handleI(index + 1);
        }
      });
    };
    handleI(0);
  };
};

const executorApplied = (baseSrc, applier) => {
  return (u) => {
    baseSrc(
      applier((v) => {
        u(v);
      })
    );
  };
};

const filtered = (baseSrc, predicate, defaultValue) => {
  return (u) => {
    baseSrc((v) => {
      if (predicate(v)) {
        u(v);
      } else if (defaultValue !== void 0) {
        u(defaultValue);
      }
    });
  };
};

const fromEvent = (emitterSrc, eventNameSrc, subscribeMethodSrc, unsubscribeMethodSrc) => {
  let lastU = null;
  const handler = (v) => {
    if (lastU) {
      lastU(v);
    }
  };
  return (u) => {
    lastU = u;
    const a = all(emitterSrc, eventNameSrc, subscribeMethodSrc);
    a(([emitter, eventName, subscribe]) => {
      if (!emitter?.[subscribe]) {
        return;
      }
      emitter[subscribe](eventName, handler);
    });
    return () => {
      lastU = null;
      if (!unsubscribeMethodSrc) {
        return;
      }
      const a2 = all(emitterSrc, eventNameSrc, unsubscribeMethodSrc);
      a2(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, handler);
      });
    };
  };
};

const fromPromise = (p, errorOwner) => {
  return (u) => {
    p.then((v) => {
      u(v);
    }).catch((e) => {
      errorOwner?.(e);
    });
  };
};

const isFilled = (value) => {
  return value !== void 0 && value !== null;
};

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class OwnerPool {
  constructor() {
    __publicField(this, "owners");
    __publicField(this, "innerOwner");
    this.owners = /* @__PURE__ */ new Set();
    this.innerOwner = (v) => {
      this.owners.forEach((g) => {
        g(v);
      });
    };
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
  add(owner) {
    this.owners.add(owner);
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

const late = (v) => {
  let lateUser = null;
  const notify = (v2) => {
    if (isFilled(v2) && lateUser) {
      lateUser(v2);
    }
  };
  return {
    value: (u) => {
      if (lateUser) {
        throw new Error(
          "Late component gets new user, when another was already connected!"
        );
      }
      lateUser = u;
      notify(v);
    },
    give: (v2) => {
      notify(v2);
    }
  };
};

const once = (baseSrc) => {
  return (u) => {
    let isFilled = false;
    baseSrc((v) => {
      if (!isFilled) {
        isFilled = true;
        u(v);
      }
    });
  };
};

const shared = (baseSrc, stateless = false) => {
  const ownersPool = new OwnerPool();
  let lastValue;
  const calls = late();
  once(calls.value)(() => {
    baseSrc((v) => {
      ownersPool.owner()(v);
      lastValue = v;
    });
  });
  return {
    value: (u) => {
      calls.give(1);
      if (!stateless && isFilled(lastValue) && !ownersPool.has(u)) {
        u(lastValue);
      }
      ownersPool.add(u);
      return () => {
        ownersPool.remove(u);
      };
    },
    give: (value) => {
      lastValue = value;
      ownersPool.owner()(value);
    },
    pool() {
      return ownersPool;
    },
    destroy() {
      ownersPool.destroy();
    }
  };
};

const sharedSource = (baseSrc, stateless = false) => {
  const sharedSrc = shared(baseSrc.value, stateless);
  return {
    value: (u) => {
      sharedSrc.value(u);
    },
    give: (v) => {
      baseSrc.give(v);
    }
  };
};

const lateShared = (theValue) => {
  const src = sharedSource(late(theValue));
  return {
    value: src.value,
    give: src.give
  };
};

const lazyApplied = (baseLazy, applier) => {
  return (...args) => {
    return applier(baseLazy(...args));
  };
};

const lazyArgs = (baseLazy, args, startFromArgIndex = 0) => {
  return (...runArgs) => {
    return baseLazy(...mergeAtIndex(runArgs, args, startFromArgIndex));
  };
};
function mergeAtIndex(arr1, arr2, index) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(void 0);
  return result.concat(arr2);
}

const lazyDestroyable = (baseLazy) => {
  const instances = [];
  return {
    get: (...args) => {
      const inst = baseLazy(...args);
      instances.push(inst);
      return inst;
    },
    destroy: () => {
      instances.forEach((i) => i.destroy());
    }
  };
};

const destructor = (src, destructorUser) => (u) => {
  const mbDestructor = src(u);
  if (mbDestructor && destructorUser) {
    destructorUser(mbDestructor);
  }
  return () => {
    mbDestructor?.();
  };
};

const local = (baseSrc) => {
  return function Local(user) {
    let destroyed = false;
    const d = baseSrc((v) => {
      if (!destroyed) {
        user(v);
      }
    });
    return () => {
      destroyed = true;
      d?.();
    };
  };
};

const of = (v) => (u) => u(v);

const on = (src, user) => src(user);

const _void = () => () => {
};

const map = (baseSrc, targetSrc) => {
  return (u) => {
    baseSrc((v) => {
      const infos = [];
      v.forEach((val) => {
        let valInfo = val;
        if (typeof valInfo !== "function") {
          valInfo = of(valInfo);
        }
        const info = targetSrc(valInfo);
        infos.push(info);
      });
      const allI = all(...infos);
      allI(u);
    });
  };
};

const primitive = (baseSrc, theValue = null) => {
  baseSrc((v) => {
    theValue = v;
  });
  return {
    [Symbol.toPrimitive]() {
      return theValue;
    },
    primitive() {
      return theValue;
    },
    primitiveWithException() {
      if (theValue === null) {
        throw new Error("Primitive value is null");
      }
      return theValue;
    }
  };
};

const sequence = (baseSrc) => {
  return (u) => {
    const result = [];
    baseSrc((v) => {
      result.push(v);
      u(result);
    });
  };
};

const stream = (baseSrc) => {
  return (u) => {
    baseSrc((v) => {
      v.forEach((cv) => {
        u(cv);
      });
    });
  };
};

exports.OwnerPool = OwnerPool;
exports._void = _void;
exports.all = all;
exports.any = any;
exports.applied = applied;
exports.chain = chain;
exports.destructor = destructor;
exports.executorApplied = executorApplied;
exports.filtered = filtered;
exports.fromEvent = fromEvent;
exports.fromPromise = fromPromise;
exports.isFilled = isFilled;
exports.late = late;
exports.lateShared = lateShared;
exports.lazyApplied = lazyApplied;
exports.lazyArgs = lazyArgs;
exports.lazyDestroyable = lazyDestroyable;
exports.local = local;
exports.map = map;
exports.of = of;
exports.on = on;
exports.once = once;
exports.primitive = primitive;
exports.sequence = sequence;
exports.shared = shared;
exports.sharedSource = sharedSource;
exports.stream = stream;
//# sourceMappingURL=silentium.cjs.map
