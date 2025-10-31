/**
 * Type that takes a value as an argument
 * and returns a specific value
 */
type ConstructorType<P extends unknown[] = unknown[], T = unknown> = (...args: P) => T;

/**
 * Type representing the process
 * of passing a value somewhere
 */
interface TransportType<T = unknown, R = null> {
    use(value: T): R extends null ? this : R;
}

/**
 * The event type from which
 * values should be received
 */
interface EventType<T = unknown> {
    event(user: TransportType<T>): this;
}
/**
 * Type of an object that can
 * be destroyed
 */
interface DestroyableType {
    destroy(): this;
}
/**
 * Value type from event
 */
type EventTypeValue<T> = T extends EventType<infer U> ? U : never;

/**
 * A type that serves as both
 * an event and a transport
 */
type SourceType<T = unknown> = EventType<T> & TransportType<T>;

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
declare function All<const T extends EventType[]>(...events: T): TheAll<T>;
declare class TheAll<const T extends EventType[]> implements EventType<ExtractTypesFromArrayS<T>> {
    private keysKnown;
    private keysFilled;
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
declare function Any<T>(...events: EventType<T>[]): TheAny<T>;
declare class TheAny<T> implements EventType<T> {
    private $events;
    constructor(...events: EventType<T>[]);
    event(transport: TransportType<T>): this;
}

/**
 * An event that applies a function
 * to the value of the base event
 */
declare function Applied<T, R>($base: EventType<T>, applier: ConstructorType<[T], R>): TheApplied<T, R>;
declare class TheApplied<T, R> implements EventType<R> {
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
declare function Catch<T>($base: EventType<T>, errorMessage: TransportType, errorOriginal?: TransportType): TheCatch<T>;
declare class TheCatch<T> implements EventType<T> {
    private $base;
    private errorMessage;
    private errorOriginal?;
    constructor($base: EventType<T>, errorMessage: TransportType, errorOriginal?: TransportType | undefined);
    event(transport: TransportType<T>): this;
}

type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;
/**
 * Chains events together and triggers
 * the last event only when all previous events
 * have emitted their values. The value of Chain will be the value
 * of the last event. If any events
 * emit a value again after the overall Chain response was already returned,
 * then Chain emits again with the value of the last event.
 */
declare function Chain<T extends EventType[]>(...events: T): TheChain<T>;
declare class TheChain<T extends EventType[]> implements EventType<EventTypeValue<Last<T>>> {
    private $events;
    private lastValue;
    constructor(...events: T);
    event(transport: TransportType<EventTypeValue<Last<T>>>): this;
    private handleEvent;
    private oneEventTransport;
}

/**
 * Create a function component that
 * will emit an event with specified arguments
 * and specified type
 */
declare function Component<T, P extends Array<any>>(executor: (this: TransportType<P[0] extends EventType ? EventTypeValue<P[0]> : T>, ...args: P) => void | (() => void)): (...args: P) => (P[0] extends EventType ? EventType<EventTypeValue<P[0]>> : EventType<T>) & DestroyableType;

type ConstructableType = {
    new (...args: any[]): any;
};
declare function ComponentClass<T extends ConstructableType>(classConstructor: T): <R = null>(...args: ConstructorParameters<T>) => R extends null ? ConstructorParameters<T>[0] extends EventType ? InstanceType<T> extends SourceType ? InstanceType<T> extends DestroyableType ? SourceType<EventTypeValue<ConstructorParameters<T>[0]>> & DestroyableType : SourceType<EventTypeValue<ConstructorParameters<T>[0]>> : InstanceType<T> extends DestroyableType ? EventType<EventTypeValue<ConstructorParameters<T>[0]>> & DestroyableType : EventType<EventTypeValue<ConstructorParameters<T>[0]>> : InstanceType<T> : R extends EventType ? R : EventType<R>;

/**
 * An object that allows collecting all disposable objects and
 * disposing them later all together
 */
declare function DestroyContainer(): TheDestroyContainer;
declare class TheDestroyContainer implements DestroyableType {
    private destructors;
    add(e: DestroyableType): this;
    destroy(): this;
}

type EventExecutor<T> = (transport: TransportType<T>) => void | (() => void);
/**
 * An event created from an executor function.
 * The executor function can return an event destruction function.
 */
declare function Event<T>(eventExecutor: EventExecutor<T>): TheEvent<T>;
declare class TheEvent<T> implements EventType<T>, DestroyableType {
    private eventExecutor;
    private mbDestructor;
    constructor(eventExecutor: EventExecutor<T>);
    event(transport: TransportType<T>): this;
    destroy(): this;
}

/**
 * Create local copy of source what can be destroyed
 */
declare function Local<T>($base: EventType<T>): TheLocal<T>;
declare class TheLocal<T> implements EventType<T>, DestroyableType {
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
declare function Of<T>(value: T): TheOf<T>;
declare class TheOf<T> implements EventType<T> {
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
declare function Transport<T>(transportExecutor: TransportExecutor<T>): TheTransport<T>;
declare class TheTransport<T> implements TransportType<T> {
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
declare function TransportEvent<T, ET = any>(transportExecutor: TransportEventExecutor<T, ET>): TheTransportEvent<T, ET>;
declare class TheTransportEvent<T, ET = T> implements TransportType<T, EventType<ET>> {
    private executor;
    constructor(executor: TransportEventExecutor<T, ET>);
    use(value: T): EventType<ET>;
}
/**
 * A transport that accepts a child transport
 * to perform some transformation on the value
 * during its transmission
 */
declare class ParentTransport<T> implements TransportType<T> {
    private executor;
    private args;
    private _child?;
    constructor(executor: (v: T, transport: TransportType, ...args: any[]) => void, args?: any[], _child?: TransportType<T> | undefined);
    use(value: T): this;
    child(transport: TransportType, ...args: any[]): ParentTransport<T>;
}

/**
 * Transport that does nothing with the passed value,
 * needed for silent event triggering
 */
declare function Void(): TheVoid;
declare class TheVoid implements TransportType {
    use(): this;
}

type ExecutorApplier<T> = (executor: TransportExecutor<T>) => TransportExecutor<T>;
/**
 * Applies a value transfer function to the transport
 * and returns the same value transfer function for the transport
 * Useful for applying functions like debounced or throttle
 */
declare function ExecutorApplied<T>($base: EventType<T>, applier: ExecutorApplier<T>): TheExecutorApplied<T>;
declare class TheExecutorApplied<T> implements EventType<T> {
    private $base;
    private applier;
    constructor($base: EventType<T>, applier: ExecutorApplier<T>);
    event(transport: TransportType<T>): this;
}

declare function Filtered<T>($base: EventType<T>, predicate: ConstructorType<[T], boolean>, defaultValue?: T): TheFiltered<T>;
declare class TheFiltered<T> implements EventType<T> {
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
declare function FromEvent<T>($emitter: EventType<any>, $eventName: EventType<string>, $subscribeMethod: EventType<string>, $unsubscribeMethod?: EventType<string>): TheFromEvent<T>;
declare class TheFromEvent<T> implements EventType<T>, DestroyableType {
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
 * Promise event
 */
declare function FromPromise<T>(p: Promise<T>, errorOwner?: TransportType): TheFromPromise<T>;
declare class TheFromPromise<T> implements EventType<T> {
    private p;
    private errorOwner?;
    constructor(p: Promise<T>, errorOwner?: TransportType | undefined);
    event(transport: TransportType<T>): this;
}

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare function Late<T>(v?: T): TheLate<T>;
declare class TheLate<T> implements SourceType<T> {
    private v?;
    private lateTransport;
    private notify;
    constructor(v?: T | undefined);
    event(transport: TransportType<T>): this;
    use(value: T): this;
}

/**
 * An event with a value that will be set later,
 * capable of responding to different transports
 */
declare function LateShared<T>(value?: T): TheLateShared<T>;
declare class TheLateShared<T> implements SourceType<T> {
    private $event;
    constructor(value?: T);
    event(transport: TransportType<T>): this;
    use(value: T): this;
}

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 */
declare function Map<T, TG>($base: EventType<T[]>, $target: TransportType<any, EventType<TG>>): TheMap<T, TG>;
declare class TheMap<T, TG> implements EventType<TG[]> {
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
declare function Once<T>($base: EventType<T>): TheOnce<T>;
declare class TheOnce<T> implements EventType<T> {
    private $base;
    private isFilled;
    constructor($base: EventType<T>);
    event(transport: TransportType<T>): this;
    private parent;
}

/**
 * Helps represent an event as a primitive type, which can be useful
 * for cases when you need to always have a reference to the current value
 * without updating the shared value when the current one changes.
 * For example, this could be used when passing an authorization token.
 * It can also be useful for testing or logging purposes.
 */
declare function Primitive<T>($base: EventType<T>, theValue?: T | null): ThePrimitive<T>;
declare class ThePrimitive<T> {
    private $base;
    private theValue;
    private touched;
    constructor($base: EventType<T>, theValue?: T | null);
    private ensureTouched;
    [Symbol.toPrimitive](): T | null;
    primitive(): T | null;
    primitiveWithException(): T & ({} | undefined);
}

declare function Sequence<T>($base: EventType<T>): TheSequence<T>;
/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 */
declare class TheSequence<T> implements EventType<T[]> {
    private $base;
    private result;
    constructor($base: EventType<T>);
    event(transport: TransportType<T[]>): this;
    private parent;
}

declare const isFilled: <T>(value?: T) => value is Exclude<T, null | undefined>;
declare function isEvent<T>(o: T): o is T & EventType;
declare function isDestroyable<T>(o: T): o is T & DestroyableType;
declare function isTransport<T>(o: T): o is T & TransportType;

declare function ensureFunction(v: unknown, label: string): void;
declare function ensureEvent(v: unknown, label: string): void;
declare function ensureTransport(v: unknown, label: string): void;

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
declare class OwnerPool<T> {
    private owners;
    private innerOwner;
    constructor();
    owner(): TransportType<T, null>;
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
declare function Shared<T>($base: EventType<T>, stateless?: boolean): TheShared<T>;
declare class TheShared<T> implements SourceType<T> {
    private $base;
    private stateless;
    private ownersPool;
    private lastValue;
    private calls;
    constructor($base: EventType<T>, stateless?: boolean);
    event(transport: TransportType<T>): this;
    use(value: T): this;
    private firstCallTransport;
    touched(): void;
    pool(): OwnerPool<T>;
    destroy(): OwnerPool<T>;
}

declare function SharedSource<T>($base: SourceType<T>, stateless?: boolean): TheSharedSource<T>;
declare class TheSharedSource<T> implements SourceType<T> {
    private $base;
    private $sharedBase;
    constructor($base: SourceType<T>, stateless?: boolean);
    event(transport: TransportType<T>): this;
    use(value: T): this;
}

/**
 * Component that receives a data array and yields values one by one
 */
declare function Stream<T>($base: EventType<T[]>): TheStream<T>;
declare class TheStream<T> implements EventType<T> {
    private $base;
    constructor($base: EventType<T[]>);
    event(transport: TransportType<T>): this;
    private parent;
}

declare function TransportApplied<T>(baseTransport: TransportType<any, EventType<T>>, applier: ConstructorType<[EventType], EventType<T>>): TheTransportApplied<T>;
declare class TheTransportApplied<T> implements TransportType<unknown, EventType<T>> {
    private baseTransport;
    private applier;
    constructor(baseTransport: TransportType<any, EventType<T>>, applier: ConstructorType<[EventType], EventType<T>>);
    use(args: unknown): EventType<T>;
}

declare function TransportArgs(baseTransport: TransportType<any[], EventType>, args: unknown[], startFromArgIndex?: number): TheTransportArgs;
declare class TheTransportArgs implements TransportType<unknown[], EventType<unknown>> {
    private baseTransport;
    private args;
    private startFromArgIndex;
    constructor(baseTransport: TransportType<any[], EventType>, args: unknown[], startFromArgIndex?: number);
    use(runArgs: unknown[]): EventType<unknown>;
}

declare function TransportDestroyable<T>(baseTransport: TransportType<any[], EventType<T>>): TheTransportDestroyable<T>;
/**
 * Constructor what can be destroyed
 */
declare class TheTransportDestroyable<T> implements TransportType<unknown, EventType>, DestroyableType {
    private baseTransport;
    private destructors;
    constructor(baseTransport: TransportType<any, EventType<T>>);
    use(args: unknown): EventType<T>;
    destroy(): this;
}

export { All, Any, Applied, Catch, Chain, Component, ComponentClass, type ConstructorType, DestroyContainer, type DestroyableType, Event, type EventType, type EventTypeValue, ExecutorApplied, Filtered, FromEvent, FromPromise, Late, LateShared, Local, Map, Of, Once, OwnerPool, ParentTransport, Primitive, Sequence, Shared, SharedSource, type SourceType, Stream, TheChain, TheFromPromise, TheTransportApplied, TheTransportArgs, Transport, TransportApplied, TransportArgs, TransportDestroyable, TransportEvent, type TransportEventExecutor, type TransportExecutor, type TransportType, Void, ensureEvent, ensureFunction, ensureTransport, isDestroyable, isEvent, isFilled, isTransport };
