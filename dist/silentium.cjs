'use strict';

const isFilled = (value) => {
  return value !== void 0 && value !== null;
};
function isMessage(o) {
  return o !== null && typeof o === "object" && "then" in o && typeof o.then === "function";
}
function isSource(o) {
  return o !== null && typeof o === "object" && "use" in o && typeof o.use === "function";
}
function isDestroyable(o) {
  return o !== null && typeof o === "object" && "destroy" in o && typeof o.destroy === "function";
}
function isDestroyed(o) {
  return o !== null && typeof o === "object" && "destroyed" in o && typeof o.destroyed === "function";
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
    if (typeof this.base === "function") {
      this.base();
    }
    return this;
  }
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
function DestroyContainer() {
  return new DestroyContainerImpl();
}
class DestroyContainerImpl {
  constructor() {
    __publicField$7(this, "destructors", []);
    __publicField$7(this, "_destroyed", false);
  }
  /**
   * Add one destroyable
   * @param e
   * @returns
   */
  add(e) {
    this.destructors.push(Destroyable(e));
    return e;
  }
  /**
   * Add many destroyable objects
   * @param destroyableList
   * @returns
   */
  many(destroyableList) {
    destroyableList.forEach((d) => {
      this.add(d);
    });
    return this;
  }
  destroy() {
    this._destroyed = true;
    this.destructors.forEach((d) => d.destroy());
    this.destructors.length = 0;
    return this;
  }
  destroyed() {
    return this._destroyed;
  }
  destructor() {
    return this.destroy.bind(this);
  }
}

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
class Rejections {
  constructor() {
    __publicField$6(this, "catchers", []);
    __publicField$6(this, "lastRejectReason", null);
    __publicField$6(this, "reject", (reason) => {
      this.lastRejectReason = reason;
      this.catchers.forEach((catcher) => {
        catcher(reason);
      });
    });
  }
  catch(rejected) {
    if (this.lastRejectReason !== null) {
      rejected(this.lastRejectReason);
    }
    this.catchers.push(rejected);
    return this;
  }
  destroy() {
    this.catchers.length = 0;
    return this;
  }
}

const ResetSilenceCache = Symbol("reset-silence-cache");
function Silence(resolve) {
  let lastValue;
  return (v) => {
    if (v === ResetSilenceCache) {
      lastValue = void 0;
      v = void 0;
    }
    if (isFilled(v) && v !== lastValue) {
      lastValue = v;
      resolve(v);
    }
  };
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

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
function Message(executor) {
  return new MessageImpl(executor);
}
class MessageImpl {
  constructor(executor) {
    this.executor = executor;
    __publicField$5(this, "rejections", new Rejections());
    __publicField$5(this, "dc", DestroyContainer());
    ensureFunction(executor, "Message: executor");
  }
  then(resolve) {
    if (this.dc.destroyed()) {
      return this;
    }
    try {
      this.dc.add(this.executor(Silence(resolve), this.rejections.reject));
    } catch (e) {
      this.rejections.reject(e);
    }
    return this;
  }
  catch(rejected) {
    if (this.dc.destroyed()) {
      return this;
    }
    this.rejections.catch(rejected);
    return this;
  }
  destroy() {
    this.dc.destroy();
    this.rejections.destroy();
    return this;
  }
}

function Of(value) {
  return Message(function OfImpl(r) {
    r(value);
  });
}

function ActualMessage(message) {
  return isMessage(message) ? message : Of(message);
}

function Connected(...m) {
  const dc = DestroyContainer();
  dc.many(m);
  return Message((resolve, reject) => {
    m[0].catch(reject).then(resolve);
    m.slice(1).forEach((other) => {
      other.catch(reject);
    });
    return dc.destructor();
  });
}

function Local(_base) {
  const $base = ActualMessage(_base);
  return Message(function LocalImpl(resolve, reject) {
    let destroyed = false;
    $base.then((v) => {
      if (!destroyed) {
        resolve(v);
      }
    });
    $base.catch(reject);
    return () => {
      destroyed = true;
    };
  });
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, key + "" , value);
function MessageSource(messageExecutor, sourceExecutor) {
  return new MessageSourceImpl(messageExecutor, sourceExecutor);
}
class MessageSourceImpl {
  constructor(messageExecutor, sourceExecutor) {
    this.sourceExecutor = sourceExecutor;
    __publicField$4(this, "message");
    this.message = Message(messageExecutor);
  }
  use(value) {
    this.sourceExecutor(value);
    return this;
  }
  then(resolved) {
    this.message.then(resolved);
    return this;
  }
  catch(rejected) {
    this.message.catch(rejected);
    return this;
  }
  destroy() {
    this.message.destroy();
    return this;
  }
  chain(m) {
    m.then(this.use.bind(this));
    return this;
  }
}

function New(construct) {
  return Message(function NewImpl(resolve) {
    resolve(construct());
  });
}

function Void() {
  return () => {
  };
}

const isAllFilled = (keysFilled, keysKnown) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};
function All(...messages) {
  const $messages = messages.map(ActualMessage);
  return Message(function AllImpl(resolve, reject) {
    const known = new Set(Object.keys(messages));
    const filled = /* @__PURE__ */ new Set();
    const result = [];
    if (known.size === 0) {
      resolve([]);
      return;
    }
    $messages.map((m, key) => {
      m.catch(reject);
      m.then((v) => {
        filled.add(key.toString());
        result[key] = v;
        if (isAllFilled(filled, known)) {
          resolve(result.slice());
        }
      });
    });
  });
}

