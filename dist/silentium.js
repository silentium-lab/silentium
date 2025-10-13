const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
function All(...theInfos) {
  const keysKnown = new Set(Object.keys(theInfos));
  const keysFilled = /* @__PURE__ */ new Set();
  return function AllEvent(user) {
    const result = {};
    Object.entries(theInfos).forEach(([key, info]) => {
      keysKnown.add(key);
      info(function AllItemUser(v) {
        keysFilled.add(key);
        result[key] = v;
        if (isAllFilled(keysFilled, keysKnown)) {
          user(Object.values(result));
        }
      });
    });
  };
}

function Any(...infos) {
  return function AnyEvent(user) {
    infos.forEach((info) => {
      info(user);
    });
  };
}

function Applied(baseEv, applier) {
  return function AppliedEvent(user) {
    baseEv(function AppliedBaseUser(v) {
      user(applier(v));
    });
  };
}

function Chain(...infos) {
  return function ChainEvent(user) {
    let lastValue;
    const handleI = (index) => {
      const info = infos[index];
      const nextI = infos[index + 1];
      info(function ChainItemUser(v) {
        if (!nextI) {
          lastValue = v;
        }
        if (lastValue) {
          user(lastValue);
        }
        if (nextI && !lastValue) {
          handleI(index + 1);
        }
      });
    };
    handleI(0);
  };
}

function ExecutorApplied(baseEv, applier) {
  return function ExecutorAppliedEvent(user) {
    const ExecutorAppliedBaseUser = applier(user);
    baseEv(ExecutorAppliedBaseUser);
  };
}

function Filtered(baseEv, predicate, defaultValue) {
  return function FilteredEvent(user) {
    baseEv(function FilteredBaseUser(v) {
      if (predicate(v)) {
        user(v);
      } else if (defaultValue !== void 0) {
        user(defaultValue);
      }
    });
  };
}

function FromEvent(emitterEv, eventNameEv, subscribeMethodEv, unsubscribeMethodEv) {
  let lastU = null;
  const handler = function FromEventHandler(v) {
    if (lastU) {
      lastU(v);
    }
  };
  return function FromEventEvent(user) {
    lastU = user;
    const a = All(emitterEv, eventNameEv, subscribeMethodEv);
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
      const a2 = All(emitterEv, eventNameEv, unsubscribeMethodEv);
      a2(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, handler);
      });
    };
  };
}

function FromPromise(p, errorOwner) {
  return function FromPromiseEvent(user) {
    p.then(function FromPromiseThen(v) {
      user(v);
    }).catch(function FromPromiseCatch(e) {
      errorOwner?.(e);
    });
  };
}

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

function Late(v) {
  let lateUser = null;
  const notify = (v2) => {
    if (isFilled(v2) && lateUser) {
      lateUser(v2);
    }
  };
  return {
    event: function LateEvent(user) {
      if (lateUser) {
        throw new Error(
          "Late component gets new user, when another was already connected!"
        );
      }
      lateUser = user;
      notify(v);
    },
    use: function LateUser(v2) {
      notify(v2);
    }
  };
}

function Once(baseEv) {
  return function OnceEvent(user) {
    let isFilled = false;
    baseEv(function OnceBaseUser(v) {
      if (!isFilled) {
        isFilled = true;
        user(v);
      }
    });
  };
}

function Shared(baseEv, stateless = false) {
  const ownersPool = new OwnerPool();
  let lastValue;
  const calls = Late();
  Once(calls.event)(function SharedCallsUser() {
    baseEv(function SharedBaseUser(v) {
      lastValue = v;
      ownersPool.owner()(v);
    });
  });
  return {
    event: function SharedEvent(user) {
      calls.use(1);
      if (!stateless && isFilled(lastValue) && !ownersPool.has(user)) {
        user(lastValue);
      }
      ownersPool.add(user);
      return () => {
        ownersPool.remove(user);
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
}

function SharedSource(baseEv, stateless = false) {
  const sharedEv = Shared(baseEv.event, stateless);
  return {
    event: function SharedSourceEvent(user) {
      sharedEv.event(user);
    },
    use: function SharedSourceUser(v) {
      sharedEv.touched();
      baseEv.use(v);
    }
  };
}

function LateShared(value) {
  return SharedSource(Late(value));
}

function ConstructorApplied(baseConstructor, applier) {
  return function LazyAppliedData(...args) {
    return applier(baseConstructor(...args));
  };
}

function ConstructorArgs(baseConstructor, args, startFromArgIndex = 0) {
  return function ConstructorArgsEvent(...runArgs) {
    return baseConstructor(...mergeAtIndex(runArgs, args, startFromArgIndex));
  };
}
function mergeAtIndex(arr1, arr2, index) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(void 0);
  return result.concat(arr2);
}

function ConstructorDestroyable(baseConstructor) {
  const destructors = [];
  return {
    get: function ConstructorDestroyableGet(...args) {
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
}

function Destructor(baseEv, destructorUser) {
  let mbDestructor;
  let theUser = null;
  const destroy = () => {
    theUser = null;
    mbDestructor?.();
  };
  return {
    event: function DestructorEvent(user) {
      theUser = new WeakRef(user);
      mbDestructor = baseEv((v) => {
        if (theUser) {
          theUser.deref()?.(v);
        }
      });
      if (mbDestructor && destructorUser) {
        destructorUser(destroy);
      }
      return destroy;
    },
    destroy
  };
}

function Local(baseEv) {
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
}

function Of(value) {
  return function OfEvent(user) {
    return user(value);
  };
}

function On(event, user) {
  return event(user);
}

function Void() {
  return function VoidEvent() {
  };
}

function DestroyContainer() {
  const destructors = [];
  return {
    add(e) {
      const d = Destructor(e);
      destructors.push(d.destroy);
      return d.event;
    },
    destroy() {
      destructors.forEach((d) => d());
    }
  };
}

function Map(baseEv, targetEv) {
  return function MapData(user) {
    baseEv(function MapBaseUser(v) {
      const infos = [];
      v.forEach((val) => {
        let valInfo = val;
        if (typeof valInfo !== "function") {
          valInfo = Of(valInfo);
        }
        const info = targetEv(valInfo);
        infos.push(info);
      });
      const allI = All(...infos);
      allI(user);
    });
  };
}

function Primitive(baseEv, theValue = null) {
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
}

function Sequence(baseEv) {
  return function SequenceEvent(user) {
    const result = [];
    baseEv(function SequenceBaseUser(v) {
      result.push(v);
      user(result);
    });
  };
}

function Stream(baseEv) {
  return function StreamEvent(user) {
    baseEv(function StreamBaseUser(v) {
      v.forEach((cv) => {
        user(cv);
      });
    });
  };
}

export { All, Any, Applied, Chain, ConstructorApplied, ConstructorArgs, ConstructorDestroyable, DestroyContainer, Destructor, ExecutorApplied, Filtered, FromEvent, FromPromise, Late, LateShared, Local, Map, Of, On, Once, OwnerPool, Primitive, Sequence, Shared, SharedSource, Stream, Void, isFilled };
//# sourceMappingURL=silentium.js.map
