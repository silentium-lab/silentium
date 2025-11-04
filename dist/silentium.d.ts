/**
 * Type of an object that can
 * be destroyed
 */
interface DestroyableType {
    destroy(): this;
}
/**
 * Represents an object that can provide an answer
 * whether it was destroyed
 */
interface DestroyedType {
    destroyed(): boolean;
}

/**
 * Type representing the process
 * of passing a value somewhere
 */
interface TransportType<T = unknown, R = any> {
    use(value: T): R;
}
/**
 * Transport that can be destroyed
 */
type TransportDestroyableType<T = any, R = any> = TransportType<T, R> & DestroyableType & DestroyedType;

/**
 * The event type from which
 * values should be received
 */
interface EventType<T = unknown> {
    event(user: TransportType<T>): this;
}
/**
 * Value type from event
 */
type EventTypeValue<T> = T extends EventType<infer U> ? U : never;

/**
 * Create a function component that
 * will emit an event with specified arguments
 * and specified type
 */
declare function Component<T, P extends Array<any>>(executor: (this: TransportType<P[0] extends EventType ? EventTypeValue<P[0]> : T>, ...args: P) => void | (() => void)): (...args: P) => (P[0] extends EventType ? EventType<EventTypeValue<P[0]>> : EventType<T>) & DestroyableType;

/**
 * A type that serves as both
 * an event and a transport
 */
type SourceType<T = unknown> = EventType<T> & TransportType<T>;

type ConstructableType = {
    new (...args: any[]): any;
};
/**
 * Creates a type-safe factory function for instantiating components with proper interface inference
 * Automatically determines return types based on whether the class implements SourceType, EventType, and DestroyableType
 */
declare function ComponentClass<T extends ConstructableType>(classConstructor: T): <R = null>(...args: ConstructorParameters<T>) => R extends null ? ConstructorParameters<T>[0] extends EventType ? InstanceType<T> extends SourceType ? InstanceType<T> extends DestroyableType ? SourceType<EventTypeValue<ConstructorParameters<T>[0]>> & DestroyableType : SourceType<EventTypeValue<ConstructorParameters<T>[0]>> : InstanceType<T> extends DestroyableType ? EventType<EventTypeValue<ConstructorParameters<T>[0]>> & DestroyableType : EventType<EventTypeValue<ConstructorParameters<T>[0]>> : InstanceType<T> : R extends EventType ? R : EventType<R>;

/**
 * An object that allows collecting all disposable objects and
 * disposing them later all together
 */
declare function DestroyContainer(): DestroyContainerImpl;
declare class DestroyContainerImpl implements DestroyableType {
    private destructors;
    add<R extends DestroyableType>(e: R): R;
    destroy(): this;
}

type EventExecutor<T> = (transport: TransportType<T>) => void | (() => void);
/**
 * An event created from an executor function.
 * The executor function can return an event destruction function.
 */
declare function Event<T>(eventExecutor: EventExecutor<T>): EventImpl<T>;
declare class EventImpl<T> implements EventType<T>, DestroyableType {
    private eventExecutor;
    private mbDestructor;
    constructor(eventExecutor: EventExecutor<T>);
    event(transport: TransportType<T>): this;
    destroy(): this;
}

/**
 * Create local copy of source what can be destroyed
 */
declare function Local<T>($base: EventType<T>): LocalEvent<T>;
declare class LocalEvent<T> implements EventType<T>, DestroyableType {
    private $base;
    private destroyed;
    constructor($base: EventType<T>);
    event(transport: TransportType<T>): this;
    private transport;
    destroy(): this;
}

/**
 * Helps convert a value into an event
 */
declare function Of<T>(value: T): OfEvent<T>;
declare class OfEvent<T> implements EventType<T> {
    private value;
    constructor(value: T);
    event(transport: TransportType<T>): this;
}

/**
 * Type of value transfer logic executor
 */
type TransportExecutor<T> = (v: T) => void;
/**
 * Base transport that accepts the passed value,
 * acts as a conductor to deliver the value from an event to somewhere
 */