function Any(...messages) {
  const $messages = messages.map(ActualMessage);
  return Message(function AnyImpl(resolve, reject) {
    $messages.forEach((message) => {
      message.catch(reject);
      message.then(resolve);
    });
  });
}

function Applied(base, applier) {
  const $base = ActualMessage(base);
  return Message(function AppliedImpl(resolve, reject) {
    const dc = DestroyContainer();
    $base.catch(reject);
    $base.then((v) => {
      const result = applier(v);
      if (isMessage(result)) {
        dc.destroy();
        dc.add(result);
        result.catch(reject).then(resolve);
      } else {
        resolve(result);
      }
    });
  });
}

function AppliedDestructured($base, applier) {
  return Applied($base, function AppliedDestructuredImpl(args) {
    return applier(...args);
  });
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
      this.$base.then((v) => {
        this.theValue = v;
      });
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
function Shared($base) {
  return new SharedImpl($base);
}
class SharedImpl {
  constructor($base) {
    this.$base = $base;
    __publicField$2(this, "resolver", (v) => {
      this.lastV = v;
      this.resolvers.forEach((r) => {
        r(v);
      });
    });
    __publicField$2(this, "lastV");
    __publicField$2(this, "resolvers", /* @__PURE__ */ new Set());
    __publicField$2(this, "source");
    if (isSource($base)) {
      this.source = $base;
    }
  }
  then(resolved) {
    this.resolvers.add((v) => resolved(v));
    if (this.resolvers.size === 1) {
      this.$base.then(this.resolver);
    } else if (isFilled(this.lastV)) {
      resolved(this.lastV);
    }
    return this;
  }
  use(value) {
    if (this.source) {
      this.source.use(value);
    } else {
      this.resolver(value);
    }
    return this;
  }
  catch(rejected) {
    this.$base.catch(rejected);
    return this;
  }
  destroy() {
    this.resolvers.clear();
    if (isDestroyable(this.$base)) {
      this.$base.destroy();
    }
    return this;
  }
  value() {
    return Primitive(this);
  }
  chain(m) {
    m.then(this.use.bind(this));
    return this;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
function Late(v) {
  return Shared(new LateImpl(v));
}
class LateImpl {
  constructor(v) {
    this.v = v;
    __publicField$1(this, "rejections", new Rejections());
    __publicField$1(this, "lateR", null);
    __publicField$1(this, "notify", () => {
      if (isFilled(this.v) && this.lateR) {
        try {
          this.lateR(this.v);
        } catch (e) {
          this.rejections.reject(e);
        }
      }
    });
  }
  then(r) {
    if (this.lateR) {
      throw new Error(
        "Late component gets new resolver, when another was already connected!"
      );
    }
    this.lateR = Silence(r);
    this.notify();
    return this;
  }
  use(value) {
    this.v = value;
    this.notify();
    return this;
  }
  catch(rejected) {
    this.rejections.catch(rejected);
    return this;
  }
  chain(m) {
    m.then(this.use.bind(this));
    return this;
  }
}

function Catch($base) {
  const rejections = new Rejections();
  $base.catch(rejections.reject);
  const $error = Late();
  rejections.catch((e) => {
    $error.use(e);
  });
  return $error;
}

function Chain(...messages) {
  const $messages = messages.map(ActualMessage);
  return Message(
    function ChainImpl(resolve, reject) {
      let $latest;
      const handleMessage = (index) => {
        const message = $messages[index];
        message.catch(reject);
        const next = $messages[index + 1];
        message.then((v) => {
          oneMessage(v, next, index);
        });
      };
      function oneMessage(v, next, index) {
        if (!next) {
          $latest = v;
        }
        if ($latest) {
          resolve($latest);
        }
        if (next && !$latest) {
          handleMessage(index + 1);
        }
      }
      handleMessage(0);
    }
  );
}

function Computed(applier, ...messages) {
  return AppliedDestructured(All(...messages), applier);
}

Context.transport = /* @__PURE__ */ new Map();
function Context(name, params = {}) {
  const $msg = AppliedDestructured(
    All(ActualMessage(name), ActualMessage(params)),
    (name2, params2) => ({
      transport: name2,
      params: params2,
      result: void 0,
      error: void 0
    })
  );
  return MessageSource(
    (resolve, reject) => {
      $msg.then((message) => {
        const transport = Context.transport.get(message.transport);
        if (transport === void 0) {
          throw new Error(`Context: unknown transport ${message.transport}`);
        }
        if (!message.result) {
          message.result = resolve;
        }
        if (!message.error) {
          message.error = reject;
        }
        try {
          transport(message);
        } catch (error) {
          reject(error);
        }
      });
    },
    (value) => {
      const msg = Primitive($msg).primitive();
      if (msg === null) {
        throw new Error("Context: sourcing impossible message not existed");
      }
      const transport = Context.transport.get(msg.transport);
      if (transport === void 0) {
        throw new Error(`Context: sourcing unknown transport ${msg.transport}`);
      }
      transport({
        ...msg,
        value
      });
    }
  );
}

function ContextChain(base) {
  const $base = ActualMessage(base);
  return (context) => {
    if (context.value && isSource(base)) {
      base.use(context.value);
      return;
    }
    if (!context.result) {
      throw new Error("ContextChain did not find result field in message");
    }
    $base.then(context.result);
  };
}

function ContextOf(transport) {
  const $msg = Late();
  Context.transport.set(transport, $msg.use.bind($msg));
  return Message((resolve, reject) => {
    $msg.catch(reject);
    $msg.then(resolve);
  });
}

function Default($base, _default) {
  const $default = ActualMessage(_default);
  const $defaultAfterError = Applied(Catch($base), () => $default);
  return Message((resolve) => {
    $base.then(resolve);
    $defaultAfterError.then(resolve);
  });
}

function Filtered(base, predicate, defaultValue) {
  const $base = ActualMessage(base);
  return Message(function FilteredImpl(resolve, reject) {
    $base.catch(reject);
    $base.then((v) => {
      if (predicate(v)) {
        resolve(v);
      } else if (defaultValue !== void 0) {
        resolve(defaultValue);
      }
    });
  });
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const Nothing = Symbol("nothing");
function Empty($base) {
  return new EmptyImpl($base);
}
class EmptyImpl {
  constructor($base) {
    this.$base = $base;
    __publicField(this, "$empty", Late());
  }
  message() {
    Shared(this.$base).then((v) => {
      if (v === Nothing) {
        this.$empty.use(true);
      }
    });
    return Filtered(this.$base, (v) => v !== Nothing);
  }
  empty() {
    return this.$empty;
  }
}

function ExecutorApplied($base, applier) {
  return Message(function ExecutorAppliedImpl(resolve, reject) {
    $base.catch(reject);
    $base.then(applier(resolve));
  });
}

function Freeze($base, $invalidate) {
  let freezedValue = null;
  return Message(function FreezeImpl(resolve, reject) {
    $base.catch(reject);
    $base.then((v) => {
      if (freezedValue === null) {
        freezedValue = v;
      }
      resolve(freezedValue);
    });
    $invalidate?.then(() => {
      freezedValue = null;
    });
  });
}

function FromEvent(emitter, eventName, subscribeMethod, unsubscribeMethod) {
  const $emitter = ActualMessage(emitter);
  const $eventName = ActualMessage(eventName);
  const $subscribeMethod = ActualMessage(subscribeMethod);
  const $unsubscribeMethod = ActualMessage(unsubscribeMethod);
  return Message((resolve, reject) => {
    $emitter.catch(reject);
    $eventName.catch(reject);
    $subscribeMethod.catch(reject);
    $unsubscribeMethod.catch(reject);
    let lastR = null;
    const handler = (v) => {
      if (lastR) {
        lastR(v);
      }
    };
    All($emitter, $eventName, $subscribeMethod).then(
      ([emitter2, eventName2, subscribe]) => {
        lastR = resolve;
        if (!emitter2?.[subscribe]) {
          return;
        }
        emitter2[subscribe](eventName2, handler);
      }
    );
    return () => {
      lastR = null;
      if (!$unsubscribeMethod) {
        return;
      }
      All($emitter, $eventName, $unsubscribeMethod).then(
        ([emitter2, eventName2, unsubscribe]) => {
          emitter2?.[unsubscribe]?.(eventName2, handler);
        }
      );
    };
  });
}

function Map$1(base, target) {
  const $base = ActualMessage(base);
  return Message((resolve, reject) => {
    $base.catch(reject);
    const infos = [];
    const dc = DestroyContainer();
    $base.then((v) => {
      infos.length = 0;
      dc.destroy();
      v.forEach((val) => {
        let $val = val;
        if (!isMessage($val)) {
          $val = Of($val);
        }
        const info = target($val);
        dc.add(info);
        infos.push(info);
      });
      All(...infos).then(resolve);
    });
  });
}

function Once($base) {
  return Message((resolve, reject) => {
    let isFilled = false;
    $base.catch(reject);
    $base.then((v) => {
      if (!isFilled) {
        isFilled = true;
        resolve(v);
      }
    });
  });
}

function Piped($m, ...c) {
  return c.reduce((msg, Constructor) => {
    return ActualMessage(Constructor(msg));
  }, ActualMessage($m));
}

function Process($base, builder) {
  return Message((resolve, reject) => {
    const $res = Late();
    const dc = DestroyContainer();
    $base.then((v) => {
      dc.destroy();
      const $msg = builder(v);
      dc.add($msg);
      $res.chain($msg);
      $msg.catch(reject);
    });
    $base.catch(reject);
    $res.then(resolve);
    return () => {
      dc.destroy();
    };
  });
}

function Race(...messages) {
  const $messages = messages.map(ActualMessage);
  return Message((resolve, reject) => {
    let responded = false;
    $messages.forEach(($message) => {
      $message.catch(reject).then((v) => {
        if (responded === false) {
          responded = true;
          resolve(v);
        }
      });
    });
  });
}

function Sequence($base) {
  return Message((resolve, reject) => {
    const result = [];
    $base.catch(reject);
    $base.then((v) => {
      result.push(v);
      resolve(result.slice());
    });
  });
}

function Stream(base) {
  const $base = ActualMessage(base);
  return Message((resolve, reject) => {
    $base.catch(reject);
    $base.then((v) => {
      v.forEach((cv) => {
        resolve(cv);
      });
    });
  });
}

function Trackable(name, target) {
  Context("trackable", { name, action: "created" }).then(Void());
  return new Proxy(target, {
    get(target2, prop, receiver) {
      if (prop === "destroy") {
        Context("trackable", { name, action: "destroyed" }).then(Void());
      }
      return Reflect.get(target2, prop, receiver);
    }
  });
}

const silentiumPrint = (...messages) => {
  Applied(All(...messages.map((e) => Shared(e))), JSON.stringify).then(
    console.log
  );
};
const silentiumValue = ($message) => Primitive($message).primitive();
class MessageDestroyable {
  constructor(onDestroy) {
    this.onDestroy = onDestroy;
  }
  then(resolve) {
    resolve(`Wait destroy ${Date.now()}`);
    return this;
  }
  catch() {
    return this;
  }
  destroy() {
    this.onDestroy();
    return this;
  }
}
const silentiumDestroyable = (onDestroy) => new MessageDestroyable(onDestroy);
function DevTools() {
  if (typeof globalThis !== "undefined") {
    globalThis.silentiumDebug = {
      value: silentiumValue,
      print: silentiumPrint,
      destroyable: silentiumDestroyable
    };
  }
}

exports.ActualMessage = ActualMessage;
exports.All = All;
exports.Any = Any;
exports.Applied = Applied;
exports.AppliedDestructured = AppliedDestructured;
exports.Catch = Catch;
exports.Chain = Chain;
exports.Computed = Computed;
exports.Connected = Connected;
exports.Context = Context;
exports.ContextChain = ContextChain;
exports.ContextOf = ContextOf;
exports.Default = Default;
exports.DestroyContainer = DestroyContainer;
exports.DestroyContainerImpl = DestroyContainerImpl;
exports.Destroyable = Destroyable;
exports.DestroyableImpl = DestroyableImpl;
exports.DevTools = DevTools;
exports.Empty = Empty;
exports.EmptyImpl = EmptyImpl;
exports.ExecutorApplied = ExecutorApplied;
exports.Filtered = Filtered;
exports.Freeze = Freeze;
exports.FromEvent = FromEvent;
exports.Late = Late;
exports.LateImpl = LateImpl;
exports.Local = Local;
exports.Map = Map$1;
exports.Message = Message;
exports.MessageDestroyable = MessageDestroyable;
exports.MessageImpl = MessageImpl;
exports.MessageSource = MessageSource;
exports.MessageSourceImpl = MessageSourceImpl;
exports.New = New;
exports.Nothing = Nothing;
exports.Of = Of;
exports.Once = Once;
exports.Piped = Piped;
exports.Primitive = Primitive;
exports.PrimitiveImpl = PrimitiveImpl;
exports.Process = Process;
exports.Race = Race;
exports.Rejections = Rejections;
exports.ResetSilenceCache = ResetSilenceCache;
exports.Sequence = Sequence;
exports.Shared = Shared;
exports.SharedImpl = SharedImpl;
exports.Silence = Silence;
exports.Stream = Stream;
exports.Trackable = Trackable;
exports.Void = Void;
exports.ensureFunction = ensureFunction;
exports.ensureMessage = ensureMessage;
exports.isDestroyable = isDestroyable;
exports.isDestroyed = isDestroyed;
exports.isFilled = isFilled;
exports.isMessage = isMessage;
exports.isSource = isSource;
//# sourceMappingURL=silentium.cjs.map
