function Component(executor) {
  return (...args) => {
    let destructor;
    return {
      event(transport) {
        destructor = executor.call(transport, ...args);
        return this;
      },
      destroy() {
        if (destructor !== void 0) {
          destructor();
        }
        return this;
      }
    };
  };
}

function ComponentClass(classConstructor) {
  return (...args) => new classConstructor(...args);
}

var __defProp$j = Object.defineProperty;
var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$j = (obj, key, value) => __defNormalProp$j(obj, key + "" , value);
function DestroyContainer() {
  return new DestroyContainerImpl();
}
class DestroyContainerImpl {
  constructor() {
    __publicField$j(this, "destructors", []);
  }
  add(e) {
    this.destructors.push(e);
    return e;
  }
  destroy() {
    this.destructors.forEach((d) => d.destroy());
    return this;
  }
}

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

var __defProp$i = Object.defineProperty;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$i = (obj, key, value) => __defNormalProp$i(obj, key + "" , value);
function Event(eventExecutor) {
  return new EventImpl(eventExecutor);
}
class EventImpl {
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

function Transport(transportExecutor) {
  return new TransportImpl(transportExecutor);
}
class TransportImpl {
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
  return new TransportEventImpl(transportExecutor);
}
class TransportEventImpl {
  constructor(executor) {
    this.executor = executor;
    ensureFunction(executor, "TransportEvent: transport executor");
  }
  use(value) {
    return this.executor(value);
  }
}
function TransportParent(executor, ...args) {
  return new TransportParentImpl(executor, args);
}
class TransportParentImpl {
  constructor(executor, args = [], _child) {
    this.executor = executor;
    this.args = args;
    this._child = _child;
    ensureFunction(executor, "TransportParent: executor");
  }
  use(value) {
    if (this._child === void 0) {
      throw new Error("no base transport");
    }
    this.executor.call(this._child, value, ...this.args);
    return this;
  }
  child(transport, ...args) {
    return new TransportParentImpl(
      this.executor,
      [...this.args, ...args],
      transport
    );
  }
}

var __defProp$h = Object.defineProperty;
var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$h = (obj, key, value) => __defNormalProp$h(obj, typeof key !== "symbol" ? key + "" : key, value);
function Local($base) {
  return new LocalEvent($base);
}
class LocalEvent {
  constructor($base) {
    this.$base = $base;
    __publicField$h(this, "destroyed", false);
    __publicField$h(this, "transport", TransportParent(function(v, child) {
      if (!child.destroyed) {
        this.use(v);
      }
    }, this));
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
  return new OfEvent(value);
}
class OfEvent {
  constructor(value) {
    this.value = value;
  }
  event(transport) {
    transport.use(this.value);
    return this;
  }
}

function Void() {
  return new VoidImpl();
}
class VoidImpl {
  use() {
    return this;
  }
}

var __defProp$g = Object.defineProperty;
var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$g = (obj, key, value) => __defNormalProp$g(obj, typeof key !== "symbol" ? key + "" : key, value);
const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
function All(...events) {
  return new AllEvent(...events);
}
class AllEvent {
  constructor(...events) {
    __publicField$g(this, "known");
    __publicField$g(this, "filled", /* @__PURE__ */ new Set());
    __publicField$g(this, "$events");
    __publicField$g(this, "result", []);
    __publicField$g(this, "transport", TransportParent(function(v, child, key) {
      child.filled.add(key);
      child.result[parseInt(key)] = v;
      if (isAllFilled(child.filled, child.known)) {
        this.use(child.result);
      }
    }, this));
    this.known = new Set(Object.keys(events));
    this.$events = events;
  }
  event(transport) {
    Object.entries(this.$events).forEach(([key, event]) => {
      ensureEvent(event, "All: item");
      event.event(this.transport.child(transport, key));
    });
    if (this.known.size === 0) {
      transport.use([]);
    }
    return this;
  }
}

var __defProp$f = Object.defineProperty;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$f = (obj, key, value) => __defNormalProp$f(obj, key + "" , value);
function Any(...events) {
  return new AnyEvent(...events);
}
class AnyEvent {
  constructor(...events) {
    __publicField$f(this, "$events");
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

var __defProp$e = Object.defineProperty;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$e = (obj, key, value) => __defNormalProp$e(obj, key + "" , value);
function Applied($base, applier) {
  return new AppliedEvent($base, applier);
}
class AppliedEvent {
  constructor($base, applier) {
    this.$base = $base;
    this.applier = applier;
    __publicField$e(this, "transport", TransportParent(function(v, child) {
      this.use(child.applier(v));
    }, this));
    ensureEvent($base, "Applied: base");
  }
  event(transport) {
    this.$base.event(this.transport.child(transport));
    return this;
  }
}

function Catch($base, errorMessage, errorOriginal) {
  return new CatchEvent($base, errorMessage, errorOriginal);
}
class CatchEvent {
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
        this.errorMessage.use(String(e));
      }
      if (this.errorOriginal) {
        this.errorOriginal.use(e);
      }
    }
    return this;
  }
}

var __defProp$d = Object.defineProperty;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$d = (obj, key, value) => __defNormalProp$d(obj, typeof key !== "symbol" ? key + "" : key, value);
function Chain(...events) {
  return new ChainEvent(...events);
}
class ChainEvent {
  constructor(...events) {
    __publicField$d(this, "$events");
    __publicField$d(this, "$latest");
    __publicField$d(this, "handleEvent", (index, transport) => {
      const event = this.$events[index];
      const next = this.$events[index + 1];
      event.event(this.oneEventTransport.child(transport, next, index));
    });
    __publicField$d(this, "oneEventTransport", TransportParent(function(v, child, next, index) {
      if (!next) {
        child.$latest = v;
      }
      if (child.$latest) {
        this.use(child.$latest);
      }
      if (next && !child.$latest) {
        child.handleEvent(index + 1, this);
      }
    }, this));
    this.$events = events;
  }
  event(transport) {
    this.handleEvent(0, transport);
    return this;
  }
}

function ExecutorApplied($base, applier) {
  return new ExecutorAppliedEvent($base, applier);
}
class ExecutorAppliedEvent {
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

var __defProp$c = Object.defineProperty;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$c = (obj, key, value) => __defNormalProp$c(obj, key + "" , value);
function Filtered($base, predicate, defaultValue) {
  return new FilteredEvent($base, predicate, defaultValue);
}
class FilteredEvent {
  constructor($base, predicate, defaultValue) {
    this.$base = $base;
    this.predicate = predicate;
    this.defaultValue = defaultValue;
    __publicField$c(this, "parent", TransportParent(function(v, child) {
      if (child.predicate(v)) {
        this.use(v);
      } else if (child.defaultValue !== void 0) {
        this.use(child.defaultValue);
      }
    }, this));
  }
  event(transport) {
    this.$base.event(this.parent.child(transport));
    return this;
  }
}

var __defProp$b = Object.defineProperty;
var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$b = (obj, key, value) => __defNormalProp$b(obj, typeof key !== "symbol" ? key + "" : key, value);
function FromEvent($emitter, $eventName, $subscribeMethod, $unsubscribeMethod) {
  return new FromEventAdapter(
    $emitter,
    $eventName,
    $subscribeMethod,
    $unsubscribeMethod
  );
}
class FromEventAdapter {
  constructor($emitter, $eventName, $subscribeMethod, $unsubscribeMethod) {
    this.$emitter = $emitter;
    this.$eventName = $eventName;
    this.$subscribeMethod = $subscribeMethod;
    this.$unsubscribeMethod = $unsubscribeMethod;
    __publicField$b(this, "lastTransport", null);
    __publicField$b(this, "handler", (v) => {
      if (this.lastTransport) {
        this.lastTransport.use(v);
      }
    });
    __publicField$b(this, "parent", TransportParent(function([emitter, eventName, subscribe], child) {
      child.lastTransport = this;
      if (!emitter?.[subscribe]) {
        return;
      }
      emitter[subscribe](eventName, child.handler);
    }, this));
  }
  event(transport) {
    All(this.$emitter, this.$eventName, this.$subscribeMethod).event(
      this.parent.child(transport)
    );
    return this;
  }
  destroy() {
    this.lastTransport = null;
    if (!this.$unsubscribeMethod) {
      return this;
    }
    All(this.$emitter, this.$eventName, this.$unsubscribeMethod).event(
      Transport(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      })
    );
    return this;
  }
}

function FromPromise(p, error) {
  return new FromPromiseEvent(p, error);
}
class FromPromiseEvent {
  constructor(p, error) {
    this.p = p;
    this.error = error;
  }
  event(transport) {
    this.p.then((v) => {
      transport.use(v);
    }).catch((e) => {
      this.error?.use(e);
    });
    return this;
  }
}

var __defProp$a = Object.defineProperty;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$a = (obj, key, value) => __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
function Late(v) {
  return new LateEvent(v);
}
class LateEvent {
  constructor(v) {
    this.v = v;
    __publicField$a(this, "lateTransport", null);
    __publicField$a(this, "notify", (v) => {
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

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
function Once($base) {
  return new OnceEvent($base);
}
class OnceEvent {
  constructor($base) {
    this.$base = $base;
    __publicField$9(this, "isFilled", false);
    __publicField$9(this, "parent", TransportParent(function(v, child) {
      if (!child.isFilled) {
        child.isFilled = true;
        this.use(v);
      }
    }, this));
  }
  event(transport) {
    this.$base.event(this.parent.child(transport));
    return this;
  }
}

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
class OwnerPool {
  constructor() {
    __publicField$8(this, "owners");
    __publicField$8(this, "innerOwner");
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

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
function Shared($base, stateless = false) {
  return new SharedEvent($base, stateless);
}
class SharedEvent {
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
  return new SharedSourceEvent($base, stateless);
}
class SharedSourceEvent {
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
  return new LateSharedEvent(value);
}
class LateSharedEvent {
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
  return new MapEvent($base, $target);
}
class MapEvent {
  constructor($base, $target) {
    this.$base = $base;
    this.$target = $target;
    __publicField$4(this, "parent", TransportParent(function(v, child) {
      const infos = [];
      v.forEach((val) => {
        let $val = val;
        if (!isEvent($val)) {
          $val = Of($val);
        }
        const info = child.$target.use($val);
        infos.push(info);
      });
      All(...infos).event(this);
    }, this));
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
  return new PrimitiveImpl($base, theValue);
}
class PrimitiveImpl {
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
  return new SequenceEvent($base);
}
class SequenceEvent {
  constructor($base) {
    this.$base = $base;
    __publicField$2(this, "result", []);
    __publicField$2(this, "parent", TransportParent(function(v, child) {
      child.result.push(v);
      this.use(child.result);
    }, this));
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
  return new StreamEvent($base);
}
class StreamEvent {
  constructor($base) {
    this.$base = $base;
    __publicField$1(this, "parent", TransportParent(function(v) {
      v.forEach((cv) => {
        this.use(cv);
      });
    }));
  }
  event(transport) {
    this.$base.event(this.parent.child(transport));
    return this;
  }
}

function TransportApplied(baseTransport, applier) {
  return new TransportAppliedImpl(baseTransport, applier);
}
class TransportAppliedImpl {
  constructor(baseTransport, applier) {
    this.baseTransport = baseTransport;
    this.applier = applier;
  }
  use(args) {
    return this.applier(this.baseTransport.use(args));
  }
}

function TransportArgs(baseTransport, args, startFromArgIndex = 0) {
  return new TransportArgsImpl(baseTransport, args, startFromArgIndex);
}
class TransportArgsImpl {
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
  return new TransportDestroyableEvent(baseTransport);
}
class TransportDestroyableEvent {
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

const $rpc = LateShared();

export { $rpc, All, Any, Applied, Catch, Chain, ChainEvent, Component, ComponentClass, DestroyContainer, Event, ExecutorApplied, Filtered, FromEvent, FromPromise, FromPromiseEvent, Late, LateShared, Local, Map, Of, Once, OwnerPool, Primitive, Sequence, Shared, SharedSource, Stream, Transport, TransportApplied, TransportAppliedImpl, TransportArgs, TransportArgsImpl, TransportDestroyable, TransportEvent, TransportParent, Void, ensureEvent, ensureFunction, ensureTransport, isDestroyable, isEvent, isFilled, isTransport };
//# sourceMappingURL=silentium.js.map