declare function Transport<T>(transportExecutor: TransportExecutor<T>): TransportImpl<T>;
declare class TransportImpl<T> implements TransportType<T> {
    private transportExecutor;
    constructor(transportExecutor: TransportExecutor<T>);
    use(value: T): this;
}
/**
 * Type of executor for value passing logic and event returning
 */
type TransportEventExecutor<T, ET = T> = (v: T) => EventType<ET>;
/**
 * A transport that delivers a value from one event
 * and returns another event based on the value
 */
declare function TransportEvent<T, ET = any>(transportExecutor: TransportEventExecutor<T, ET>): TransportEventImpl<T, ET>;
declare class TransportEventImpl<T, ET = T> implements TransportType<T, EventType<ET>> {
    private executor;
    constructor(executor: TransportEventExecutor<T, ET>);
    use(value: T): EventType<ET>;
}
/**
 * A transport that accepts a child transport
 * to perform some transformation on the value
 * during its transmission
 */
declare function TransportParent<T>(executor: (this: TransportType, v: T, ...context: any[]) => void, ...args: any[]): TransportParentImpl<T>;
declare class TransportParentImpl<T> implements TransportType<T> {
    private executor;
    private args;
    private _child?;
    constructor(executor: (this: TransportType, v: T, ...context: any[]) => void, args?: any[], _child?: TransportType<T> | undefined);
    use(value: T): this;
    child(transport: TransportType, ...args: any[]): TransportParentImpl<T>;
}

/**
 * Transport that does nothing with the passed value,
 * needed for silent event triggering
 */
declare function Void(): VoidImpl;
declare class VoidImpl implements TransportType {
    use(): this;
}

type ExtractTypeS<T> = T extends EventType<infer U> ? U : never;
type ExtractTypesFromArrayS<T extends EventType<any>[]> = {
    [K in keyof T]: ExtractTypeS<T[K]>;
};
/**
 * An event that represents values from
 * all provided events as an array.
 * When all events emit their values,
 * the combined value will be returned.
 * If at least one event later emits a new
 * value, the updated array with the new value
 * will be emitted by All.
 */
declare function All<const T extends EventType[]>(...events: T): AllEvent<T>;
declare class AllEvent<const T extends EventType[]> implements EventType<ExtractTypesFromArrayS<T>> {
    private known;
    private filled;
    private $events;
    private result;
    constructor(...events: T);
    event(transport: TransportType<ExtractTypesFromArrayS<T>>): this;
    private transport;
}

/**
 * An event that emits values received from
 * any of its bound events
 */
declare function Any<const T>(...events: EventType<T>[]): AnyEvent<T>;
declare class AnyEvent<T> implements EventType<T> {
    private $events;
    constructor(...events: EventType<T>[]);
    event(transport: TransportType<T>): this;
}

/**
 * Type that takes a value as an argument
 * and returns a specific value
 */
type ConstructorType<P extends unknown[] = unknown[], T = unknown> = (...args: P) => T;

/**
 * An event that applies a function
 * to the value of the base event
 */
declare function Applied<const T, R>($base: EventType<T>, applier: ConstructorType<[T], R>): AppliedEvent<T, R>;
declare class AppliedEvent<T, R> implements EventType<R> {
    private $base;
    private applier;
    constructor($base: EventType<T>, applier: ConstructorType<[T], R>);
    event(transport: TransportType<R>): this;
    private transport;
}

/**
 * An event representing a base event where
 * its operation is wrapped in try-catch
 * and expects exceptions. If an exception
 * bubbles up, it's passed to the transports
 * as errorMessage and errorOriginal
 */
declare function Catch<T>($base: EventType<T>, errorMessage: TransportType, errorOriginal?: TransportType): CatchEvent<T>;
declare class CatchEvent<T> implements EventType<T> {
    private $base;
    private errorMessage;
    private errorOriginal?;
    constructor($base: EventType<T>, errorMessage: TransportType, errorOriginal?: TransportType | undefined);
    event(transport: TransportType<T>): this;
}

