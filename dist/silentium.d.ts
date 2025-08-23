/**
 * Representation of Destroyable object
 */
declare class Destroyable {
    private theDeps;
    constructor(...deps: unknown[]);
    destroy(): this;
    /**
     * Add dependency what can be destroyed
     */
    addDep(dep: unknown): this;
}

/**
 * Representation of destructor function as object
 */
declare class DestroyFunc extends Destroyable {
    private destructor;
    constructor(destructor: () => void);
    destroy(): this;
}

/**
 * Representation of Information Owner
 */
declare abstract class TheOwner<T = unknown> {
    abstract give(value: T): this;
}

/**
 * Owner from function
 */
declare class From<T = unknown> extends TheOwner<T> {
    private fn;
    constructor(fn: (value: T) => void);
    give(value: T): this;
}

/**
 * Representation of Information
 */
declare abstract class TheInformation<T = unknown> extends Destroyable {
    abstract value(o: TheOwner<T>): this;
}

/**
 * Ability to create information after some event
 */
declare class Lazy<T = unknown> extends Destroyable {
    protected buildFn?: ((...args: TheInformation[]) => TheInformation<T>) | undefined;
    constructor(buildFn?: ((...args: TheInformation[]) => TheInformation<T>) | undefined);
    get(...args: TheInformation[]): TheInformation<T>;
}

/**
 * Information from primitive value
 */
declare class Of<T> extends TheInformation<T> {
    private theValue;
    constructor(theValue: T);
    value(o: TheOwner<T>): this;
}

type DestructorFnType = () => void;
/**
 * Information of function
 */
declare class OfFunc<T> extends TheInformation<T> {
    private valueFn;
    private mbDestructor?;
    constructor(valueFn: (o: TheOwner<T>) => DestructorFnType | undefined | void);
    value(o: TheOwner<T>): this;
    destroy(): this;
}

type ExtractTypeS<T> = T extends TheInformation<infer U> ? U : never;
type ExtractTypesFromArrayS<T extends TheInformation<any>[]> = {
    [K in keyof T]: ExtractTypeS<T[K]>;
};
/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
declare class All<const T extends TheInformation[]> extends TheInformation<ExtractTypesFromArrayS<T>> {
    private keysKnown;
    private keysFilled;
    private infos;
    constructor(...theInfos: T);
    value(o: TheOwner<ExtractTypesFromArrayS<T>>): this;
    private isAllFilled;
}

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
declare class Any<T> extends TheInformation<T> {
    private infos;
    constructor(...theInfos: TheInformation<T>[]);
    value(o: TheOwner<T>): this;
}

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare class Applied<T, R> extends TheInformation<R> {
    private baseSrc;
    private applier;
    constructor(baseSrc: TheInformation<T>, applier: (v: T) => R);
    value(o: TheOwner<R>): this;
}

type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;
/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare class Chain<T extends TheInformation[]> extends TheInformation<Last<T>> {
    private theInfos;
    constructor(...infos: T);
    value(o: TheOwner<Last<T>>): this;
}

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare class ExecutorApplied<T> extends TheInformation<T> {
    private baseSrc;
    private applier;
    constructor(baseSrc: TheInformation<T>, applier: (executor: (v: T) => void) => (v: T) => void);
    value(o: TheOwner<T>): this;
}

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
declare class Filtered<T> extends TheInformation<T> {
    private baseSrc;
    private predicate;
    private defaultValue?;
    constructor(baseSrc: TheInformation<T>, predicate: (v: T) => boolean, defaultValue?: T | undefined);
    value(o: TheOwner<T>): this;
}

/**
 * When receiving a reference to a function expecting a callback, the component
 * creates its own callback, and the data received in this callback
 * will become the value of the information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-callback
 */
declare class FromCallback<T> extends TheInformation<T> {
    private waitForCb;
    private theArgs;
    constructor(waitForCb: (cb: (v: T) => any, ...args: unknown[]) => unknown, ...args: unknown[]);
    value(o: TheOwner<T>): this;
}

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
declare class FromEvent<T = unknown> extends TheInformation<T> {
    private emitterSrc;
    private eventNameSrc;
    private subscribeMethodSrc;
    private unsubscribeMethodSrc;
    constructor(emitterSrc: TheInformation<any>, eventNameSrc: TheInformation<string>, subscribeMethodSrc: TheInformation<string>, unsubscribeMethodSrc?: TheInformation<string>);
    value(o: TheOwner<T>): this;
}

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
declare class FromPromise<T> extends TheInformation<T> {
    private p;
    private errorOwner?;
    constructor(p: Promise<T>, errorOwner?: TheOwner | undefined);
    value(o: TheOwner<T>): this;
}

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare class Late<T> extends TheInformation<T> {
    private theValue?;
    private theOwner?;
    private lateOwner;
    constructor(theValue?: T | undefined);
    value(o: TheOwner<T>): this;
    owner(): From<T>;
    private notify;
}

/**
 * Lazy with applied function to its results
 */
declare class LazyApplied<T> extends Lazy<T> {
    private baseLazy;
    private applier;
    constructor(baseLazy: Lazy, applier: (i: TheInformation) => TheInformation<T>);
    get(...args: TheInformation[]): TheInformation<T>;
}

/**
 * Lazy instance from class constructor
 */
declare class LazyClass<T> extends Lazy<T> {
    constructor(constrFn: any);
}

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
declare class Map<T, TG> extends TheInformation<TG[]> {
    private baseSrc;
    private targetSrc;
    constructor(baseSrc: TheInformation<T[]>, targetSrc: Lazy<TG>);
    value(o: TheOwner<TG[]>): this;
}

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
declare class Once<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: TheInformation<T>);
    value(o: TheOwner<T>): this;
}

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
declare class Sequence<T> extends TheInformation<T[]> {
    private baseSrc;
    constructor(baseSrc: TheInformation<T>);
    value(o: TheOwner<T[]>): this;
}

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
    owner(): TheOwner<T>;
    size(): number;
    has(owner: TheOwner<T>): boolean;
    add(owner: TheOwner<T>): this;
    remove(g: TheOwner<T>): this;
    destroy(): this;
}

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
declare class Shared<T> extends TheInformation<T> {
    private baseSrc;
    private stateless;
    private lastValue;
    private ownersPool;
    constructor(baseSrc: TheInformation<T>, stateless?: boolean);
    value(o: TheOwner<T>): this;
    pool(): OwnerPool<T>;
}

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
declare class Stream<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: TheInformation<T[]>);
    value(o: TheOwner<T>): this;
}

export { All, Any, Applied, Chain, DestroyFunc, Destroyable, ExecutorApplied, type ExtractTypesFromArrayS, Filtered, From, FromCallback, FromEvent, FromPromise, Late, Lazy, LazyApplied, LazyClass, Map, Of, OfFunc, Once, OwnerPool, Sequence, Shared, Stream, TheInformation, TheOwner, isFilled };
