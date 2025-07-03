type ownerIntroduction = "owner" | "patron";
type OwnerExecutorType<T = any, This = void> = (value: T) => This;
interface OwnerObjectType<T = any> {
    give(value: T): this;
    introduction?(): ownerIntroduction;
}
type OwnerType<T = any> = OwnerExecutorType<T> | OwnerObjectType<T>;

/**
 * Information owner, if information
 * has owner than information executed
 * https://silentium-lab.github.io/silentium/#/en/owner
 */
declare class Owner<T = any> {
    private ownerFn;
    private errorFn?;
    private disposedFn?;
    constructor(ownerFn: OwnerExecutorType<T>, errorFn?: ((cause: unknown) => void) | undefined, disposedFn?: (() => boolean) | undefined);
    give(value: T): this;
    error(cause: unknown): this;
    disposed(): boolean;
}
declare const O: <T>(ownerFn: OwnerExecutorType<T>) => Owner<T>;

type InformationExecutorType<T, R = unknown> = (owner: OwnerType<T>) => R;
interface InformationObjectType<T> {
    value: InformationExecutorType<T>;
}
type InformationDataType<T> = Extract<T, string | number | boolean | Date | object | Array<unknown> | symbol>;
type InformationType<T = any> = InformationExecutorType<T> | InformationObjectType<T> | InformationDataType<T>;

type InfoExecutorType<T> = (g: Owner<T>) => (() => void | undefined) | void;
type InfoObjectType<T> = {
    value: InfoExecutorType<T>;
};
type InformationExecutedCb<T> = (g: Owner<T>) => void;
/**
 * Main information representation
 * https://silentium-lab.github.io/silentium/#/en/information
 */
declare class Information<T = any> {
    private info?;
    private theName;
    private onlyOneOwner;
    private static instances;
    private theSubInfos;
    private destructor?;
    private owner?;
    private executedCbs?;
    private alreadyExecuted;
    constructor(info?: (InfoObjectType<T> | InfoExecutorType<T> | InformationDataType<T>) | undefined, theName?: string, onlyOneOwner?: boolean);
    /**
     * Следующее значение источника
     */
    private next;
    /**
     * Возможность гостю получить информацию от источника
     */
    value(owner: Owner<T>): this;
    /**
     * Ability to destroy the information info
     */
    destroy(): this;
    /**
     * The ability to link another info to the current info
     */
    subInfo(info: Information<any>): this;
    subInfos(): Information<unknown>[];
    name(): string;
    executed(cb: InformationExecutedCb<T>): this;
    hasOwner(): boolean;
}
declare const I: <T>(info?: InfoObjectType<T> | InfoExecutorType<T> | InformationDataType<T>, theName?: string, onlyOneOwner?: boolean) => Information<T>;

type ExtractType<T> = T extends InformationType<infer U> ? U : never;
type ExtractTypeS<T> = T extends Information<infer U> ? U : never;
type ExtractTypesFromArray<T extends InformationType<any>[]> = {
    [K in keyof T]: ExtractType<T[K]>;
};
type ExtractTypesFromArrayS<T extends Information<any>[]> = {
    [K in keyof T]: ExtractTypeS<T[K]>;
};
/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
declare const all: <const T extends Information[]>(...infos: T) => Information<ExtractTypesFromArrayS<T>>;

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
declare const any: <T>(...infos: Information<T>[]) => Information<unknown>;

type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;
/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const chain: <T extends Information[]>(...infos: T) => Information<Last<T>>;

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const executorApplied: <T>(base: Information<T>, applier: (executor: Owner<T>) => Owner<T>) => Information<T>;

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const applied: <T, R>(base: Information<T>, applier: (v: T) => R) => Information<unknown>;

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
declare const filtered: <T>(base: Information<T>, predicate: (v: T) => boolean, defaultValue?: T) => Information<T>;