type Last<T extends readonly any[]> = T extends readonly [...infer _, infer L] ? L : never;
/**
 * Chains events together and triggers
 * the last event only when all previous events
 * have emitted their values. The value of Chain will be the value
 * of the last event. If any events
 * emit a value again after the overall Chain response was already returned,
 * then Chain emits again with the value of the last event.
 */
declare function Chain<T extends readonly EventType[]>(...events: T): ChainEvent<T>;
declare class ChainEvent<T extends readonly EventType[]> implements EventType<EventTypeValue<Last<T>>> {
    private $events;
    private $latest;
    constructor(...events: T);
    event(transport: TransportType<EventTypeValue<Last<T>>>): this;
    private handleEvent;
    private oneEventTransport;
}

type ExecutorApplier<T> = (executor: TransportExecutor<T>) => TransportExecutor<T>;
/**
 * Applies a value transfer function to the transport
 * and returns the same value transfer function for the transport
 * Useful for applying functions like debounced or throttle
 */
declare function ExecutorApplied<T>($base: EventType<T>, applier: ExecutorApplier<T>): ExecutorAppliedEvent<T>;
declare class ExecutorAppliedEvent<T> implements EventType<T> {
    private $base;
    private applier;
    constructor($base: EventType<T>, applier: ExecutorApplier<T>);
    event(transport: TransportType<T>): this;
}

/**
 * Filters values from the source event based on a predicate function,
 * optionally providing a default value when the predicate fails.
 */
declare function Filtered<T>($base: EventType<T>, predicate: ConstructorType<[T], boolean>, defaultValue?: T): EventType<T>;
declare class FilteredEvent<T> implements EventType<T> {
    private $base;
    private predicate;
    private defaultValue?;
    constructor($base: EventType<T>, predicate: ConstructorType<[T], boolean>, defaultValue?: T | undefined);
    event(transport: TransportType<T>): this;
    private parent;
}

/**
 * An event derived from another event with a different
 * method call interface, based on callbacks.
 * Allows attaching a custom handler to an existing event source
 * and presenting it as a silentium event
 */
declare function FromEvent<T>($emitter: EventType<any>, $eventName: EventType<string>, $subscribeMethod: EventType<string>, $unsubscribeMethod?: EventType<string>): FromEventAdapter<T>;
declare class FromEventAdapter<T> implements EventType<T>, DestroyableType {
    private $emitter;
    private $eventName;
    private $subscribeMethod;
    private $unsubscribeMethod?;
    private lastTransport;
    private handler;
    constructor($emitter: EventType<any>, $eventName: EventType<string>, $subscribeMethod: EventType<string>, $unsubscribeMethod?: EventType<string> | undefined);
    event(transport: TransportType<T>): this;
    private parent;
    destroy(): this;
}

/**
 * Creates an event from a Promise, allowing the promise's resolution or rejection
 * to be handled as an event. The resolved value is emitted to the transport,
 * and if an error is provided, rejections are forwarded to it.
 */
declare function FromPromise<T>(p: Promise<T>, error?: TransportType): FromPromiseEvent<T>;
declare class FromPromiseEvent<T> implements EventType<T> {
    private p;
    private error?;
    constructor(p: Promise<T>, error?: TransportType | undefined);
    event(transport: TransportType<T>): this;
}

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare function Late<T>(v?: T): LateEvent<T>;
declare class LateEvent<T> implements SourceType<T> {
    private v?;
    private lateTransport;
    private notify;
    constructor(v?: T | undefined);
    event(transport: TransportType<T>): this;
    use(value: T): this;
}

/**
 * Helps represent an event as a primitive type, which can be useful
 * for cases when you need to always have a reference to the current value
 * without updating the shared value when the current one changes.
 * For example, this could be used when passing an authorization token.
 * It can also be useful for testing or logging purposes.
 */
declare function Primitive<T>($base: EventType<T>, theValue?: T | null): PrimitiveImpl<T>;
declare class PrimitiveImpl<T> {
    private $base;
    private theValue;
    private touched;
    constructor($base: EventType<T>, theValue?: T | null);
    private ensureTouched;
    [Symbol.toPrimitive](): T | null;
    primitive(): T | null;
    primitiveWithException(): T & ({} | undefined);
}

