/**
 * A function type that takes a value as an argument
 * and returns a specific value
 */
type ConstructorType<P extends unknown[] = unknown[], T = unknown> = (...args: P) => T;

interface EventUserType<T = unknown> {
    use(value: T): this;
}

interface EventType<T = unknown> {
    event(user: EventUserType<T>): this;
}
interface DestroyableType {
    destroy(): this;
}
type EventTypeValue<T> = T extends EventType<infer U> ? U : never;

type SourceType<T = unknown> = EventType<T> & EventUserType<T>;

/**
 * A function type that takes a value as an argument
 * and returns a specific value
 */
type TransportType<P extends unknown[] = unknown[], T = unknown> = {
    of(...args: P): EventType<T>;
};

type ExtractTypeS<T> = T extends EventType<infer U> ? U : never;
type ExtractTypesFromArrayS<T extends EventType<any>[]> = {
    [K in keyof T]: ExtractTypeS<T[K]>;
};
declare class All<const T extends EventType[]> implements EventType<ExtractTypesFromArrayS<T>> {
    private keysKnown;
    private keysFilled;
    private $events;
    private result;
    constructor(...events: T);
    event(user: EventUserType<ExtractTypesFromArrayS<T>>): this;
    private user;
}

declare class Any<T> implements EventType<T> {
    private $events;
    constructor(...events: EventType<T>[]);
    event(user: EventUserType<T>): this;
}

declare class Applied<T, R> implements EventType<R> {
    private $base;
    private applier;
    constructor($base: EventType<T>, applier: ConstructorType<[T], R>);
    event(user: EventUserType<R>): this;
    private user;
}

declare class Catch<T> implements EventType<T> {
    private $base;
    private errorMessage;
    private errorOriginal?;
    constructor($base: EventType<T>, errorMessage: EventUserType, errorOriginal?: EventUserType | undefined);
    event(user: EventUserType<T>): this;
}

type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;
declare class Chain<T extends EventType[]> implements EventType<EventTypeValue<Last<T>>> {
    private $events;
    private lastValue;
    constructor(...events: T);
    event(user: EventUserType<EventTypeValue<Last<T>>>): this;
    private handleEvent;
    private oneEventUser;
}

declare class ExecutorApplied<T> implements EventType<T> {
    private $base;
    private applier;
    constructor($base: EventType<T>, applier: (executor: EventUserType<T>) => EventUserType<T>);
    event(user: EventUserType<T>): this;
}

declare class Filtered<T> implements EventType<T> {
    private $base;
    private predicate;
    private defaultValue?;
    constructor($base: EventType<T>, predicate: ConstructorType<[T], boolean>, defaultValue?: T | undefined);
    event(user: EventUserType<T>): this;
    private parent;
}

declare class FromEvent<T> implements EventType<T>, DestroyableType {
    private $emitter;
    private $eventName;
    private $subscribeMethod;
    private $unsubscribeMethod?;
    private lastUser;
    private handler;
    constructor($emitter: EventType<any>, $eventName: EventType<string>, $subscribeMethod: EventType<string>, $unsubscribeMethod?: EventType<string> | undefined);
    event(user: EventUserType<T>): this;
    private parent;
    destroy(): this;
}

declare class FromPromise<T> implements EventType<T> {
    private p;
    private errorOwner?;
    constructor(p: Promise<T>, errorOwner?: EventUserType | undefined);
    event(user: EventUserType<T>): this;
}

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare class Late<T> implements SourceType<T> {
    private v?;
    private lateUser;
    private notify;
    constructor(v?: T | undefined);
    event(user: EventUserType<T>): this;
    use(value: T): this;
}

declare class LateShared<T> implements SourceType<T> {
    private $event;
    constructor(value?: T);
    event(user: EventUserType<T>): this;
    use(value: T): this;
}

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
declare class Map<T, TG> implements EventType<TG[]> {
    private $base;
    private $target;
    constructor($base: EventType<T[]>, $target: TransportType<any[], TG>);
    event(user: EventUserType<TG[]>): this;
    private parent;
}

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
declare class Once<T> implements EventType<T> {
    private $base;
    private isFilled;
    constructor($base: EventType<T>);
    event(user: EventUserType<T>): this;
    private parent;
}

