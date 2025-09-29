import { DataTypeDestroyable } from 'src/types/DataType';

type DataUserType<T = unknown> = (value: T) => void;

type DestructorType = () => void;
type DataType<T = unknown> = (user: DataUserType<T>) => DestructorType | void;
interface DestroyableType {
    destroy: DestructorType;
}

interface DataObjectType<T = unknown> {
    value: DataType<T>;
}

interface DataUserObjectType<T = unknown> {
    give: DataUserType<T>;
}

type SourceType<T = unknown> = DataObjectType<T> & DataUserObjectType<T>;

/**
 * A function type that takes a value as an argument
 * and returns a specific value
 */
type ValueType<P extends unknown[] = unknown[], T = unknown> = (...args: P) => T;

type ExtractTypeS<T> = T extends DataType<infer U> ? U : never;
type ExtractTypesFromArrayS<T extends DataType<any>[]> = {
    [K in keyof T]: ExtractTypeS<T[K]>;
};
/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
declare const all: <const T extends DataType[]>(...theInfos: T) => DataType<ExtractTypesFromArrayS<T>>;

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
declare const any: <T>(...infos: DataType<T>[]) => DataType<T>;

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const applied: <T, R>(baseSrc: DataType<T>, applier: ValueType<[T], R>) => DataType<R>;

type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;
/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const chain: <T extends DataType[]>(...infos: T) => Last<T>;

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
declare const executorApplied: <T>(baseSrc: DataType<T>, applier: (executor: DataUserType<T>) => DataUserType<T>) => DataType<T>;

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
declare const filtered: <T>(baseSrc: DataType<T>, predicate: ValueType<[T], boolean>, defaultValue?: T) => DataType<T>;

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
declare const fromEvent: <T>(emitterSrc: DataType<any>, eventNameSrc: DataType<string>, subscribeMethodSrc: DataType<string>, unsubscribeMethodSrc?: DataType<string>) => DataTypeDestroyable<T>;

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
declare const fromPromise: <T>(p: Promise<T>, errorOwner?: DataUserType) => DataType<T>;

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare const late: <T>(v?: T) => SourceType<T>;

declare const lateShared: <T>(theValue?: T) => SourceType<T>;

/**
 * Lazy with applied function to its results
 */
declare const lazyApplied: <T>(baseLazy: ValueType<any[], DataType>, applier: (i: DataType) => DataType<T>) => ValueType<DataType[], DataType<T>>;

declare const lazyArgs: (baseLazy: ValueType<any[], DataType>, args: unknown[], startFromArgIndex?: number) => (...runArgs: any[]) => DataType;

/**
 * Lazy what can be destroyed
 */
declare const lazyDestroyable: (baseLazy: ValueType<any[], DestroyableType>) => {
    get: ValueType<any[], DestroyableType>;
    destroy: DestructorType;
};

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
declare const map: <T, TG>(baseSrc: DataType<T[]>, targetSrc: ValueType<any[], DataType<TG>>) => DataType<TG[]>;

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
declare const once: <T>(baseSrc: DataType<T>) => DataType<T>;

declare const primitive: <T>(baseSrc: DataType<T>, theValue?: T | null) => {
    [Symbol.toPrimitive](): T | null;
    primitive(): T | null;
};

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
declare const sequence: <T>(baseSrc: DataType<T>) => DataType<T[]>;

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
    owner(): DataUserType<T>;
    size(): number;
    has(owner: DataUserType<T>): boolean;
    add(owner: DataUserType<T>): this;
    remove(g: DataUserType<T>): this;
    destroy(): this;
}

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
declare const shared: <T>(baseSrc: DataType<T>, stateless?: boolean) => SourceType<T> & {
    pool: () => OwnerPool<T>;
} & DestroyableType;

declare const sharedSource: <T>(baseSrc: SourceType<T>, stateless?: boolean) => SourceType<T>;

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
declare const stream: <T>(baseSrc: DataType<T[]>) => DataType<T>;

declare const of: <T>(v: T) => DataType<T>;

/**
 * Run data with user
 */
declare const on: <T>(src: DataType<T>, user: DataUserType<T>) => void | DestructorType;

/**
 * Silent user
 */
declare const _void: () => DataUserType;

export { type DataObjectType, type DataType, type DataUserObjectType, type DataUserType, type DestroyableType, type DestructorType, type ExtractTypesFromArrayS, OwnerPool, type SourceType, type ValueType, _void, all, any, applied, chain, executorApplied, filtered, fromEvent, fromPromise, isFilled, late, lateShared, lazyApplied, lazyArgs, lazyDestroyable, map, of, on, once, primitive, sequence, shared, sharedSource, stream };