/**
 * An event with a value that will be set later,
 * capable of responding to different transports
 */
declare function LateShared<T>(value?: T): LateSharedEvent<T>;
declare class LateSharedEvent<T> implements SourceType<T> {
    private $event;
    private primitive;
    constructor(value?: T);
    event(transport: TransportType<T>): this;
    use(value: T): this;
    value(): PrimitiveImpl<T>;
}

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 */
declare function Map<T, TG>($base: EventType<T[]>, $target: TransportType<any, EventType<TG>>): MapEvent<T, TG>;
declare class MapEvent<T, TG> implements EventType<TG[]> {
    private $base;
    private $target;
    constructor($base: EventType<T[]>, $target: TransportType<any, EventType<TG>>);
    event(transport: TransportType<TG[]>): this;
    private parent;
}

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 */
declare function Once<T>($base: EventType<T>): OnceEvent<T>;
declare class OnceEvent<T> implements EventType<T> {
    private $base;
    private isFilled;
    constructor($base: EventType<T>);
    event(transport: TransportType<T>): this;
    private parent;
}

/**
 * Creates a sequence that accumulates all values from the source into an array,
 * emitting the growing array with each new value.
 */
declare function Sequence<T>($base: EventType<T>): SequenceEvent<T>;
declare class SequenceEvent<T> implements EventType<T[]> {
    private $base;
    private result;
    constructor($base: EventType<T>);
    event(transport: TransportType<T[]>): this;
    private parent;
}

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
declare class TransportPool<T> {
    private transports;
    private innerTransport;
    constructor();
    transport(): TransportType<T, any>;
    size(): number;
    has(owner: TransportType<T>): boolean;
    add(owner: TransportType<T>): this;
    remove(g: TransportType<T>): this;
    destroy(): this;
}

/**
 * An information object that helps multiple owners access
 * a single another information object
 */
declare function Shared<T>($base: EventType<T>, stateless?: boolean): SharedEvent<T>;
declare class SharedEvent<T> implements SourceType<T> {
    private $base;
    private stateless;
    private transportPool;
    private lastValue;
    private calls;
    constructor($base: EventType<T>, stateless?: boolean);
    event(transport: TransportType<T>): this;
    use(value: T): this;
    private firstCallTransport;
    touched(): void;
    pool(): TransportPool<T>;
    destroy(): TransportPool<T>;
}

/**
 * Creates a shared source that allows multiple transports to subscribe to the same underlying source.
 * The stateless parameter controls whether the sharing maintains state or not.
 */
declare function SharedSource<T>($base: SourceType<T>, stateless?: boolean): SharedSourceEvent<T>;
declare class SharedSourceEvent<T> implements SourceType<T> {
    private $base;
    private $sharedBase;
    constructor($base: SourceType<T>, stateless?: boolean);
    event(transport: TransportType<T>): this;
    use(value: T): this;
}

/**
 * Component that receives a data array and yields values one by one
 */
declare function Stream<T>($base: EventType<T[]>): StreamEvent<T>;
declare class StreamEvent<T> implements EventType<T> {
    private $base;
    constructor($base: EventType<T[]>);
    event(transport: TransportType<T>): this;
    private parent;
}

/**
 * Creates a transport that applies a constructor to the result of another transport.
 */
declare function TransportApplied<T>(baseTransport: TransportType<any, EventType<T>>, applier: ConstructorType<[EventType], EventType<T>>): TransportAppliedImpl<T>;
declare class TransportAppliedImpl<T> implements TransportType<unknown, EventType<T>> {
    private baseTransport;
    private applier;
    constructor(baseTransport: TransportType<any, EventType<T>>, applier: ConstructorType<[EventType], EventType<T>>);
    use(args: unknown): EventType<T>;
}

/**
 * Creates a transport that merges additional arguments into the base transport's arguments
 * at a specified index position, allowing for flexible argument composition
 */
