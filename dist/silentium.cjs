'use strict';

var helpers = require('src/helpers');
var DestroyFunc$1 = require('src/base/DestroyFunc');
var base = require('src/base');

class Destroyable {
  constructor(deps) {
    this.deps = deps;
  }
  destroy() {
    this.deps?.forEach((dep) => {
      if (dep instanceof Destroyable) {
        dep.destroy();
      }
    });
    return this;
  }
  /**
   * Add dependency what can be destroyed
   */
  addDep(dep) {
    this.deps?.push(dep);
    return this;
  }
}

class DestroyFunc extends Destroyable {
  constructor(destructor) {
    super();
    this.destructor = destructor;
  }
  destroy() {
    this.destructor();
    return this;
  }
}

class TheOwner {
}

class From extends TheOwner {
  constructor(fn) {
    super();
    this.fn = fn;
  }
  give(value) {
    this.fn(value);
    return this;
  }
}

class TheInformation extends Destroyable {
}

class Of extends TheInformation {
  constructor(theValue) {
    super([theValue]);
    this.theValue = theValue;
  }
  value(o) {
    if (helpers.isFilled(this.theValue)) {
      o.give(this.theValue);
    }
    return this;
  }
}

class Lazy extends Destroyable {
  constructor(buildFn) {
    super();
    this.buildFn = buildFn;
  }
  get(...args) {
    args.forEach((dep) => {
      this.addDep(dep);
    });
    return this.buildFn?.(...args) ?? new Of(null);
  }
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, key + "" , value);
class OfFunc extends TheInformation {
  constructor(valueFn) {
    super([valueFn]);
    this.valueFn = valueFn;
    __publicField$7(this, "mbDestructor");
  }
  value(o) {
    this.mbDestructor = this.valueFn(o);
    return this;
  }
  destroy() {
    super.destroy();
    this.mbDestructor?.();
    return this;
  }
}

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
class All extends TheInformation {
  constructor(...theInfos) {
    super(theInfos);
    __publicField$6(this, "keysKnown");
    __publicField$6(this, "keysFilled", /* @__PURE__ */ new Set());
    __publicField$6(this, "infos");
    this.infos = theInfos;
    this.keysKnown = new Set(Object.keys(theInfos));
  }
  value(o) {
    const result = {};
    Object.entries(this.infos).forEach(([key, info]) => {
      this.keysKnown.add(key);
      info.value(
        new From((v) => {
          this.keysFilled.add(key);
          result[key] = v;
          if (this.isAllFilled()) {
            o.give(Object.values(result));
          }
        })
      );
    });
    return this;
  }
  isAllFilled() {
    return this.keysFilled.size > 0 && this.keysFilled.size === this.keysKnown.size;
  }
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, key + "" , value);
class Any extends TheInformation {
  constructor(...theInfos) {
    super(theInfos);
    __publicField$5(this, "infos");
    this.infos = theInfos;
  }
  value(o) {
    this.infos.forEach((info) => {
      info.value(o);
    });
    return this;
  }
}

class Applied extends TheInformation {
  constructor(baseSrc, applier) {
    super([baseSrc]);
    this.baseSrc = baseSrc;
    this.applier = applier;
  }
  value(o) {
    this.baseSrc.value(
      new From((v) => {
        o.give(this.applier(v));
      })
    );
    return this;
  }
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, key + "" , value);
class Chain extends TheInformation {
  constructor(...infos) {
    super(infos);
    __publicField$4(this, "theInfos");
    this.theInfos = infos;
  }
  value(o) {
    let lastValue;
    const handleI = (index) => {
      const info = this.theInfos[index];
      const nextI = this.theInfos[index + 1];
      info.value(
        new From((v) => {
          if (!nextI) {
            lastValue = v;
          }
          if (lastValue) {
            o.give(lastValue);
          }
          if (nextI && !lastValue) {
            handleI(index + 1);
          }
        })
      );
    };
    handleI(0);
    return this;
  }
}

class ExecutorApplied extends TheInformation {
  constructor(baseSrc, applier) {
    super([baseSrc]);
    this.baseSrc = baseSrc;
    this.applier = applier;
  }
  value(o) {
    this.baseSrc.value(
      new From(
        this.applier((v) => {
          o.give(v);
        })
      )
    );
    return this;
  }
}

