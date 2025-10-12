const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
const all = (...theInfos) => {
  const keysKnown = new Set(Object.keys(theInfos));
  const keysFilled = /* @__PURE__ */ new Set();
  return function AllEvent(u) {
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
  return function AnyEvent(u) {
    infos.forEach((info) => {
      info(u);
    });
  };
};

const applied = (baseEv, applier) => {
  return function AppliedEvent(u) {
    baseEv(function AppliedBaseUser(v) {
      u(applier(v));
    });
  };
};

const chain = (...infos) => {
  return function ChainEvent(u) {
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

const executorApplied = (baseEv, applier) => {
  return function ExecutorAppliedEvent(u) {
    const ExecutorAppliedBaseUser = applier(u);
    baseEv(ExecutorAppliedBaseUser);
  };
};

const filtered = (baseEv, predicate, defaultValue) => {
  return function FilteredEvent(u) {
    baseEv(function FilteredBaseUser(v) {
      if (predicate(v)) {
        u(v);
      } else if (defaultValue !== void 0) {
        u(defaultValue);
      }
    });
  };
};

const fromEvent = (emitterEv, eventNameEv, subscribeMethodEv, unsubscribeMethodEv) => {
  let lastU = null;
  const handler = function FromEventHandler(v) {
    if (lastU) {
      lastU(v);
    }
  };
  return function FromEventEvent(u) {
    lastU = u;
    const a = all(emitterEv, eventNameEv, subscribeMethodEv);
    a(function FromEventAllUser([emitter, eventName, subscribe]) {
      if (!emitter?.[subscribe]) {
        return;
      }
      emitter[subscribe](eventName, handler);
    });
    return function FromEventDestructor() {
      lastU = null;
      if (!unsubscribeMethodEv) {
        return;
      }
      const a2 = all(emitterEv, eventNameEv, unsubscribeMethodEv);
      a2(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, handler);
      });
    };
  };
};

const fromPromise = (p, errorOwner) => {
  return function FromPromiseEvent(u) {
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
    event: function LateEvent(u) {
      if (lateUser) {
        throw new Error(
          "Late component gets new user, when another was already connected!"
        );
      }
      lateUser = u;
      notify(v);
    },
    use: function LateUser(v2) {
      notify(v2);
    }
  };
};

const once = (baseEv) => {
  return function OnceEvent(u) {
    let isFilled = false;
    baseEv(function OnceBaseUser(v) {
      if (!isFilled) {
        isFilled = true;
        u(v);
      }
    });
  };
};

const shared = (baseEv, stateless = false) => {
  const ownersPool = new OwnerPool();
  let lastValue;
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
    use: function SharedUser(value) {
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
    }
  };
};

const sharedSource = (baseEv, stateless = false) => {
  const sharedEv = shared(baseEv.event, stateless);
  return {
    event: function SharedSourceEvent(u) {
      sharedEv.event(u);
    },
    use: function SharedSourceUser(v) {
      sharedEv.touched();
      baseEv.use(v);
    }
  };
};

const lateShared = (value) => {
  return sharedSource(late(value));
};

const constructorApplied = (baseConstructor, applier) => {
  return function LazyAppliedData(...args) {
    return applier(baseConstructor(...args));
  };
};

const constructorArgs = (baseConstructor, args, startFromArgIndex = 0) => {
  return function ConstructorArgsEvent(...runArgs) {
    return baseConstructor(...mergeAtIndex(runArgs, args, startFromArgIndex));
  };
};
function mergeAtIndex(arr1, arr2, index) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(void 0);
  return result.concat(arr2);
}

const constructorDestroyable = (baseConstructor) => {
  const destructors = [];
  return {
    get: function ConstructorDestroyable(...args) {
      const inst = baseConstructor(...args);
      return (user) => {
        if ("destroy" in inst) {
          destructors.push(inst.destroy);
          inst.event(user);
        } else {
          const d = inst(user);
          if (d) {
            destructors.push(d);
          }
        }
        return () => {
          destructors.forEach((i) => i());
        };
      };
    },
    destroy: function ConstructorDestructor() {
      destructors.forEach((i) => i());
    }
  };
};

const destructor = (baseEv, destructorUser) => {
  let mbDestructor;
  let theUser = null;
  const destroy = () => {
    theUser = null;
    mbDestructor?.();
  };
  return {
    event: function DestructorData(u) {
      theUser = u;
      mbDestructor = baseEv((v) => {
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

const local = (baseEv) => {
  return function LocalEvent(user) {
    let destroyed = false;
    const d = baseEv(function LocalBaseUser(v) {
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

const of = (value) => function OfEvent(u) {
  return u(value);
};

const on = (event, user) => event(user);

const _void = () => function VoidEvent() {
};

const destroyContainer = () => {
  const destructors = [];
  return {
    add(e) {
      const d = destructor(e);
      destructors.push(d.destroy);
      return d.event;
    },
    destroy() {
      destructors.forEach((d) => d());
    }
  };
};

const map = (baseEv, targetEv) => {
  return function MapData(u) {
    baseEv(function MapBaseUser(v) {
      const infos = [];
      v.forEach((val) => {
        let valInfo = val;
        if (typeof valInfo !== "function") {
          valInfo = of(valInfo);
        }
        const info = targetEv(valInfo);
        infos.push(info);
      });
      const allI = all(...infos);
      allI(u);
    });
  };
};

const primitive = (baseEv, theValue = null) => {
  baseEv(function PrimitiveBaseUser(v) {
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

const sequence = (baseEv) => {
  return function SequenceEvent(u) {
    const result = [];
    baseEv(function SequenceBaseUser(v) {
      result.push(v);
      u(result);
    });
  };
};

const stream = (baseEv) => {
  return function StreamEvent(u) {
    baseEv(function StreamBaseUser(v) {
      v.forEach((cv) => {
        u(cv);
      });
    });
  };
};

export { OwnerPool, _void, all, any, applied, chain, constructorApplied, constructorArgs, constructorDestroyable, destroyContainer, destructor, executorApplied, filtered, fromEvent, fromPromise, isFilled, late, lateShared, local, map, of, on, once, primitive, sequence, shared, sharedSource, stream };
//# sourceMappingURL=silentium.js.map
