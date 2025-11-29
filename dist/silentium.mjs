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
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, key + "" , value);
function DestroyContainer() {
  return new DestroyContainerImpl();
}
class DestroyContainerImpl {
  constructor() {
    __publicField$7(this, "destructors", []);
  }
  add(e) {
    this.destructors.push(Destroyable(e));
    return e;
  }
  destroy() {
    this.destructors.forEach((d) => d.destroy());
    this.destructors.length = 0;
    return this;
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
  return new MessageRx(executor);
}
class MessageRx {
  constructor(executor) {
    this.executor = executor;
    __publicField$5(this, "rejections", new Rejections());
    __publicField$5(this, "dc", DestroyContainer());
    ensureFunction(executor, "Message: executor");
  }
  then(resolve) {
    try {
      this.dc.add(this.executor(resolve, this.rejections.reject));
    } catch (e) {
      this.rejections.reject(e);
    }
    return this;
  }
  catch(rejected) {
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

function Chainable(src) {
  return new ChainableImpl(src);
}
class ChainableImpl {
  constructor(src) {
    this.src = src;
  }
  chain($m) {
    $m.then(this.src.use.bind(this.src));
    return this;
  }
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
          resolve(result);
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
    $base.catch(reject);
    $base.then((v) => {
      resolve(applier(v));
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
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
function Late(v) {
  return new LateImpl(v);
}
class LateImpl {
  constructor(v) {
    this.v = v;
    __publicField$3(this, "rejections", new Rejections());
    __publicField$3(this, "lateR", null);
    __publicField$3(this, "notify", () => {
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
    this.lateR = r;
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

Context.transport = /* @__PURE__ */ new Map();
function Context(msg) {
  const $msg = ActualMessage(msg);
  return Message((resolve, reject) => {
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
  });
}

function ContextChain(base) {
  const $base = ActualMessage(base);
  return (context) => {
    if (!context.result) {
      throw new Error("ContextChain did not find result in rpc message");
    }
    $base.then(context.result);
  };
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, key + "" , value);
function Primitive($base, theValue = null) {
  return new PrimitiveImpl($base, theValue);
}
class PrimitiveImpl {
  constructor($base, theValue = null) {
    this.$base = $base;
    this.theValue = theValue;
    __publicField$2(this, "touched", false);
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

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
function Shared($base) {
  return new SharedImpl($base);
}
class SharedImpl {
  constructor($base) {
    this.$base = $base;
    __publicField$1(this, "resolver", (v) => {
      this.lastV = v;
      this.resolvers.forEach((r) => {
        r(v);
      });
    });
    __publicField$1(this, "lastV");
    __publicField$1(this, "resolvers", /* @__PURE__ */ new Set());
    __publicField$1(this, "source");
    if (isSource($base)) {
      this.source = $base;
    }
  }
  then(resolved) {
    this.resolvers.add(resolved);
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

function LateShared(value) {
  const l = Late(value);
  return Shared(l);
}

function ContextOf(transport) {
  const $msg = LateShared();
  Context.transport.set(transport, $msg.use.bind($msg));
  return Message((resolve, reject) => {
    $msg.catch(reject);
    $msg.then(resolve);
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
    __publicField(this, "$empty", LateShared());
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

function Process($base, builder) {
  return Message((resolve, reject) => {
    const $res = LateShared();
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

function Sequence($base) {
  return Message((resolve, reject) => {
    const result = [];
    $base.catch(reject);
    $base.then((v) => {
      result.push(v);
      resolve(result);
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

export { ActualMessage, All, Any, Applied, AppliedDestructured, Catch, Chain, Chainable, ChainableImpl, Context, ContextChain, ContextOf, DestroyContainer, DestroyContainerImpl, Destroyable, DestroyableImpl, Empty, EmptyImpl, ExecutorApplied, Filtered, Freeze, FromEvent, Late, LateImpl, LateShared, Local, Map$1 as Map, Message, MessageRx, MessageSource, MessageSourceImpl, New, Nothing, Of, Once, Primitive, PrimitiveImpl, Process, Rejections, Sequence, Shared, SharedImpl, Stream, Void, ensureFunction, ensureMessage, isDestroyable, isDestroyed, isFilled, isMessage, isSource };
//# sourceMappingURL=silentium.mjs.map
