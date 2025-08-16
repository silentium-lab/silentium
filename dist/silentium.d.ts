/**
 * Main type what accepts data
 */
type OwnerType<T = unknown> = (v: T) => boolean | void;

/**
 * Main type what destroys information resources
 */
type DestructorType = () => void;
/**
 * Main type what represents information
 * Information related to one owner, if we
 * need to create shared information then we need
 * to do it explicitly. When owner comes to information
 * it executes information code.
 */
type InformationType<T = unknown> = (owner: OwnerType<T>) => DestructorType | void;

/**
 * Lazy accepts any number of arguments and returns information
 */
type LazyType<T> = (...args: any[]) => InformationType<T>;

type ExtractTypeS<T> = T extends InformationType<infer U> ? U : never;
type ExtractTypesFromArrayS<T extends InformationType<any>[]> = {
    [K in keyof T]: ExtractTypeS<T[K]>;
};
/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
declare const all: <const T extends InformationType[]>(...infos: T) => InformationType<ExtractTypesFromArrayS<T>>;

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
declare const any: <T>(...infos: InformationType<T>[]) => InformationType<T>;

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const applied: <T, R>(base: InformationType<T>, applier: (v: T) => R) => InformationType<R>;

type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;
/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const chain: <T extends InformationType[]>(...infos: T) => Last<T>;

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const executorApplied: <T>(base: InformationType<T>, applier: (executor: OwnerType<T>) => OwnerType<T>) => InformationType<T>;

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
declare const filtered: <T>(base: InformationType<T>, predicate: (v: T) => boolean, defaultValue?: T) => InformationType<T>;

/**
 * When receiving a reference to a function expecting a callback, the component
 * creates its own callback, and the data received in this callback
 * will become the value of the information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-callback
 */
declare const fromCallback: <T>(waitForCb: (cb: (v: T) => any, ...args: unknown[]) => unknown, ...args: unknown[]) => InformationType<T>;

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
declare const fromEvent: (emitter: any, eventName: string, subscribeMethod: string, unsubscribeMethod?: string) => InformationType;

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
declare const fromPromise: <T>(p: Promise<T>) => [InformationType<T>, InformationType];

declare const i: <T>(v: T) => InformationType<T>;

/**
 * Helps to chain lazy info after
 * another lazy info
 */
declare const lazyChain: <T>(lazy: LazyType<T>, chainSrc: InformationType<T>) => LazyType<T>;

declare const lazyClass: (constrFn: any) => (...args: any[]) => (o: OwnerType<any>) => void;

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
declare const map: <T, TG>(base: InformationType<T[]>, targetI: LazyType<TG>) => InformationType<TG[]>;

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare const of: <T>(sharedValue?: T) => readonly [InformationType<T>, (v: T) => void];

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
declare const once: <T>(base: InformationType<T>) => InformationType<T>;

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
declare const sequence: <T>(base: InformationType<T>) => InformationType<T[]>;

declare const isFilled: <T>(value?: T) => value is T;

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
declare class OwnerPool<T> {
    private owners;
    private innerOwner;
    constructor();
    owner(): OwnerType<T>;
    size(): number;
    has(owner: OwnerType<T>): boolean;
    add(shouldBePatron: OwnerType<T>): this;
    remove(g: OwnerType<T>): this;
    destroy(): this;
}

/**
 * Helps to run callback only once
 * when information was executed at first time
 */
declare const onExecuted: (fn: (...args: any[]) => void) => (...args: unknown[]) => void;

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
declare const shared: <T>(base: InformationType<T>) => readonly [(g: OwnerType<T>) => () => void, () => void, OwnerPool<T>];
declare const sharedStateless: <T>(base: InformationType<T>) => readonly [(g: OwnerType<T>) => () => void, () => void, OwnerPool<T>];

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
declare const stream: <T>(base: InformationType<T[]>) => InformationType<T>;

export { type DestructorType, type ExtractTypesFromArrayS, type InformationType, type LazyType, OwnerPool, type OwnerType, all, any, applied, chain, executorApplied, filtered, fromCallback, fromEvent, fromPromise, i, isFilled, lazyChain, lazyClass, map, of, onExecuted, once, sequence, shared, sharedStateless, stream };