declare class Primitive<T> {
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
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
declare class Sequence<T> implements EventType<T[]> {
    private $base;
    private result;
    constructor($base: EventType<T>);
    event(user: EventUserType<T[]>): this;
    private parent;
}

declare const isFilled: <T>(value?: T) => value is Exclude<T, null | undefined>;
declare function isEvent<T>(o: T): o is T & EventType;
declare function isDestroyable<T>(o: T): o is T & DestroyableType;
declare function isUser<T>(o: T): o is T & EventUserType;
declare function isTransport<T>(o: T): o is T & TransportType;

declare function ensureFunction(v: unknown, label: string): void;
declare function ensureEvent(v: unknown, label: string): void;
declare function ensureUser(v: unknown, label: string): void;

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
declare class OwnerPool<T> {
    private owners;
    private innerOwner;
    constructor();
    owner(): EventUserType<T>;
    size(): number;
    has(owner: EventUserType<T>): boolean;
    add(owner: EventUserType<T>): this;
    remove(g: EventUserType<T>): this;
    destroy(): this;
}

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
declare class Shared<T> implements SourceType<T> {
    private $base;
    private stateless;
    private ownersPool;
    private lastValue;
    private calls;
    private firstCall;
    constructor($base: EventType<T>, stateless?: boolean);
    event(user: EventUserType<T>): this;
    use(value: T): this;
    private firstCallUser;
    touched(): void;
    pool(): OwnerPool<T>;
    destroy(): OwnerPool<T>;
}

declare class SharedSource<T> implements SourceType<T> {
    private $base;
    private $sharedBase;
    constructor($base: SourceType<T>, stateless?: boolean);
    event(user: EventUserType<T>): this;
    use(value: T): this;
}

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
declare class Stream<T> implements EventType<T> {
    private $base;
    constructor($base: EventType<T[]>);
    event(user: EventUserType<T>): this;
    private parent;
}

declare class Transport<T> implements TransportType<any[], T> {
    private executor;
    constructor(executor: ConstructorType<any[], EventType<T>>);
    of(...args: any[]): EventType<T>;
}

declare class TransportApplied<T> implements TransportType {
    private baseTransport;
    private applier;
    constructor(baseTransport: TransportType<any[], T>, applier: ConstructorType<[EventType], EventType<T>>);
    of(...args: unknown[]): EventType<unknown>;
}

declare class TransportArgs implements TransportType {
    private baseTransport;
    private args;
    private startFromArgIndex;
    constructor(baseTransport: TransportType<any[], EventType>, args: unknown[], startFromArgIndex?: number);
    of(...runArgs: unknown[]): EventType<unknown>;
}

/**
 * Constructor what can be destroyed
 */
declare class TransportDestroyable<T> implements TransportType, DestroyableType {
    private baseTransport;
    private destructors;
    constructor(baseTransport: TransportType<any[], T>);
    of(...args: unknown[]): EventType<T>;
    destroy(): this;
}

declare class DestroyContainer implements DestroyableType {
    private destructors;
    add(e: DestroyableType): this;
    destroy(): this;
}

type EventExecutor<T> = (user: EventUserType<T>) => void | (() => void);
declare class Event<T> implements EventType<T>, DestroyableType {
    private eventExecutor;
    private mbDestructor;
    constructor(eventExecutor: EventExecutor<T>);
    event(user: EventUserType<T>): this;
    destroy(): this;
}

/**
 * Create local copy of source what can be destroyed
 */
declare class Local<T> implements EventType<T>, DestroyableType {
    private $base;
    private destroyed;
    constructor($base: EventType<T>);
    event(user: EventUserType<T>): this;
    private user;
    destroy(): this;
}

declare class Of<T> implements EventType<T> {
    private value;
    constructor(value: T);
    event(user: EventUserType<T>): this;
}

declare class User<T> implements EventUserType<T> {
    private userExecutor;
    constructor(userExecutor: (v: T) => void);
    use(value: T): this;
}
declare class ParentUser<T> implements EventUserType<T> {
    private userExecutor;
    private args;
    private childUser?;
    constructor(userExecutor: (v: T, user: EventUserType, ...args: any[]) => void, args?: any[], childUser?: EventUserType<T> | undefined);
    use(value: T): this;
    child(user: EventUserType, ...args: any[]): ParentUser<T>;
}

/**
 * Silent user
 */
declare class Void implements EventUserType {
    use(): this;
}

export { All, Any, Applied, Catch, Chain, type ConstructorType, DestroyContainer, type DestroyableType, Event, type EventType, type EventTypeValue, type EventUserType, ExecutorApplied, type ExtractTypesFromArrayS, Filtered, FromEvent, FromPromise, Late, LateShared, Local, Map, Of, Once, OwnerPool, ParentUser, Primitive, Sequence, Shared, SharedSource, type SourceType, Stream, Transport, TransportApplied, TransportArgs, TransportDestroyable, type TransportType, User, Void, ensureEvent, ensureFunction, ensureUser, isDestroyable, isEvent, isFilled, isTransport, isUser };
