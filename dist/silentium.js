const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
const all = (...theInfos) => {
  const keysKnown = new Set(Object.keys(theInfos));
  const keysFilled = /* @__PURE__ */ new Set();
  return function AllData(u) {
    const result = {};
    Object.entries(theInfos).forEach(([key, info]) => {
      keysKnown.add(key);
      info(function AllItemUser(v) {
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
  return function AnyData(u) {
    infos.forEach((info) => {
      info(u);
    });
  };
};

const applied = (baseSrc, applier) => {
  return function AppliedData(u) {
    baseSrc(function AppliedBaseUser(v) {
      u(applier(v));
    });
  };
};

const chain = (...infos) => {
  return function ChainData(u) {
    let lastValue;
    const handleI = (index) => {
      const info = infos[index];
      const nextI = infos[index + 1];
      info(function ChainItemUser(v) {
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
  return function ExecutorAppliedData(u) {
    const ExecutorAppliedBaseUser = applier(u);
    baseSrc(ExecutorAppliedBaseUser);
  };
};

const filtered = (baseSrc, predicate, defaultValue) => {
  return function FilteredData(u) {
    baseSrc(function FilteredBaseUser(v) {
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
  const handler = function FromEventHandler(v) {
    if (lastU) {
      lastU(v);
    }
  };
  return function FromEventData(u) {
    lastU = u;
    const a = all(emitterSrc, eventNameSrc, subscribeMethodSrc);
    a(function FromEventAllUser([emitter, eventName, subscribe]) {
      if (!emitter?.[subscribe]) {
        return;
      }
      emitter[subscribe](eventName, handler);
    });
    return function FromEventDestructor() {
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
  return function FromPromiseData(u) {
    p.then(function FromPromiseThen(v) {
      u(v);
    }).catch(function FromPromiseCatch(e) {
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
    value: function Late(u) {
      if (lateUser) {
        throw new Error(
          "Late component gets new user, when another was already connected!"
        );
      }
      lateUser = u;
      notify(v);
    },
    give: function LateUser(v2) {
      notify(v2);
    }
  };
};

const once = (baseSrc) => {
  return function OnceData(u) {
    let isFilled = false;
    baseSrc(function OnceBaseUser(v) {
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
    give: function SharedUser(value) {
      calls.give(1);
      lastValue = value;
      ownersPool.owner()(value);
    },
    touched() {
      calls.give(1);
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
    value: function SharedSource(u) {
      sharedSrc.value(u);
    },
    give: function SharedSourceUser(v) {
      sharedSrc.touched();
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
  return function LazyAppliedData(...args) {
    return applier(baseLazy(...args));
  };
};

const lazyArgs = (baseLazy, args, startFromArgIndex = 0) => {
  return function LazyArgsData(...runArgs) {
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
    get: function lazyDestroyable2(...args) {
      const inst = baseLazy(...args);
      instances.push(inst);
      return inst;
    },
    destroy: function LazyDestructor() {
      instances.forEach((i) => i.destroy());
    }
  };
};

const destructor = (src, destructorUser) => {
  let mbDestructor;
  let theUser = null;
  const destroy = () => {
    theUser = null;
    mbDestructor?.();
  };
  return {
    value: function DestructorData(u) {
      theUser = u;
      mbDestructor = src((v) => {
        if (theUser) {
          theUser(v);
        }
      });
      if (mbDestructor && destructorUser) {
        destructorUser(destroy);
      }
      return destroy;
    },
    destroy
  };
};

const local = (baseSrc) => {
  return function LocalData(user) {
    let destroyed = false;
    const d = baseSrc(function LocalBaseUser(v) {
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

const of = (v) => function OfData(u) {
  return u(v);
};

const on = (src, user) => src(user);

const _void = () => function VoidData() {
};

const map = (baseSrc, targetSrc) => {
  return function MapData(u) {
    baseSrc(function MapBaseUser(v) {
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
  baseSrc(function PrimitiveBaseUser(v) {
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
  return function SequenceData(u) {
    const result = [];
    baseSrc(function SequenceBaseUser(v) {
      result.push(v);
      u(result);
    });
  };
};

const stream = (baseSrc) => {
  return function StreamData(u) {
    baseSrc(function StreamBaseUser(v) {
      v.forEach((cv) => {
        u(cv);
      });
    });
  };
};

export { OwnerPool, _void, all, any, applied, chain, destructor, executorApplied, filtered, fromEvent, fromPromise, isFilled, late, lateShared, lazyApplied, lazyArgs, lazyDestroyable, local, map, of, on, once, primitive, sequence, shared, sharedSource, stream };
//# sourceMappingURL=silentium.js.map