declare function TransportArgs(baseTransport: TransportType<any[], EventType>, args: unknown[], startFromArgIndex?: number): TransportArgsImpl;
declare class TransportArgsImpl implements TransportType<unknown[], EventType<unknown>> {
    private baseTransport;
    private args;
    private startFromArgIndex;
    constructor(baseTransport: TransportType<any[], EventType>, args: unknown[], startFromArgIndex?: number);
    use(runArgs: unknown[]): EventType<unknown>;
}

/**
 * Creates a transport wrapper that automatically manages destruction of created instances
 */
declare function TransportDestroyable<T>(baseTransport: TransportType<any[], EventType<T>>): TransportDestroyableEvent<T>;
declare class TransportDestroyableEvent<T> implements TransportType<unknown, EventType<T>>, DestroyableType {
    private baseTransport;
    private destructors;
    constructor(baseTransport: TransportType<any[], EventType<T>>);
    use(args: any[]): EventType<T>;
    destroy(): this;
}

/**
 * Type for passing action requirements
 * to an external system
 */
interface RPCType extends Record<string, any> {
    method: string;
    transport?: string;
    params?: Record<string, any>;
    result?: TransportType;
    error?: TransportType;
}

interface RPCImplType<T> {
    result(): EventType<T>;
    error(): EventType<Error | string>;
}
/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * RPCType, the list of transports should be defined via
 * the RPC.transport object
 */
declare function RPC<T>($rpc: EventType<RPCType>): RPCImplType<T>;
declare namespace RPC {
    var transport: {
        default: TransportType<RPCType>;
    } & Record<string, TransportType<RPCType, any>>;
}
declare class RPCImpl {
    private $rpc;
    private $result;
    private $error;
    constructor($rpc: EventType<RPCType>);
    result(): LateSharedEvent<unknown>;
    error(): LateSharedEvent<unknown>;
}

/**
 * Event for the arrival of a specific RPC message
 * for specific transport
 */
declare function RPCOf($rpc: EventType<RPCType>, transport: string): EventType<RPCType>;

/**
 * Checks that the value is neither undefined nor null
 */
declare const isFilled: <T>(value?: T) => value is Exclude<T, null | undefined>;
/**
 * Checks that the object is an event
 */
declare function isEvent<T>(o: T): o is T & EventType;
/**
 * Checks that the object is destroyable
 */
declare function isDestroyable<T>(o: T): o is T & DestroyableType;
/**
 * Checks that the object can indicate whether it has been destroyed or not
 */
declare function isDestroyed<T>(o: T): o is T & DestroyedType;
/**
 * Checks that the object is a transport
 */
declare function isTransport<T>(o: T): o is T & TransportType;

declare function ensureFunction(v: unknown, label: string): void;
declare function ensureEvent(v: unknown, label: string): void;
declare function ensureTransport(v: unknown, label: string): void;

export { All, AllEvent, Any, AnyEvent, Applied, AppliedEvent, Catch, CatchEvent, Chain, ChainEvent, Component, ComponentClass, type ConstructorType, DestroyContainer, DestroyContainerImpl, type DestroyableType, type DestroyedType, Event, EventImpl, type EventType, type EventTypeValue, ExecutorApplied, ExecutorAppliedEvent, Filtered, FilteredEvent, FromEvent, FromEventAdapter, FromPromise, FromPromiseEvent, Late, LateEvent, LateShared, LateSharedEvent, Local, LocalEvent, Map, MapEvent, Of, OfEvent, Once, OnceEvent, Primitive, PrimitiveImpl, RPC, RPCImpl, RPCOf, type RPCType, Sequence, SequenceEvent, Shared, SharedEvent, SharedSource, SharedSourceEvent, type SourceType, Stream, StreamEvent, Transport, TransportApplied, TransportAppliedImpl, TransportArgs, TransportArgsImpl, TransportDestroyable, TransportDestroyableEvent, type TransportDestroyableType, TransportEvent, type TransportEventExecutor, type TransportExecutor, TransportParent, TransportParentImpl, TransportPool, type TransportType, Void, VoidImpl, ensureEvent, ensureFunction, ensureTransport, isDestroyable, isDestroyed, isEvent, isFilled, isTransport };
