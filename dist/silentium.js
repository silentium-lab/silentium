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

const isFilled = (value) => {
  return value !== void 0 && value !== null;
};
function isEvent(o) {
  return o !== null && typeof o === "object" && "event" in o && typeof o.event === "function";
}
function isDestroyable(o) {
  return o !== null && typeof o === "object" && "destroy" in o && typeof o.destroy === "function";
}
function isDestroyed(o) {
  return o !== null && typeof o === "object" && "destroyed" in o && typeof o.destroy === "function";
}
function isTransport(o) {
  return o !== null && typeof o === "object" && "use" in o && typeof o.use === "function";
}

function Destroyable(base) {
  return new DestroyableImpl(base);
}
class DestroyableImpl {
  constructor(base) {
    this.base = base;
  }
  destroy() {
    if (isDestroyable(this.base)) {
      this.base.destroy();
    }
    return this;
  }
}

var __defProp$k = Object.defineProperty;
var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$k = (obj, key, value) => __defNormalProp$k(obj, key + "" , value);
function DestroyContainer() {
  return new DestroyContainerImpl();
}
class DestroyContainerImpl {
  constructor() {
    __publicField$k(this, "destructors", []);
  }
  add(e) {
    if (isDestroyable(e)) {
      this.destructors.push(e);
    }
    return e;
  }
  destroy() {
    this.destructors.forEach((d) => d.destroy());
    this.destructors.length = 0;
    return this;
  }
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
function Event(eventExecutor) {
  return new EventImpl(eventExecutor);
}
class EventImpl {
  constructor(eventExecutor) {
    this.eventExecutor = eventExecutor;
    __publicField$j(this, "mbDestructor");
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

var __defProp$i = Object.defineProperty;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$i = (obj, key, value) => __defNormalProp$i(obj, typeof key !== "symbol" ? key + "" : key, value);
function Local($base) {
  return new LocalEvent($base);
}
class LocalEvent {
  constructor($base) {
    this.$base = $base;
    __publicField$i(this, "destroyed", false);
    __publicField$i(this, "transport", TransportParent(function(v, child) {
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
    this.destroyed = true;
    return this;
  }
}

function New(construct) {
  return Event((transport) => {
    transport.use(construct());
  });
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

function TransportOptional(base) {
  return new TransportOptionalImpl(base);
}
class TransportOptionalImpl {
  constructor(base) {
    this.base = base;
  }
  wait(event) {
    if (this.base !== void 0) {
      event.event(this.base);
    }
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

var __defProp$h = Object.defineProperty;
var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$h = (obj, key, value) => __defNormalProp$h(obj, typeof key !== "symbol" ? key + "" : key, value);
const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
function All(...events) {
  return new AllEvent(...events);
}
class AllEvent {
  constructor(...events) {
    __publicField$h(this, "known");
    __publicField$h(this, "filled", /* @__PURE__ */ new Set());
    __publicField$h(this, "$events");
    __publicField$h(this, "result", []);
    __publicField$h(this, "transport", TransportParent(function(v, child, key) {
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

var __defProp$g = Object.defineProperty;
var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$g = (obj, key, value) => __defNormalProp$g(obj, key + "" , value);
function Any(...events) {
  return new AnyEvent(...events);
}
class AnyEvent {
  constructor(...events) {
    __publicField$g(this, "$events");
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

var __defProp$f = Object.defineProperty;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$f = (obj, key, value) => __defNormalProp$f(obj, key + "" , value);
function Applied($base, applier) {
  return new AppliedEvent($base, applier);
}
class AppliedEvent {
  constructor($base, applier) {
    this.$base = $base;
    this.applier = applier;
    __publicField$f(this, "transport", TransportParent(function(v, child) {
      this.use(child.applier(v));
    }, this));
    ensureEvent($base, "Applied: base");
  }
  event(transport) {
    this.$base.event(this.transport.child(transport));
    return this;
  }
}

function AppliedDestructured($base, applier) {
  return Applied($base, (args) => {
    return applier(...args);
  });
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

var __defProp$e = Object.defineProperty;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$e = (obj, key, value) => __defNormalProp$e(obj, typeof key !== "symbol" ? key + "" : key, value);
function Chain(...events) {
  return new ChainEvent(...events);
}
class ChainEvent {
  constructor(...events) {
    __publicField$e(this, "$events");
    __publicField$e(this, "$latest");
    __publicField$e(this, "handleEvent", (index, transport) => {
      const event = this.$events[index];
      const next = this.$events[index + 1];
      event.event(this.oneEventTransport.child(transport, next, index));
    });
    __publicField$e(this, "oneEventTransport", TransportParent(function(v, child, next, index) {
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

var __defProp$d = Object.defineProperty;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$d = (obj, key, value) => __defNormalProp$d(obj, key + "" , value);
function Filtered($base, predicate, defaultValue) {
  return new FilteredEvent($base, predicate, defaultValue);
}
class FilteredEvent {
  constructor($base, predicate, defaultValue) {
    this.$base = $base;
    this.predicate = predicate;
    this.defaultValue = defaultValue;
    __publicField$d(this, "parent", TransportParent(function(v, child) {
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

var __defProp$c = Object.defineProperty;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$c = (obj, key, value) => __defNormalProp$c(obj, typeof key !== "symbol" ? key + "" : key, value);
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
    __publicField$c(this, "lastTransport", null);
    __publicField$c(this, "handler", (v) => {
      if (this.lastTransport) {
        this.lastTransport.use(v);
      }
    });
    __publicField$c(this, "parent", TransportParent(function([emitter, eventName, subscribe], child) {
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

var __defProp$b = Object.defineProperty;
var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$b = (obj, key, value) => __defNormalProp$b(obj, typeof key !== "symbol" ? key + "" : key, value);
function Late(v) {
  return new LateEvent(v);
}
class LateEvent {
  constructor(v) {
    this.v = v;
    __publicField$b(this, "lateTransport", null);
    __publicField$b(this, "notify", (v) => {
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

var __defProp$a = Object.defineProperty;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$a = (obj, key, value) => __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
function Once($base) {
  return new OnceEvent($base);
}
class OnceEvent {
  constructor($base) {
    this.$base = $base;
    __publicField$a(this, "isFilled", false);
    __publicField$a(this, "parent", TransportParent(function(v, child) {
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

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
class TransportPool {
  constructor() {
    __publicField$9(this, "transports");
    __publicField$9(this, "innerTransport");
    this.transports = /* @__PURE__ */ new Set();
    this.innerTransport = Transport((v) => {
      this.transports.forEach((transport) => {
        if (isDestroyed(transport) && transport.destroyed()) {
          this.transports.delete(transport);
          return;
        }
        transport.use(v);
      });
    });
  }
  transport() {
    return this.innerTransport;
  }
  size() {
    return this.transports.size;
  }
  has(owner) {
    return this.transports.has(owner);
  }
  add(owner) {
    this.transports.add(owner);
    return this;
  }
  remove(g) {
    this.transports.delete(g);
    return this;
  }
  destroy() {
    this.transports.forEach((g) => {
      this.remove(g);
    });
    return this;
  }
}

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
function Shared($base, stateless = false) {
  return new SharedEvent($base, stateless);
}
class SharedEvent {
  constructor($base, stateless = false) {
    this.$base = $base;
    this.stateless = stateless;
    __publicField$8(this, "transportPool", new TransportPool());
    __publicField$8(this, "lastValue");
    __publicField$8(this, "calls", Late());
    __publicField$8(this, "firstCallTransport", Transport((v) => {
      this.lastValue = v;
      this.transportPool.transport().use(v);
    }));
    Once(this.calls).event(
      Transport(() => {
        this.$base.event(this.firstCallTransport);
      })
    );
  }
  event(transport) {
    this.calls.use(1);
    if (!this.stateless && isFilled(this.lastValue) && !this.transportPool.has(transport)) {
      transport.use(this.lastValue);
    }
    this.transportPool.add(transport);
    return this;
  }
  use(value) {
    this.calls.use(1);
    this.lastValue = value;
    this.transportPool.transport().use(value);
    return this;
  }
  touched() {
    this.calls.use(1);
  }
  pool() {
    return this.transportPool;
  }
  destroy() {
    return this.transportPool.destroy();
  }
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, key + "" , value);
function SharedSource($base, stateless = false) {
  return new SharedSourceEvent($base, stateless);
}
class SharedSourceEvent {
  constructor($base, stateless = false) {
    this.$base = $base;
    __publicField$7(this, "$sharedBase");
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

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, key + "" , value);
function Primitive($base, theValue = null) {
  return new PrimitiveImpl($base, theValue);
}
class PrimitiveImpl {
  constructor($base, theValue = null) {
    this.$base = $base;
    this.theValue = theValue;
    __publicField$6(this, "touched", false);
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

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
function LateShared(value) {
  return new LateSharedEvent(value);
}
class LateSharedEvent {
  constructor(value) {
    __publicField$5(this, "$event");
    __publicField$5(this, "primitive");
    this.$event = SharedSource(Late(value));
    this.primitive = Primitive(this, value);
  }
  event(transport) {
    this.$event.event(transport);
    return this;
  }
  use(value) {
    this.$event.use(value);
    return this;
  }
  value() {
    return this.primitive;
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
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
function RPC($rpc) {
  return new RPCImpl($rpc);
}
RPC.transport = {};
class RPCImpl {
  constructor($rpc) {
    this.$rpc = $rpc;
    __publicField$3(this, "$result", LateShared());
    __publicField$3(this, "$error", LateShared());
  }
  result() {
    this.$rpc.event(
      Transport((rpc) => {
        const transport = rpc.transport === void 0 ? RPC.transport.default : RPC.transport[rpc.transport] || RPC.transport.default;
        if (!transport) {
          throw new Error(`RPCImpl: Transport not found ${rpc.transport}`);
        }
        if (!rpc.result) {
          rpc.result = this.$result;
        }
        if (!rpc.error) {
          rpc.error = this.$error;
        }
        transport.use(rpc);
      })
    );
    return this.$result;
  }
  error() {
    return this.$error;
  }
}

function RPCChain($base) {
  return Transport((rpc) => {
    if (!rpc.result) {
      throw new Error("RPCChain did not find result in rpc message");
    }
    $base.event(rpc.result);
  });
}

function RPCOf(transport) {
  const $transport = LateShared();
  RPC.transport[transport] = $transport;
  return Event((transport2) => {
    $transport.event(transport2);
  });
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

export { All, AllEvent, Any, AnyEvent, Applied, AppliedDestructured, AppliedEvent, Catch, CatchEvent, Chain, ChainEvent, Component, ComponentClass, DestroyContainer, DestroyContainerImpl, Destroyable, DestroyableImpl, Event, EventImpl, ExecutorApplied, ExecutorAppliedEvent, Filtered, FilteredEvent, FromEvent, FromEventAdapter, FromPromise, FromPromiseEvent, Late, LateEvent, LateShared, LateSharedEvent, Local, LocalEvent, Map, MapEvent, New, Of, OfEvent, Once, OnceEvent, Primitive, PrimitiveImpl, RPC, RPCChain, RPCImpl, RPCOf, Sequence, SequenceEvent, Shared, SharedEvent, SharedSource, SharedSourceEvent, Stream, StreamEvent, Transport, TransportApplied, TransportAppliedImpl, TransportArgs, TransportArgsImpl, TransportDestroyable, TransportDestroyableEvent, TransportEvent, TransportEventImpl, TransportImpl, TransportOptional, TransportOptionalImpl, TransportParent, TransportParentImpl, TransportPool, Void, VoidImpl, ensureEvent, ensureFunction, ensureTransport, isDestroyable, isDestroyed, isEvent, isFilled, isTransport };
//# sourceMappingURL=silentium.js.map
