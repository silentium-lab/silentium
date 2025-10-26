import { isEvent as isEvent$1 } from 'src/helpers';

const isFilled = (value) => {
  return value !== void 0 && value !== null;
};
function isEvent(o) {
  return o !== null && typeof o === "object" && "event" in o && typeof o.event === "function";
}
function isDestroyable(o) {
  return o !== null && typeof o === "object" && "destroy" in o && typeof o.destroy === "function";
}
function isUser(o) {
  return o !== null && typeof o === "object" && "use" in o && typeof o.use === "function";
}
function isTransport(o) {
  return o !== null && typeof o === "object" && "of" in o && typeof o.of === "function";
}

function ensureFunction(v, label) {
  if (typeof v !== "function") {
    throw new Error(`${label}: is not function`);
  }
}
function ensureEvent(v, label) {
  if (!isEvent(v)) {
    throw new Error(`${label}: is not event`);
  }
}
function ensureUser(v, label) {
  if (!isUser(v)) {
    throw new Error(`${label}: is not user`);
  }
}

var __defProp$j = Object.defineProperty;
var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$j = (obj, key, value) => __defNormalProp$j(obj, key + "" , value);
class DestroyContainer {
  constructor() {
    __publicField$j(this, "destructors", []);
  }
  add(e) {
    this.destructors.push(e);
    return this;
  }
  destroy() {
    this.destructors.forEach((d) => d.destroy());
    return this;
  }
}

var __defProp$i = Object.defineProperty;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$i = (obj, key, value) => __defNormalProp$i(obj, key + "" , value);
class Event {
  constructor(eventExecutor) {
    this.eventExecutor = eventExecutor;
    __publicField$i(this, "mbDestructor");
    ensureFunction(eventExecutor, "Event: eventExecutor");
  }
  event(user) {
    this.mbDestructor = this.eventExecutor(user);
    return this;
  }
  destroy() {
    if (typeof this.mbDestructor === "function") {
      this.mbDestructor?.();
    }
    return this;
  }
}

var __defProp$h = Object.defineProperty;
var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$h = (obj, key, value) => __defNormalProp$h(obj, typeof key !== "symbol" ? key + "" : key, value);
class Local {
  constructor($base) {
    this.$base = $base;
    __publicField$h(this, "destroyed", false);
    __publicField$h(this, "user", new ParentUser((v, child) => {
      if (!this.destroyed) {
        child.use(v);
      }
    }));
    ensureEvent($base, "Local: $base");
  }
  event(user) {
    this.$base.event(this.user.child(user));
    return this;
  }
  destroy() {
    return this;
  }
}

class Of {
  constructor(value) {
    this.value = value;
  }
  event(user) {
    user.use(this.value);
    return this;
  }
}

class Void {
  use() {
    return this;
  }
}

