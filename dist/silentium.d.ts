type EventUserType<T = unknown> = (value: T) => void;

type DestructorType = () => void;
type EventType<T = unknown> = (user: EventUserType<T>) => DestructorType | void;
type ExcludeVoidFromReturnType<F extends (...args: any[]) => any> = F extends (...args: infer Args) => infer Return ? (...args: Args) => Exclude<Return, void> : never;
type EventTypeDestroyable<T = unknown> = ExcludeVoidFromReturnType<EventType<T>>;
interface DestroyableType {
    destroy: DestructorType;
}
type EventTypeValue<T> = T extends EventType<infer U> ? U : never;

interface EventObjectType<T = unknown> {
    event: EventType<T>;
}

interface EventUserObjectType<T = unknown> {
    use: EventUserType<T>;
}

type SourceType<T = unknown> = EventObjectType<T> & EventUserObjectType<T>;

/**
 * A function type that takes a value as an argument
 * and returns a specific value
 */
type ConstructorType<P extends unknown[] = unknown[], T = unknown> = (...args: P) => T;

type ExtractTypeS<T> = T extends EventType<infer U> ? U : never;
type ExtractTypesFromArrayS<T extends EventType<any>[]> = {
    [K in keyof T]: ExtractTypeS<T[K]>;
};
/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
declare function All<const T extends EventType[]>(...theInfos: T): EventType<ExtractTypesFromArrayS<T>>;

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
declare function Any<T>(...infos: EventType<T>[]): EventType<T>;

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare function Applied<T, R>(baseEv: EventType<T>, applier: ConstructorType<[T], R>): EventType<R>;

type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;
/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare function Chain<T extends EventType[]>(...infos: T): Last<T>;

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare function ExecutorApplied<T>(baseEv: EventType<T>, applier: (executor: EventUserType<T>) => EventUserType<T>): EventType<T>;

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
declare function Filtered<T>(baseEv: EventType<T>, predicate: ConstructorType<[T], boolean>, defaultValue?: T): EventType<T>;

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
declare function FromEvent<T>(emitterEv: EventType<any>, eventNameEv: EventType<string>, subscribeMethodEv: EventType<string>, unsubscribeMethodEv?: EventType<string>): EventTypeDestroyable<T>;

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
declare function FromPromise<T>(p: Promise<T>, errorOwner?: EventUserType): EventType<T>;

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare function Late<T>(v?: T): SourceType<T>;

declare function LateShared<T>(value?: T): SourceType<T>;

/**
 * Constructor with applied function to its results
 */
declare function ConstructorApplied<T>(baseConstructor: ConstructorType<any[], EventType>, applier: (i: EventType) => EventType<T>): ConstructorType<EventType[], EventType<T>>;

declare function ConstructorArgs(baseConstructor: ConstructorType<any[], EventType>, args: unknown[], startFromArgIndex?: number): (...runArgs: any[]) => EventType;

/**
 * Constructor what can be destroyed
 */
declare function ConstructorDestroyable(baseConstructor: ConstructorType<any[], (DestroyableType & EventObjectType) | EventType>): {
    get: ConstructorType<any[], EventType>;
    destroy: DestructorType;
};

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
declare function Map<T, TG>(baseEv: EventType<T[]>, targetEv: ConstructorType<any[], EventType<TG>>): EventType<TG[]>;

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
declare function Once<T>(baseEv: EventType<T>): EventType<T>;

declare function Primitive<T>(baseEv: EventType<T>, theValue?: T | null): {
    [Symbol.toPrimitive](): T | null;
    primitive(): T | null;
    primitiveWithException(): T & ({} | undefined);
};

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
declare function Sequence<T>(baseEv: EventType<T>): EventType<T[]>;

declare const isFilled: <T>(value?: T) => value is Exclude<T, null | undefined>;

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
declare function Shared<T>(baseEv: EventType<T>, stateless?: boolean): SourceType<T> & {
    pool: () => OwnerPool<T>;
    touched: () => void;
} & DestroyableType;

declare function SharedSource<T>(baseEv: SourceType<T>, stateless?: boolean): SourceType<T>;

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
declare function Stream<T>(baseEv: EventType<T[]>): EventType<T>;

declare function Destructor<T>(baseEv: EventType<T>, destructorUser?: EventUserType<DestructorType>): {
    event: EventType<T>;
    destroy: () => void;
};

/**
 * Create local copy of source what can be destroyed
 */
declare function Local<T>(baseEv: EventType<T>): EventType<T>;

declare function Of<T>(value: T): EventType<T>;

/**
 * Run data with user
 */
declare function On<T>(event: EventType<T>, user: EventUserType<T>): void | DestructorType;

/**
 * Silent user
 */
declare function Void(): EventUserType;

declare function DestroyContainer(): {
    add(e: EventType): EventType<unknown>;
    destroy(): void;
};

export { All, Any, Applied, Chain, ConstructorApplied, ConstructorArgs, ConstructorDestroyable, type ConstructorType, DestroyContainer, type DestroyableType, Destructor, type DestructorType, type EventObjectType, type EventType, type EventTypeDestroyable, type EventTypeValue, type EventUserObjectType, type EventUserType, ExecutorApplied, type ExtractTypesFromArrayS, Filtered, FromEvent, FromPromise, Late, LateShared, Local, Map, Of, On, Once, OwnerPool, Primitive, Sequence, Shared, SharedSource, type SourceType, Stream, Void, isFilled };
