const all = (...infos) => {
  return (g) => {
    const keysKnown = new Set(Object.keys(infos));
    const keysFilled = /* @__PURE__ */ new Set();
    const isAllFilled = () => {
      return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
    };
    const result = {};
    Object.entries(infos).forEach(([key, info]) => {
      keysKnown.add(key);
      info((v) => {
        keysFilled.add(key);
        result[key] = v;
        if (isAllFilled()) {
          g(Object.values(result));
        }
      });
    });
    return () => {
      keysKnown.clear();
      keysFilled.clear();
    };
  };
};

const any = (...infos) => {
  return (o) => {
    infos.forEach((info) => {
      info(o);
    });
  };
};

const applied = (base, applier) => {
  return (g) => {
    base((v) => {
      g(applier(v));
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

const onExecuted = (fn) => {
  let executed = false;
  return (...args) => {
    if (!executed) {
      fn(...args);
    }
    executed = true;
  };
};

const chain = (...infos) => {
  let theOwner;
  let lastValue;
  const respondedI = /* @__PURE__ */ new WeakMap();
  const handleI = (index) => {
    const info2 = infos[index];
    const nextI = infos[index + 1];
    info2((v) => {
      if (!nextI) {
        lastValue = v;
        theOwner?.(v);
      }
      if (nextI && lastValue !== void 0 && theOwner !== void 0) {
        theOwner?.(lastValue);
      }
      if (nextI && !respondedI.has(info2)) {
        handleI(index + 1);
      }
      respondedI.set(info2, 1);
    });
  };
  const executed = onExecuted((g) => {
    theOwner = g;
    handleI(0);
  });
  const info = (g) => {
    executed(g);
    theOwner = g;
  };
  return info;
};

const executorApplied = (base, applier) => {
  return (owner) => {
    base(applier(owner));
  };
};

const filtered = (base, predicate, defaultValue) => {
  return (owner) => {
    base((v) => {
      if (predicate(v)) {
        owner(v);
      } else if (defaultValue !== void 0) {
        owner(defaultValue);
      }
    });
  };
};

const fromCallback = (waitForCb, ...args) => {
  return (o) => {
    waitForCb(
      (v) => {
        o(v);
      },
      ...args
    );
  };
};

const fromEvent = (emitter, eventName, subscribeMethod, unsubscribeMethod) => {
  return (o) => {
    const handler = (...args) => {
      o(args);
    };
    emitter[subscribeMethod](eventName, handler);
    return () => {
      if (unsubscribeMethod !== void 0) {
        emitter[unsubscribeMethod](eventName, handler);
      }
    };
  };
};

const of = (sharedValue) => {
  let relatedO;
  const notifyO = () => {
    if (relatedO !== void 0 && isFilled(sharedValue)) {
      relatedO(sharedValue);
    }
  };
  const info = (o) => {
    relatedO = o;
    notifyO();
  };
  return [
    info,
    (v) => {
      sharedValue = v;
      notifyO();
    }
  ];
};

const fromPromise = (p) => {
  const [errorInf, errorOwn] = of();
  return [
    (own) => {
      p.then((v) => {
        own(v);
      }).catch((e) => {
        errorOwn(e);
      });
    },
    errorInf
  ];
};

const i = (v) => (o) => {
  o(v);
};

const lazyChain = (lazy, chainSrc) => {
  return (...args) => {
    const baseSrc = lazy(...args);
    return chain(chainSrc, baseSrc);
  };
};

const lazyClass = (constrFn) => (...args) => {
  const inst = new constrFn(...args);
  return (o) => {
    inst.value(o);
  };
};

const map = (base, targetI) => {
  return (g) => {
    base((v) => {
      const infos = [];
      v.forEach((val) => {
        let valInfo = val;
        if (typeof valInfo !== "function") {
          valInfo = i(valInfo);
        }
        const info = targetI(valInfo);
        infos.push(info);
      });
      const allI = all(...infos);
      allI(g);
    });
  };
};

const once = (base) => {
  return (owner) => {
    let isFilled = false;
    base((v) => {
      if (!isFilled) {
        isFilled = true;
        owner(v);
      }
    });
  };
};

const sequence = (base) => {
  return (o) => {
    const result = [];
    base((v) => {
      result.push(v);
      o(result);
    });
  };
};

const shared = (base) => {
  const ownersPool = new OwnerPool();
  let lastValue;
  const executed = onExecuted(() => {
    const gp = ownersPool.owner();
    base((v) => {
      gp(v);
      lastValue = v;
    });
  });
  const i = (g) => {
    executed();
    if (isFilled(lastValue) && !ownersPool.has(g)) {
      g(lastValue);
    }
    ownersPool.add(g);
    return () => {
      ownersPool.destroy();
    };
  };
  return [i, ownersPool];
};
const sharedStateless = (base) => {
  const ownersPool = new OwnerPool();
  const executed = onExecuted((g) => {
    ownersPool.add(g);
    base(ownersPool.owner());
  });
  const i = (g) => {
    executed(g);
    ownersPool.add(g);
    return () => {
      ownersPool.destroy();
    };
  };
  return [i, ownersPool];
};

const stream = (base) => {
  return (o) => {
    base((v) => {
      v.forEach((cv) => {
        o(cv);
      });
    });
  };
};

export { OwnerPool, all, any, applied, chain, executorApplied, filtered, fromCallback, fromEvent, fromPromise, i, isFilled, lazyChain, lazyClass, map, of, onExecuted, once, sequence, shared, sharedStateless, stream };
//# sourceMappingURL=silentium.js.map