interface LazyType<T> {
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

/**
 * Helps in the process of executing information to create
 * a new information object and also destroy it if
 * destruction information is received
 * https://silentium-lab.github.io/silentium/#/en/information/lazy
 */
declare const lazyS: <T>(lazyI: LazyType<Information<T>>, destroyI?: Information<unknown>) => Information<T>;

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
declare const map: <T, TG>(base: Information<T[]>, targetI: LazyType<Information<TG>>) => Information<TG[]>;

/**
 * Owner to which a function is applied that modifies the incoming
 * value it receives
 * https://silentium-lab.github.io/silentium/#/en/owner/applied
 */
declare const ownerApplied: <T, R>(base: Owner<R>, applier: (value: T) => R) => Owner<T>;

/**
 * Owner to which the function is applied that
 * controls the conditions for passing the value
 * https://silentium-lab.github.io/silentium/#/en/owner/executor-applied
 */
declare const ownerExecutorApplied: <T>(base: Owner<T>, applier: (ge: (v: T) => void) => (v: T) => void) => Owner<T>;

interface InfoSync<T> {
    syncValue(): T;
    filled(): boolean;
}
/**
 * Owner that can return a synchronous value
 * from the information passed to it. If there is no value and no
 * defaultValue, an error will occur
 * https://silentium-lab.github.io/silentium/#/en/owner/sync
 */
declare const ownerSync: <T>(base: Information<T>, defaultValue?: T) => InfoSync<T>;

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare const of: <T>(incomeI?: InformationDataType<T>) => readonly [Information<T>, Owner<T>];

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
declare const once: <T>(base: Information<T>) => Information<T>;

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
declare class OwnerPool<T> {
    private owners;
    private innerOwner;
    constructor();
    owner(): Owner<T>;
    size(): number;
    has(owner: Owner<T>): boolean;
    add(shouldBePatron: Owner<T>): this;
    remove(g: Owner<T>): this;
    destroy(): this;
}

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
declare const pool: <T>(base: Information<T>) => readonly [Information<T>, OwnerPool<T>];
declare const poolStateless: <T>(base: Information<T>) => readonly [Information<T>, OwnerPool<T>];

/**
 * A component that takes one value at a time and returns an array
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
declare const sequence: <T>(base: Information<T>) => Information<T[]>;

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
declare const stream: <T>(base: Information<T[]>) => Information<T>;

/**
 * When receiving a reference to a function expecting a callback, the component
 * creates its own callback, and the data received in this callback
 * will become the value of the information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-callback
 */
declare const fromCallback: <T>(waitForCb: (cb: (v: T) => any) => unknown) => Information<unknown>;

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
declare const fromEvent: <T extends []>(emitter: any, eventName: string, subscribeMethod: string, unsubscribeMethod?: string) => Information<unknown>;

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
declare const fromPromise: <T>(p: Promise<T>) => Information<T>;

/**
 * Helps to get lazy instance of dependency
 * @url https://silentium-lab.github.io/silentium/#/utils/lazy
 */
declare const lazy: <T>(buildingFn: (...args: any[]) => T) => LazyType<T>;

interface Prototyped<T> {
    prototype: T;
}
/**
 * Helps create an object from a class
 * https://silentium-lab.github.io/silentium/#/en/utils/lazy-class
 */
declare const lazyClass: <T>(constructorFn: Prototyped<T>, modules?: Record<string, unknown>) => LazyType<T>;

export { type ExtractTypesFromArray, type ExtractTypesFromArrayS, I, type InfoSync, Information, type InformationDataType, type InformationExecutorType, type InformationObjectType, type InformationType, type LazyType, O, Owner, type OwnerExecutorType, type OwnerObjectType, OwnerPool, type OwnerType, all, any, applied, chain, executorApplied, filtered, fromCallback, fromEvent, fromPromise, lazy, lazyClass, lazyS, map, of, once, ownerApplied, ownerExecutorApplied, ownerSync, pool, poolStateless, sequence, stream };