var __defProp$g = Object.defineProperty;
var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$g = (obj, key, value) => __defNormalProp$g(obj, typeof key !== "symbol" ? key + "" : key, value);
class OwnerPool {
  constructor() {
    __publicField$g(this, "owners");
    __publicField$g(this, "innerOwner");
    this.owners = /* @__PURE__ */ new Set();
    this.innerOwner = new User((v) => {
      this.owners.forEach((g) => {
        g.use(v);
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

class User {
  constructor(userExecutor) {
    this.userExecutor = userExecutor;
    ensureFunction(userExecutor, "User: user executor");
  }
  use(value) {
    this.userExecutor(value);
    return this;
  }
}
class ParentUser {
  constructor(userExecutor, args = [], childUser) {
    this.userExecutor = userExecutor;
    this.args = args;
    this.childUser = childUser;
    ensureFunction(userExecutor, "ParentUser: executor");
  }
  use(value) {
    if (this.childUser === void 0) {
      throw new Error("no base user");
    }
    this.userExecutor(value, this.childUser, ...this.args);
    return this;
  }
  child(user, ...args) {
    return new ParentUser(this.userExecutor, [...this.args, ...args], user);
  }
}

var __defProp$f = Object.defineProperty;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$f = (obj, key, value) => __defNormalProp$f(obj, typeof key !== "symbol" ? key + "" : key, value);
const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
class All {
  constructor(...events) {
    __publicField$f(this, "keysKnown");
    __publicField$f(this, "keysFilled", /* @__PURE__ */ new Set());
    __publicField$f(this, "$events");
    __publicField$f(this, "result", {});
    __publicField$f(this, "user", new ParentUser((v, child, key) => {
      this.keysFilled.add(key);
      this.result[key] = v;
      if (isAllFilled(this.keysFilled, this.keysKnown)) {
        child.use(Object.values(this.result));
      }
    }));
    this.keysKnown = new Set(Object.keys(events));
    this.$events = events;
  }
  event(user) {
    Object.entries(this.$events).forEach(([key, event]) => {
      ensureEvent(event, "All: item");
      this.keysKnown.add(key);
      event.event(this.user.child(user, key));
    });
    return this;
  }
}

var __defProp$e = Object.defineProperty;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$e = (obj, key, value) => __defNormalProp$e(obj, key + "" , value);
class Any {
  constructor(...events) {
    __publicField$e(this, "$events");
    this.$events = events;
  }
  event(user) {
    this.$events.forEach((event) => {
      ensureEvent(event, "Any: item");
      event.event(user);
    });
    return this;
  }
}

var __defProp$d = Object.defineProperty;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$d = (obj, key, value) => __defNormalProp$d(obj, key + "" , value);
class Applied {
  constructor($base, applier) {
    this.$base = $base;
    this.applier = applier;
    __publicField$d(this, "user", new ParentUser((v, child) => {
      child.use(this.applier(v));
    }));
    ensureEvent($base, "Applied: base");
  }
  event(user) {
    this.$base.event(this.user.child(user));
    return this;
  }
}

class Catch {
  constructor($base, errorMessage, errorOriginal) {
    this.$base = $base;
    this.errorMessage = errorMessage;
    this.errorOriginal = errorOriginal;
    ensureEvent($base, "Catch: base");
    ensureUser(errorMessage, "Catch: errorMessage");
    if (errorOriginal !== void 0) {
      ensureUser(errorOriginal, "Catch: errorOriginal");
    }
  }
  event(user) {
    try {
      this.$base.event(user);
    } catch (e) {
      if (e instanceof Error) {
        this.errorMessage.use(e.message);
      } else {
        this.errorMessage.use(e);
      }
      if (this.errorOriginal) {
        this.errorOriginal.use(e);
      }
    }
    return this;
  }
}

var __defProp$c = Object.defineProperty;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$c = (obj, key, value) => __defNormalProp$c(obj, typeof key !== "symbol" ? key + "" : key, value);
class Chain {
  constructor(...events) {
    __publicField$c(this, "$events");
    __publicField$c(this, "lastValue");
    __publicField$c(this, "handleEvent", (index, user) => {
      const event = this.$events[index];
      const nextI = this.$events[index + 1];
      event.event(this.oneEventUser.child(user, nextI, index));
    });
    __publicField$c(this, "oneEventUser", new ParentUser(
      (v, child, nextI, index) => {
        if (!nextI) {
          this.lastValue = v;
        }
        if (this.lastValue) {
          child.use(this.lastValue);
        }
        if (nextI && !this.lastValue) {
          this.handleEvent(index + 1, child);
        }
      }
    ));
    this.$events = events;
  }
  event(user) {
    this.handleEvent(0, user);
    return this;
  }
}

class ExecutorApplied {
  constructor($base, applier) {
    this.$base = $base;
    this.applier = applier;
    ensureEvent($base, "ExecutorApplied: base");
  }
  event(user) {
    const ExecutorAppliedBaseUser = this.applier(user);
    this.$base.event(ExecutorAppliedBaseUser);
    return this;
  }
}

var __defProp$b = Object.defineProperty;
var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$b = (obj, key, value) => __defNormalProp$b(obj, key + "" , value);
class Filtered {
  constructor($base, predicate, defaultValue) {
    this.$base = $base;
    this.predicate = predicate;
    this.defaultValue = defaultValue;
    __publicField$b(this, "parent", new ParentUser((v, child) => {
      if (this.predicate(v)) {
        child.use(v);
      } else if (this.defaultValue !== void 0) {
        child.use(this.defaultValue);
      }
    }));
  }
  event(user) {
    this.$base.event(this.parent.child(user));
    return this;
  }
}

var __defProp$a = Object.defineProperty;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$a = (obj, key, value) => __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
class FromEvent {
  constructor($emitter, $eventName, $subscribeMethod, $unsubscribeMethod) {
    this.$emitter = $emitter;
    this.$eventName = $eventName;
    this.$subscribeMethod = $subscribeMethod;
    this.$unsubscribeMethod = $unsubscribeMethod;
    __publicField$a(this, "lastUser", null);
    __publicField$a(this, "handler", (v) => {
      if (this.lastUser) {
        this.lastUser.use(v);
      }
    });
    __publicField$a(this, "parent", new ParentUser(
      ([emitter, eventName, subscribe], parent) => {
        this.lastUser = parent;
        if (!emitter?.[subscribe]) {
          return;
        }
        emitter[subscribe](eventName, this.handler);
      }
    ));
  }
  event(user) {
    const a = new All(this.$emitter, this.$eventName, this.$subscribeMethod);
    a.event(this.parent.child(user));
    return this;
  }
  destroy() {
    this.lastUser = null;
    if (!this.$unsubscribeMethod) {
      return this;
    }
    const a = new All(this.$emitter, this.$eventName, this.$unsubscribeMethod);
    a.event(
      new User(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      })
    );
    return this;
  }
}

class FromPromise {
  constructor(p, errorOwner) {
    this.p = p;
    this.errorOwner = errorOwner;
  }
  event(user) {
    this.p.then(function FromPromiseThen(v) {
      user.use(v);
    }).catch((e) => {
      this.errorOwner?.use(e);
    });
    return this;
  }
}

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
class Late {
  constructor(v) {
    this.v = v;
    __publicField$9(this, "lateUser", null);
    __publicField$9(this, "notify", (v) => {
      if (isFilled(v) && this.lateUser) {
        this.lateUser.use(v);
      }
    });
  }
  event(user) {
    if (this.lateUser) {
      throw new Error(
        "Late component gets new user, when another was already connected!"
      );
    }
    this.lateUser = user;
    this.notify(this.v);
    return this;
  }
  use(value) {
    this.notify(value);
    return this;
  }
}

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
class Once {
  constructor($base) {
    this.$base = $base;
    __publicField$8(this, "isFilled", false);
    __publicField$8(this, "parent", new ParentUser((v, child) => {
      if (!this.isFilled) {
        this.isFilled = true;
        child.use(v);
      }
    }));
  }
  event(user) {
    this.$base.event(this.parent.child(user));
    return this;
  }
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
class Shared {
  constructor($base, stateless = false) {
    this.$base = $base;
    this.stateless = stateless;
    __publicField$7(this, "ownersPool", new OwnerPool());
    __publicField$7(this, "lastValue");
    __publicField$7(this, "calls", new Late());
    __publicField$7(this, "firstCall", new Once(this.calls).event(
      new User(() => {
        this.$base.event(this.firstCallUser);
      })
    ));
    __publicField$7(this, "firstCallUser", new User((v) => {
      this.lastValue = v;
      this.ownersPool.owner().use(v);
    }));
  }
  event(user) {
    this.calls.use(1);
    if (!this.stateless && isFilled(this.lastValue) && !this.ownersPool.has(user)) {
      user.use(this.lastValue);
    }
    this.ownersPool.add(user);
    return this;
  }
  use(value) {
    this.calls.use(1);
    this.lastValue = value;
    this.ownersPool.owner().use(value);
    return this;
  }
  touched() {
    this.calls.use(1);
  }
  pool() {
    return this.ownersPool;
  }
  destroy() {
    return this.ownersPool.destroy();
  }
}

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, key + "" , value);
class SharedSource {
  constructor($base, stateless = false) {
    this.$base = $base;
    __publicField$6(this, "$sharedBase");
    this.$sharedBase = new Shared(this.$base, stateless);
  }
  event(user) {
    this.$sharedBase.event(user);
    return this;
  }
  use(value) {
    this.$sharedBase.touched();
    this.$base.use(value);
    return this;
  }
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, key + "" , value);
class LateShared {
  constructor(value) {
    __publicField$5(this, "$event");
    this.$event = new SharedSource(new Late(value));
  }
  event(user) {
    this.$event.event(user);
    return this;
  }
  use(value) {
    this.$event.use(value);
    return this;
  }
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, key + "" , value);
class Map {
  constructor($base, $target) {
    this.$base = $base;
    this.$target = $target;
    __publicField$4(this, "parent", new ParentUser((v, child) => {
      const infos = [];
      v.forEach((val) => {
        let valInfo = val;
        if (!isEvent$1(valInfo)) {
          valInfo = new Of(valInfo);
        }
        const info = this.$target.of(valInfo);
        infos.push(info);
      });
      const allI = new All(...infos);
      allI.event(child);
    }));
  }
  event(user) {
    this.$base.event(this.parent.child(user));
    return this;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, key + "" , value);
class Primitive {
  constructor($base, theValue = null) {
    this.$base = $base;
    this.theValue = theValue;
    __publicField$3(this, "touched", false);
  }
  ensureTouched() {
    if (!this.touched) {
      this.$base.event(
        new User((v) => {
          this.theValue = v;
        })
      );
    }
    this.touched = true;
  }
  [Symbol.toPrimitive]() {
    this.ensureTouched();
    return this.theValue;
  }
  primitive() {
    this.ensureTouched();
    return this.theValue;
  }
  primitiveWithException() {
    this.ensureTouched();
    if (this.theValue === null) {
      throw new Error("Primitive value is null");
    }
    return this.theValue;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
class Sequence {
  constructor($base) {
    this.$base = $base;
    __publicField$2(this, "result", []);
    __publicField$2(this, "parent", new ParentUser((v, child) => {
      this.result.push(v);
      child.use(this.result);
    }));
  }
  event(user) {
    this.$base.event(this.parent.child(user));
    return this;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
class Stream {
  constructor($base) {
    this.$base = $base;
    __publicField$1(this, "parent", new ParentUser((v, child) => {
      v.forEach((cv) => {
        child.use(cv);
      });
    }));
  }
  event(user) {
    this.$base.event(this.parent.child(user));
    return this;
  }
}

class Transport {
  constructor(executor) {
    this.executor = executor;
  }
  of(...args) {
    return this.executor(...args);
  }
}

class TransportApplied {
  constructor(baseTransport, applier) {
    this.baseTransport = baseTransport;
    this.applier = applier;
  }
  of(...args) {
    return this.applier(this.baseTransport.of(...args));
  }
}

class TransportArgs {
  constructor(baseTransport, args, startFromArgIndex = 0) {
    this.baseTransport = baseTransport;
    this.args = args;
    this.startFromArgIndex = startFromArgIndex;
  }
  of(...runArgs) {
    return this.baseTransport.of(
      ...mergeAtIndex(runArgs, this.args, this.startFromArgIndex)
    );
  }
}
function mergeAtIndex(arr1, arr2, index) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(void 0);
  return result.concat(arr2);
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class TransportDestroyable {
  constructor(baseTransport) {
    this.baseTransport = baseTransport;
    __publicField(this, "destructors", []);
  }
  of(...args) {
    const inst = this.baseTransport.of(...args);
    if (isDestroyable(inst)) {
      this.destructors.push(inst);
    }
    return inst;
  }
  destroy() {
    this.destructors.forEach((i) => i.destroy());
    return this;
  }
}

export { All, Any, Applied, Catch, Chain, DestroyContainer, Event, ExecutorApplied, Filtered, FromEvent, FromPromise, Late, LateShared, Local, Map, Of, Once, OwnerPool, ParentUser, Primitive, Sequence, Shared, SharedSource, Stream, Transport, TransportApplied, TransportArgs, TransportDestroyable, User, Void, ensureEvent, ensureFunction, ensureUser, isDestroyable, isEvent, isFilled, isTransport, isUser };
//# sourceMappingURL=silentium.js.map
