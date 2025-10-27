'use strict';

const isFilled = (value) => {
  return value !== void 0 && value !== null;
};
function isEvent(o) {
  return o !== null && typeof o === "object" && "event" in o && typeof o.event === "function";
}
function isDestroyable(o) {
  return o !== null && typeof o === "object" && "destroy" in o && typeof o.destroy === "function";
}
function isTransport(o) {
  return o !== null && typeof o === "object" && "use" in o && typeof o.use === "function";
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
function ensureTransport(v, label) {
  if (!isTransport(v)) {
    throw new Error(`${label}: is not transport`);
  }
}

var __defProp$j = Object.defineProperty;
var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$j = (obj, key, value) => __defNormalProp$j(obj, key + "" , value);
function DestroyContainer() {
  return new TheDestroyContainer();
}
class TheDestroyContainer {
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
function Event(eventExecutor) {
  return new TheEvent(eventExecutor);
}
class TheEvent {
  constructor(eventExecutor) {
    this.eventExecutor = eventExecutor;
    __publicField$i(this, "mbDestructor");
    ensureFunction(eventExecutor, "Event: eventExecutor");
  }
  event(transport) {
    this.mbDestructor = this.eventExecutor(transport);
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
function Local($base) {
  return new TheLocal($base);
}
class TheLocal {
  constructor($base) {
    this.$base = $base;
    __publicField$h(this, "destroyed", false);
    __publicField$h(this, "transport", new ParentTransport((v, child) => {
      if (!this.destroyed) {
        child.use(v);
      }
    }));
    ensureEvent($base, "Local: $base");
  }
  event(transport) {
    this.$base.event(this.transport.child(transport));
    return this;
  }
  destroy() {
    return this;
  }
}

function Of(value) {
  return new TheOf(value);
}
class TheOf {
  constructor(value) {
    this.value = value;
  }
  event(transport) {
    transport.use(this.value);
    return this;
  }
}

function Void() {
  return new TheVoid();
}
class TheVoid {
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
    this.innerOwner = Transport((v) => {
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

function Transport(transportExecutor) {
  return new TheTransport(transportExecutor);
}
class TheTransport {
  constructor(transportExecutor) {
    this.transportExecutor = transportExecutor;
    ensureFunction(transportExecutor, "Transport: transport executor");
  }
  use(value) {
    this.transportExecutor(value);
    return this;
  }
}
function TransportEvent(transportExecutor) {
  return new TheTransportEvent(transportExecutor);
}
class TheTransportEvent {
  constructor(executor) {
    this.executor = executor;
    ensureFunction(executor, "TheTransportEvent: transport executor");
  }
  use(value) {
    return this.executor(value);
  }
}
class ParentTransport {
  constructor(executor, args = [], _child) {
    this.executor = executor;
    this.args = args;
    this._child = _child;
    ensureFunction(executor, "ParentTransport: executor");
  }
  use(value) {
    if (this._child === void 0) {
      throw new Error("no base transport");
    }
    this.executor(value, this._child, ...this.args);
    return this;
  }
  child(transport, ...args) {
    return new ParentTransport(
      this.executor,
      [...this.args, ...args],
      transport
    );
  }
}

var __defProp$f = Object.defineProperty;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$f = (obj, key, value) => __defNormalProp$f(obj, typeof key !== "symbol" ? key + "" : key, value);
const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
function All(...events) {
  return new TheAll(...events);
}
class TheAll {
  constructor(...events) {
    __publicField$f(this, "keysKnown");
    __publicField$f(this, "keysFilled", /* @__PURE__ */ new Set());
    __publicField$f(this, "$events");
    __publicField$f(this, "result", {});
    __publicField$f(this, "transport", new ParentTransport(
      (v, child, key) => {
        this.keysFilled.add(key);
        this.result[key] = v;
        if (isAllFilled(this.keysFilled, this.keysKnown)) {
          child.use(Object.values(this.result));
        }
      }
    ));
    this.keysKnown = new Set(Object.keys(events));
    this.$events = events;
  }
  event(transport) {
    Object.entries(this.$events).forEach(([key, event]) => {
      ensureEvent(event, "All: item");
      this.keysKnown.add(key);
      event.event(this.transport.child(transport, key));
    });
    return this;
  }
}

var __defProp$e = Object.defineProperty;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$e = (obj, key, value) => __defNormalProp$e(obj, key + "" , value);
function Any(...events) {
  return new TheAny(...events);
}
class TheAny {
  constructor(...events) {
    __publicField$e(this, "$events");
    this.$events = events;
  }
  event(transport) {
    this.$events.forEach((event) => {
      ensureEvent(event, "Any: item");
      event.event(transport);
    });
    return this;
  }
}

var __defProp$d = Object.defineProperty;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$d = (obj, key, value) => __defNormalProp$d(obj, key + "" , value);
function Applied($base, applier) {
  return new TheApplied($base, applier);
}
class TheApplied {
  constructor($base, applier) {
    this.$base = $base;
    this.applier = applier;
    __publicField$d(this, "transport", new ParentTransport((v, child) => {
      child.use(this.applier(v));
    }));
    ensureEvent($base, "Applied: base");
  }
  event(transport) {
    this.$base.event(this.transport.child(transport));
    return this;
  }
}

function Catch($base, errorMessage, errorOriginal) {
  return new TheCatch($base, errorMessage, errorOriginal);
}
class TheCatch {
  constructor($base, errorMessage, errorOriginal) {
    this.$base = $base;
    this.errorMessage = errorMessage;
    this.errorOriginal = errorOriginal;
    ensureEvent($base, "Catch: base");
    ensureTransport(errorMessage, "Catch: errorMessage");
    if (errorOriginal !== void 0) {
      ensureTransport(errorOriginal, "Catch: errorOriginal");
    }
  }
  event(transport) {
    try {
      this.$base.event(transport);
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
function Chain(...events) {
  return new TheChain(...events);
}
class TheChain {
  constructor(...events) {
    __publicField$c(this, "$events");
    __publicField$c(this, "lastValue");
    __publicField$c(this, "handleEvent", (index, transport) => {
      const event = this.$events[index];
      const nextI = this.$events[index + 1];
      event.event(this.oneEventTransport.child(transport, nextI, index));
    });
    __publicField$c(this, "oneEventTransport", new ParentTransport(
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
  event(transport) {
    this.handleEvent(0, transport);
    return this;
  }
}

function ExecutorApplied($base, applier) {
  return new TheExecutorApplied($base, applier);
}
class TheExecutorApplied {
  constructor($base, applier) {
    this.$base = $base;
    this.applier = applier;
    ensureEvent($base, "ExecutorApplied: base");
  }
  event(transport) {
    const ExecutorAppliedBaseTransport = this.applier(
      transport.use.bind(transport)
    );
    this.$base.event(Transport(ExecutorAppliedBaseTransport));
    return this;
  }
}

var __defProp$b = Object.defineProperty;
var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$b = (obj, key, value) => __defNormalProp$b(obj, key + "" , value);
function Filtered($base, predicate, defaultValue) {
  return new TheFiltered($base, predicate, defaultValue);
}
class TheFiltered {
  constructor($base, predicate, defaultValue) {
    this.$base = $base;
    this.predicate = predicate;
    this.defaultValue = defaultValue;
    __publicField$b(this, "parent", new ParentTransport((v, child) => {
      if (this.predicate(v)) {
        child.use(v);
      } else if (this.defaultValue !== void 0) {
        child.use(this.defaultValue);
      }
    }));
  }
  event(transport) {
    this.$base.event(this.parent.child(transport));
    return this;
  }
}

var __defProp$a = Object.defineProperty;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$a = (obj, key, value) => __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
function FromEvent($emitter, $eventName, $subscribeMethod, $unsubscribeMethod) {
  return new TheFromEvent(
    $emitter,
    $eventName,
    $subscribeMethod,
    $unsubscribeMethod
  );
}
class TheFromEvent {
  constructor($emitter, $eventName, $subscribeMethod, $unsubscribeMethod) {
    this.$emitter = $emitter;
    this.$eventName = $eventName;
    this.$subscribeMethod = $subscribeMethod;
    this.$unsubscribeMethod = $unsubscribeMethod;
    __publicField$a(this, "lastTransport", null);
    __publicField$a(this, "handler", (v) => {
      if (this.lastTransport) {
        this.lastTransport.use(v);
      }
    });
    __publicField$a(this, "parent", new ParentTransport(
      ([emitter, eventName, subscribe], parent) => {
        this.lastTransport = parent;
        if (!emitter?.[subscribe]) {
          return;
        }
        emitter[subscribe](eventName, this.handler);
      }
    ));
  }
  event(transport) {
    const a = All(this.$emitter, this.$eventName, this.$subscribeMethod);
    a.event(this.parent.child(transport));
    return this;
  }
  destroy() {
    this.lastTransport = null;
    if (!this.$unsubscribeMethod) {
      return this;
    }
    const a = All(this.$emitter, this.$eventName, this.$unsubscribeMethod);
    a.event(
      Transport(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      })
    );
    return this;
  }
}

function FromPromise(p, errorOwner) {
  return new TheFromPromise(p, errorOwner);
}
class TheFromPromise {
  constructor(p, errorOwner) {
    this.p = p;
    this.errorOwner = errorOwner;
  }
  event(transport) {
    this.p.then(function FromPromiseThen(v) {
      transport.use(v);
    }).catch((e) => {
      this.errorOwner?.use(e);
    });
    return this;
  }
}

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
function Late(v) {
  return new TheLate(v);
}
class TheLate {
  constructor(v) {
    this.v = v;
    __publicField$9(this, "lateTransport", null);
    __publicField$9(this, "notify", (v) => {
      if (isFilled(v) && this.lateTransport) {
        this.lateTransport.use(v);
      }
    });
  }
  event(transport) {
    if (this.lateTransport) {
      throw new Error(
        "Late component gets new transport, when another was already connected!"
      );
    }
    this.lateTransport = transport;
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
function Once($base) {
  return new TheOnce($base);
}
class TheOnce {
  constructor($base) {
    this.$base = $base;
    __publicField$8(this, "isFilled", false);
    __publicField$8(this, "parent", new ParentTransport((v, child) => {
      if (!this.isFilled) {
        this.isFilled = true;
        child.use(v);
      }
    }));
  }
  event(transport) {
    this.$base.event(this.parent.child(transport));
    return this;
  }
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
function Shared($base, stateless = false) {
  return new TheShared($base, stateless);
}
class TheShared {
  constructor($base, stateless = false) {
    this.$base = $base;
    this.stateless = stateless;
    __publicField$7(this, "ownersPool", new OwnerPool());
    __publicField$7(this, "lastValue");
    __publicField$7(this, "calls", Late());
    __publicField$7(this, "firstCallTransport", Transport((v) => {
      this.lastValue = v;
      this.ownersPool.owner().use(v);
    }));
    Once(this.calls).event(
      Transport(() => {
        this.$base.event(this.firstCallTransport);
      })
    );
  }
  event(transport) {
    this.calls.use(1);
    if (!this.stateless && isFilled(this.lastValue) && !this.ownersPool.has(transport)) {
      transport.use(this.lastValue);
    }
    this.ownersPool.add(transport);
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
function SharedSource($base, stateless = false) {
  return new TheSharedSource($base, stateless);
}
class TheSharedSource {
  constructor($base, stateless = false) {
    this.$base = $base;
    __publicField$6(this, "$sharedBase");
    this.$sharedBase = Shared(this.$base, stateless);
  }
  event(transport) {
    this.$sharedBase.event(transport);
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
function LateShared(value) {
  return new TheLateShared(value);
}
class TheLateShared {
  constructor(value) {
    __publicField$5(this, "$event");
    this.$event = SharedSource(Late(value));
  }
  event(transport) {
    this.$event.event(transport);
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
function Map($base, $target) {
  return new TheMap($base, $target);
}
class TheMap {
  constructor($base, $target) {
    this.$base = $base;
    this.$target = $target;
    __publicField$4(this, "parent", new ParentTransport((v, child) => {
      const infos = [];
      v.forEach((val) => {
        let valInfo = val;
        if (!isEvent(valInfo)) {
          valInfo = Of(valInfo);
        }
        const info = this.$target.use(valInfo);
        infos.push(info);
      });
      const allI = All(...infos);
      allI.event(child);
    }));
  }
  event(transport) {
    this.$base.event(this.parent.child(transport));
    return this;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, key + "" , value);
function Primitive($base, theValue = null) {
  return new ThePrimitive($base, theValue);
}
class ThePrimitive {
  constructor($base, theValue = null) {
    this.$base = $base;
    this.theValue = theValue;
    __publicField$3(this, "touched", false);
  }
  ensureTouched() {
    if (!this.touched) {
      this.$base.event(
        Transport((v) => {
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
function Sequence($base) {
  return new TheSequence($base);
}
class TheSequence {
  constructor($base) {
    this.$base = $base;
    __publicField$2(this, "result", []);
    __publicField$2(this, "parent", new ParentTransport((v, child) => {
      this.result.push(v);
      child.use(this.result);
    }));
  }
  event(transport) {
    this.$base.event(this.parent.child(transport));
    return this;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
function Stream($base) {
  return new TheStream($base);
}
class TheStream {
  constructor($base) {
    this.$base = $base;
    __publicField$1(this, "parent", new ParentTransport((v, child) => {
      v.forEach((cv) => {
        child.use(cv);
      });
    }));
  }
  event(transport) {
    this.$base.event(this.parent.child(transport));
    return this;
  }
}

function TransportApplied(baseTransport, applier) {
  return new TheTransportApplied(baseTransport, applier);
}
class TheTransportApplied {
  constructor(baseTransport, applier) {
    this.baseTransport = baseTransport;
    this.applier = applier;
  }
  use(args) {
    return this.applier(this.baseTransport.use(args));
  }
}

function TransportArgs(baseTransport, args, startFromArgIndex = 0) {
  return new TheTransportArgs(baseTransport, args, startFromArgIndex);
}
class TheTransportArgs {
  constructor(baseTransport, args, startFromArgIndex = 0) {
    this.baseTransport = baseTransport;
    this.args = args;
    this.startFromArgIndex = startFromArgIndex;
  }
  use(runArgs) {
    return this.baseTransport.use(
      mergeAtIndex(runArgs, this.args, this.startFromArgIndex)
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
function TransportDestroyable(baseTransport) {
  return new TheTransportDestroyable(baseTransport);
}
class TheTransportDestroyable {
  constructor(baseTransport) {
    this.baseTransport = baseTransport;
    __publicField(this, "destructors", []);
  }
  use(args) {
    const inst = this.baseTransport.use(args);
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

exports.All = All;
exports.Any = Any;
exports.Applied = Applied;
exports.Catch = Catch;
exports.Chain = Chain;
exports.DestroyContainer = DestroyContainer;
exports.Event = Event;
exports.ExecutorApplied = ExecutorApplied;
exports.Filtered = Filtered;
exports.FromEvent = FromEvent;
exports.FromPromise = FromPromise;
exports.Late = Late;
exports.LateShared = LateShared;
exports.Local = Local;
exports.Map = Map;
exports.Of = Of;
exports.Once = Once;
exports.OwnerPool = OwnerPool;
exports.ParentTransport = ParentTransport;
exports.Primitive = Primitive;
exports.Sequence = Sequence;
exports.Shared = Shared;
exports.SharedSource = SharedSource;
exports.Stream = Stream;
exports.TheChain = TheChain;
exports.TheFromPromise = TheFromPromise;
exports.TheTransportApplied = TheTransportApplied;
exports.TheTransportArgs = TheTransportArgs;
exports.Transport = Transport;
exports.TransportApplied = TransportApplied;
exports.TransportArgs = TransportArgs;
exports.TransportDestroyable = TransportDestroyable;
exports.TransportEvent = TransportEvent;
exports.Void = Void;
exports.ensureEvent = ensureEvent;
exports.ensureFunction = ensureFunction;
exports.ensureTransport = ensureTransport;
exports.isDestroyable = isDestroyable;
exports.isEvent = isEvent;
exports.isFilled = isFilled;
exports.isTransport = isTransport;
//# sourceMappingURL=silentium.cjs.map