class Filtered extends TheInformation {
  constructor(baseSrc, predicate, defaultValue) {
    super([baseSrc]);
    this.baseSrc = baseSrc;
    this.predicate = predicate;
    this.defaultValue = defaultValue;
  }
  value(o) {
    this.baseSrc.value(
      new From((v) => {
        if (this.predicate(v)) {
          o.give(v);
        } else if (this.defaultValue !== void 0) {
          o.give(this.defaultValue);
        }
      })
    );
    return this;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, key + "" , value);
class FromCallback extends TheInformation {
  constructor(waitForCb, ...args) {
    super([waitForCb]);
    this.waitForCb = waitForCb;
    __publicField$3(this, "theArgs");
    this.theArgs = args;
  }
  value(o) {
    this.waitForCb(
      (v) => {
        o.give(v);
      },
      ...this.theArgs
    );
    return this;
  }
}

class FromEvent extends TheInformation {
  constructor(emitterSrc, eventNameSrc, subscribeMethodSrc, unsubscribeMethodSrc = new Of("")) {
    super([emitterSrc, eventNameSrc, subscribeMethodSrc, unsubscribeMethodSrc]);
    this.emitterSrc = emitterSrc;
    this.eventNameSrc = eventNameSrc;
    this.subscribeMethodSrc = subscribeMethodSrc;
    this.unsubscribeMethodSrc = unsubscribeMethodSrc;
  }
  value(o) {
    const a = new All(
      this.emitterSrc,
      this.eventNameSrc,
      this.subscribeMethodSrc,
      this.unsubscribeMethodSrc
    );
    const handler = (v) => {
      o.give(v);
    };
    a.value(
      new From(([emitter, eventName, subscribe, unsubscribe]) => {
        emitter[subscribe](eventName, handler);
        this.addDep(
          new DestroyFunc$1.DestroyFunc(() => {
            emitter[unsubscribe](eventName, handler);
          })
        );
      })
    );
    return this;
  }
}

class FromPromise extends TheInformation {
  constructor(p, errorOwner) {
    super([p]);
    this.p = p;
    this.errorOwner = errorOwner;
  }
  value(o) {
    this.p.then((v) => {
      o.give(v);
    }).catch((e) => {
      this.errorOwner?.give(e);
    });
    return this;
  }
}

const isFilled = (value) => {
  return value !== void 0 && value !== null;
};

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
class OwnerPool {
  constructor() {
    __publicField$2(this, "owners");
    __publicField$2(this, "innerOwner");
    this.owners = /* @__PURE__ */ new Set();
    this.innerOwner = new From((v) => {
      this.owners.forEach((g) => {
        g.give(v);
      });
    });
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

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
class Late extends TheInformation {
  constructor(theValue) {
    super([theValue]);
    this.theValue = theValue;
    __publicField$1(this, "theOwner");
    __publicField$1(this, "lateOwner", new From((v) => {
      this.theValue = v;
      this.notify();
    }));
  }
  value(o) {
    if (this.theOwner) {
      throw new Error(
        "Late component gets new owner, when another was already connected!"
      );
    }
    this.theOwner = o;
    this.notify();
    return this;
  }
  owner() {
    return this.lateOwner;
  }
  notify() {
    if (isFilled(this.theValue) && this.theOwner) {
      this.theOwner.give(this.theValue);
    }
    return this;
  }
}

class LazyApplied extends base.Lazy {
  constructor(baseLazy, applier) {
    super();
    this.baseLazy = baseLazy;
    this.applier = applier;
  }
  get(...args) {
    return this.applier(this.baseLazy.get(...args));
  }
}

class LazyClass extends Lazy {
  constructor(constrFn) {
    const buildFn = (...args) => new constrFn(...args);
    super(buildFn);
  }
}

class Map extends TheInformation {
  constructor(baseSrc, targetSrc) {
    super([baseSrc, targetSrc]);
    this.baseSrc = baseSrc;
    this.targetSrc = targetSrc;
  }
  value(o) {
    this.baseSrc.value(
      new From((v) => {
        const infos = [];
        v.forEach((val) => {
          let valInfo = val;
          if (!(valInfo instanceof TheInformation)) {
            valInfo = new Of(valInfo);
          }
          const info = this.targetSrc.get(valInfo);
          infos.push(info);
        });
        const allI = new All(...infos);
        allI.value(o);
      })
    );
    return this;
  }
}

class Once extends TheInformation {
  constructor(baseSrc) {
    super();
    this.baseSrc = baseSrc;
  }
  value(o) {
    let isFilled = false;
    this.baseSrc.value(
      new From((v) => {
        if (!isFilled) {
          isFilled = true;
          o.give(v);
        }
      })
    );
    return this;
  }
}

class Sequence extends TheInformation {
  constructor(baseSrc) {
    super([baseSrc]);
    this.baseSrc = baseSrc;
  }
  value(o) {
    const result = [];
    this.baseSrc.value(
      new From((v) => {
        result.push(v);
        o.give(result);
      })
    );
    return this;
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class Shared extends TheInformation {
  constructor(baseSrc, stateless = false) {
    super([baseSrc]);
    this.baseSrc = baseSrc;
    this.stateless = stateless;
    __publicField(this, "lastValue");
    __publicField(this, "ownersPool", new OwnerPool());
    this.addDep(this.ownersPool);
    this.baseSrc.value(
      new From((v) => {
        this.ownersPool.owner().give(v);
        this.lastValue = v;
      })
    );
  }
  value(o) {
    const i = new OfFunc((g) => {
      if (!this.stateless && isFilled(this.lastValue) && !this.ownersPool.has(g)) {
        g.give(this.lastValue);
      }
      this.ownersPool.add(g);
      return () => {
        this.ownersPool.remove(g);
      };
    });
    i.value(o);
    this.addDep(i);
    return this;
  }
  pool() {
    return this.ownersPool;
  }
}

class Stream extends TheInformation {
  constructor(baseSrc) {
    super([baseSrc]);
    this.baseSrc = baseSrc;
  }
  value(o) {
    this.baseSrc.value(
      new From((v) => {
        v.forEach((cv) => {
          o.give(cv);
        });
      })
    );
    return this;
  }
}

exports.All = All;
exports.Any = Any;
exports.Applied = Applied;
exports.Chain = Chain;
exports.DestroyFunc = DestroyFunc;
exports.Destroyable = Destroyable;
exports.ExecutorApplied = ExecutorApplied;
exports.Filtered = Filtered;
exports.From = From;
exports.FromCallback = FromCallback;
exports.FromEvent = FromEvent;
exports.FromPromise = FromPromise;
exports.Late = Late;
exports.Lazy = Lazy;
exports.LazyApplied = LazyApplied;
exports.LazyClass = LazyClass;
exports.Map = Map;
exports.Of = Of;
exports.OfFunc = OfFunc;
exports.Once = Once;
exports.OwnerPool = OwnerPool;
exports.Sequence = Sequence;
exports.Shared = Shared;
exports.Stream = Stream;
exports.TheInformation = TheInformation;
exports.TheOwner = TheOwner;
exports.isFilled = isFilled;
//# sourceMappingURL=silentium.cjs.map
