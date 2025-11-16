function Of(value) {
  return new OfImpl(value);
}
class OfImpl {
  constructor(value) {
    this.value = value;
  }
  to(transport) {
    transport.use(this.value);
    return this;
  }
}

const isFilled = (value) => {
  return value !== void 0 && value !== null;
};
function isMessage(o) {
  return o !== null && typeof o === "object" && "to" in o && typeof o.to === "function";
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

function ActualMessage(message) {
  return isMessage(message) ? message : Of(message);
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
function ensureMessage(v, label) {
  if (!isMessage(v)) {
    throw new Error(`${label}: is not message`);
  }
}
function ensureTransport(v, label) {
  if (!isTransport(v)) {
    throw new Error(`${label}: is not transport`);
  }
}

function Transport(transportExecutor) {
  return new TransportImpl(transportExecutor);
}
class TransportImpl {
  constructor(executor) {
    this.executor = executor;
    ensureFunction(executor, "Transport: transport executor");
  }
  use(value) {
    this.executor(value);
    return this;
  }
}
function TransportMessage(executor) {
  return new TransportMessageImpl(executor);
}
class TransportMessageImpl {
  constructor(executor) {
    this.executor = executor;
    ensureFunction(executor, "TransportMessage: transport executor");
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

var __defProp$j = Object.defineProperty;
var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$j = (obj, key, value) => __defNormalProp$j(obj, typeof key !== "symbol" ? key + "" : key, value);
function Local($base) {
  return new LocalImpl(ActualMessage($base));
}
class LocalImpl {
  constructor($base) {
    this.$base = $base;
    __publicField$j(this, "destroyed", false);
    __publicField$j(this, "transport", TransportParent(function(v, child) {
      if (!child.destroyed) {
        this.use(v);
      }
    }, this));
    ensureMessage($base, "Local: $base");
  }
  to(transport) {
    this.$base.to(this.transport.child(transport));
    return this;
  }
  destroy() {
    this.destroyed = true;
    return this;
  }
}

var __defProp$i = Object.defineProperty;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$i = (obj, key, value) => __defNormalProp$i(obj, key + "" , value);
function Message(executor) {
  return new MessageImpl(executor);
}
class MessageImpl {
  constructor(executor) {
    this.executor = executor;
    __publicField$i(this, "mbDestructor");
    ensureFunction(executor, "Message: executor");
  }
  to(transport) {
    this.mbDestructor = this.executor(transport);
    return this;
  }
  destroy() {
    if (typeof this.mbDestructor === "function") {
      this.mbDestructor?.();
    }
    return this;
  }
}

function New(construct) {
  return Message((transport) => {
    transport.use(construct());
  });
}

function TransportOptional(base) {
  return new TransportOptionalImpl(base);
}
class TransportOptionalImpl {
  constructor(base) {
    this.base = base;
  }
  wait(m) {
    if (this.base !== void 0) {
      m.to(this.base);
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
function All(...messages) {
  return new AllImpl(...messages);
}
class AllImpl {
  constructor(...messages) {
    __publicField$h(this, "known");
    __publicField$h(this, "filled", /* @__PURE__ */ new Set());
    __publicField$h(this, "$messages");
    __publicField$h(this, "result", []);
    __publicField$h(this, "transport", TransportParent(function(v, child, key) {
      child.filled.add(key);
      child.result[parseInt(key)] = v;
      if (isAllFilled(child.filled, child.known)) {
        this.use(child.result);
      }
    }, this));
    this.known = new Set(Object.keys(messages));
    this.$messages = messages.map(ActualMessage);
  }
  to(transport) {
    Object.entries(this.$messages).forEach(([key, message]) => {
      ensureMessage(message, "All: item");
      message.to(this.transport.child(transport, key));
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
function Any(...messages) {
  return new AnyImpl(...messages.map(ActualMessage));
}
class AnyImpl {
  constructor(...messages) {
    __publicField$g(this, "$messages");
    this.$messages = messages;
  }
  to(transport) {
    this.$messages.forEach((message) => {
      ensureMessage(message, "Any: item");
      message.to(transport);
    });
    return this;
  }
}

var __defProp$f = Object.defineProperty;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$f = (obj, key, value) => __defNormalProp$f(obj, key + "" , value);
function Applied($base, applier) {
  return new AppliedImpl(ActualMessage($base), applier);
}
class AppliedImpl {
  constructor($base, applier) {
    this.$base = $base;
    this.applier = applier;
    __publicField$f(this, "transport", TransportParent(function(v, child) {
      this.use(child.applier(v));
    }, this));
    ensureMessage($base, "Applied: base");
  }
  to(transport) {
    this.$base.to(this.transport.child(transport));
    return this;
  }
}

function AppliedDestructured($base, applier) {
  return Applied($base, (args) => {
    return applier(...args);
  });
}

function Catch($base, errorMessage, errorOriginal) {
  return new CatchImpl($base, errorMessage, errorOriginal);
}
class CatchImpl {
  constructor($base, errorMessage, errorOriginal) {
    this.$base = $base;
    this.errorMessage = errorMessage;
    this.errorOriginal = errorOriginal;
    ensureMessage($base, "Catch: base");
    ensureTransport(errorMessage, "Catch: errorMessage");
    if (errorOriginal !== void 0) {
      ensureTransport(errorOriginal, "Catch: errorOriginal");
    }
  }
  to(transport) {
    try {
      this.$base.to(transport);
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
function Chain(...messages) {
  return new ChainImpl(...messages);
}
class ChainImpl {
  constructor(...messages) {
    __publicField$e(this, "$messages");
    __publicField$e(this, "$latest");
    __publicField$e(this, "handleMessage", (index, transport) => {
      const message = this.$messages[index];
      const next = this.$messages[index + 1];
      message.to(this.oneMessageTransport.child(transport, next, index));
    });
    __publicField$e(this, "oneMessageTransport", TransportParent(function(v, child, next, index) {
      if (!next) {
        child.$latest = v;
      }
      if (child.$latest) {
        this.use(child.$latest);
      }
      if (next && !child.$latest) {
        child.handleMessage(index + 1, this);
      }
    }, this));
    this.$messages = messages;
  }
  to(transport) {
    this.handleMessage(0, transport);
    return this;
  }
}

function ExecutorApplied($base, applier) {
  return new ExecutorAppliedImpl($base, applier);
}
class ExecutorAppliedImpl {
  constructor($base, applier) {
    this.$base = $base;
    this.applier = applier;
    ensureMessage($base, "ExecutorApplied: base");
  }
  to(transport) {
    const ExecutorAppliedBaseTransport = this.applier(
      transport.use.bind(transport)
    );
    this.$base.to(Transport(ExecutorAppliedBaseTransport));
    return this;
  }
}

var __defProp$d = Object.defineProperty;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$d = (obj, key, value) => __defNormalProp$d(obj, key + "" , value);
function Filtered($base, predicate, defaultValue) {
  return new FilteredImpl(ActualMessage($base), predicate, defaultValue);
}
class FilteredImpl {
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
  to(transport) {
    this.$base.to(this.parent.child(transport));
    return this;
  }
}

var __defProp$c = Object.defineProperty;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$c = (obj, key, value) => __defNormalProp$c(obj, typeof key !== "symbol" ? key + "" : key, value);
function FromEvent($emitter, $eventName, $subscribeMethod, $unsubscribeMethod) {
  return new FromEventImpl(
    ActualMessage($emitter),
    ActualMessage($eventName),
    ActualMessage($subscribeMethod),
    ActualMessage($unsubscribeMethod)
  );
}
class FromEventImpl {
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
  to(transport) {
    All(this.$emitter, this.$eventName, this.$subscribeMethod).to(
      this.parent.child(transport)
    );
    return this;
  }
  destroy() {
    this.lastTransport = null;
    if (!this.$unsubscribeMethod) {
      return this;
    }
    All(this.$emitter, this.$eventName, this.$unsubscribeMethod).to(
      Transport(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      })
    );
    return this;
  }
}

function FromPromise(p, error) {
  return new FromPromiseImpl(p, error);
}
class FromPromiseImpl {
  constructor(p, error) {
    this.p = p;
    this.error = error;
  }
  to(transport) {
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
  return new LateImpl(v);
}
class LateImpl {
  constructor(v) {
    this.v = v;
    __publicField$b(this, "lateTransport", null);
    __publicField$b(this, "notify", (v) => {
      if (isFilled(v) && this.lateTransport) {
        this.lateTransport.use(v);
      }
    });
  }
  to(transport) {
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
  return new OnceImpl($base);
}
class OnceImpl {
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
  to(transport) {
    this.$base.to(this.parent.child(transport));
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
  return new SharedImpl($base, stateless);
}
class SharedImpl {
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
    Once(this.calls).to(
      Transport(() => {
        this.$base.to(this.firstCallTransport);
      })
    );
  }
  to(transport) {
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
  return new SharedSourceImpl($base, stateless);
}
class SharedSourceImpl {
  constructor($base, stateless = false) {
    this.$base = $base;
    __publicField$7(this, "$sharedBase");
    this.$sharedBase = Shared(this.$base, stateless);
  }
  to(transport) {
    this.$sharedBase.to(transport);
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
      this.$base.to(
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
  return new LateSharedImpl(value);
}
class LateSharedImpl {
  constructor(value) {
    __publicField$5(this, "$msg");
    __publicField$5(this, "primitive");
    this.$msg = SharedSource(Late(value));
    this.primitive = Primitive(this, value);
  }
  to(transport) {
    this.$msg.to(transport);
    return this;
  }
  use(value) {
    this.$msg.use(value);
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
  return new MapImpl(ActualMessage($base), $target);
}
class MapImpl {
  constructor($base, $target) {
    this.$base = $base;
    this.$target = $target;
    __publicField$4(this, "parent", TransportParent(function(v, child) {
      const infos = [];
      v.forEach((val) => {
        let $val = val;
        if (!isMessage($val)) {
          $val = Of($val);
        }
        const info = child.$target.use($val);
        infos.push(info);
      });
      All(...infos).to(this);
    }, this));
  }
  to(transport) {
    this.$base.to(this.parent.child(transport));
    return this;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
function RPC($rpc) {
  return new RPCImpl(ActualMessage($rpc));
}
RPC.transport = {};
class RPCImpl {
  constructor($rpc) {
    this.$rpc = $rpc;
    __publicField$3(this, "$result", LateShared());
    __publicField$3(this, "$error", LateShared());
  }
  result() {
    this.$rpc.to(
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
    ActualMessage($base).to(rpc.result);
  });
}

function RPCOf(transport) {
  const $transport = LateShared();
  RPC.transport[transport] = $transport;
  return Message((transport2) => {
    $transport.to(transport2);
  });
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
function Sequence($base) {
  return new SequenceImpl($base);
}
class SequenceImpl {
  constructor($base) {
    this.$base = $base;
    __publicField$2(this, "result", []);
    __publicField$2(this, "parent", TransportParent(function(v, child) {
      child.result.push(v);
      this.use(child.result);
    }, this));
  }
  to(transport) {
    this.$base.to(this.parent.child(transport));
    return this;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
function Stream($base) {
  return new StreamImpl($base);
}
class StreamImpl {
  constructor($base) {
    this.$base = $base;
    __publicField$1(this, "parent", TransportParent(function(v) {
      v.forEach((cv) => {
        this.use(cv);
      });
    }));
  }
  to(transport) {
    this.$base.to(this.parent.child(transport));
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
  return new TransportDestroyableImpl(baseTransport);
}
class TransportDestroyableImpl {
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

export { ActualMessage, All, AllImpl, Any, AnyImpl, Applied, AppliedDestructured, AppliedImpl, Catch, CatchImpl, Chain, ChainImpl, DestroyContainer, DestroyContainerImpl, Destroyable, DestroyableImpl, ExecutorApplied, ExecutorAppliedImpl, Filtered, FilteredImpl, FromEvent, FromEventImpl, FromPromise, FromPromiseImpl, Late, LateImpl, LateShared, LateSharedImpl, Local, LocalImpl, Map, MapImpl, Message, MessageImpl, New, Of, OfImpl, Once, OnceImpl, Primitive, PrimitiveImpl, RPC, RPCChain, RPCImpl, RPCOf, Sequence, SequenceImpl, Shared, SharedImpl, SharedSource, SharedSourceImpl, Stream, StreamImpl, Transport, TransportApplied, TransportAppliedImpl, TransportArgs, TransportArgsImpl, TransportDestroyable, TransportDestroyableImpl, TransportImpl, TransportMessage, TransportMessageImpl, TransportOptional, TransportOptionalImpl, TransportParent, TransportParentImpl, TransportPool, Void, VoidImpl, ensureFunction, ensureMessage, ensureTransport, isDestroyable, isDestroyed, isFilled, isMessage, isTransport };
//# sourceMappingURL=silentium.mjs.map
