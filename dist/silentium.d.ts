import { DestroyableType as DestroyableType$1 } from 'src/Source/SourceDestroyable';

type SourceExecutorType<T, R = unknown> = (guest: GuestType<T>) => R;
interface SourceObjectType<T> {
    value: SourceExecutorType<T>;
}
type SourceDataType<T> = Extract<T, string | number | boolean | Date | object | Array<unknown> | symbol>;
type SourceType<T = any> = SourceExecutorType<T> | SourceObjectType<T> | SourceDataType<T>;
/**
 * Helps to connect source and guest, if you need to get value in guest from source
 * helpful because we don't know what shape of source do we have, it can be function or object or primitive
 * @url https://silentium-lab.github.io/silentium/#/utils/value
 */
declare const value: <T>(source: SourceType<T>, guest: GuestType<T>) => SourceType<T>;
/**
 * Helps to check what some information is of source shape
 * @url https://silentium-lab.github.io/silentium/#/utils/is-source
 */
declare const isSource: <T>(mbSource: T | SourceType<T>) => mbSource is SourceType<T>;
/**
 * Represents source as function
 * @url https://silentium-lab.github.io/silentium/#/source
 */
declare const source: <T>(source: SourceType<T>) => SourceExecutorType<T>;

type GuestIntroduction = "guest" | "patron";
type GuestExecutorType<T = any, This = void> = (value: T) => This;
interface GuestObjectType<T = any> {
    give(value: T): this;
    introduction?(): GuestIntroduction;
}
type GuestType<T = any> = GuestExecutorType<T> | GuestObjectType<T>;
/**
 * Helps to give data to guest, guests can be of different shapes
 * function guest or object guest
 * @url https://silentium-lab.github.io/silentium/#/utils/give
 */
declare const give: <T>(data: T, guest?: GuestType<T>) => GuestType<T> | SourceExecutorType<T>;
/**
 * Helps to check if mbGuest can be used to retrieve value
 * @url https://silentium-lab.github.io/silentium/#/utils/is-guest
 */
declare const isGuest: (mbGuest: any) => mbGuest is GuestType;
/**
 * Helps to create guest of object type
 * @url https://silentium-lab.github.io/silentium/#/guest
 */
declare const guest: <T>(receiver: GuestExecutorType<T>) => {
    give(value: T): any;
};

interface GuestDisposableType<T = any> extends GuestObjectType<T> {
    disposed(value: T | null): boolean;
}
type MaybeDisposableType<T = any> = Partial<GuestDisposableType<T>>;
/**
 * Connects to guest logic what can tell PatronPool
 * what guest don't need to receive new values
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-disposable
 */
declare const guestDisposable: <T>(guest: GuestType, disposeCheck: (value: T | null) => boolean) => GuestDisposableType<T>;

/**
 * Helps to inherit guest behavior, its introduction and dispose settings
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-cast
 */
declare const guestCast: <T>(sourceGuest: GuestType<any>, targetGuest: GuestType<T>) => GuestDisposableType<T>;

interface GuestValueType<T = any> extends GuestObjectType<T> {
    value(): T;
}
/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-sync
 */
declare const guestSync: <T>(theValue?: T) => GuestValueType<T>;

/**
 * Helps to apply function to value before baseGuest will receive it
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-applied
 */
declare const guestApplied: <T, R>(baseGuest: GuestType<R>, applier: (value: T) => R) => GuestObjectType<T>;

/**
 * Apply function to guest function of receiving value, useful for debouncing or throttling
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-executor-applied
 */
declare const guestExecutorApplied: <T>(baseGuest: GuestType<T>, applier: (executor: GuestExecutorType<T>) => GuestExecutorType<T>) => GuestObjectType<T>;

type PatronType<T> = GuestDisposableType<T> & {
    introduction(): "patron";
};
/**
 * Helps to check what incoming object is patron
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron
 */
declare const isPatron: (guest: GuestType) => guest is PatronType<unknown>;
declare const introduction: () => "patron";
/**
 * Help to turn existed guest intro patron
 * @url https://silentium-lab.github.io/silentium/#/patron
 */
declare const patron: <T>(willBePatron: GuestType<T>) => GuestDisposableType<T>;

/**
 * Helps to call patron only once, this will be helpful when you
 * need value but you know what value can not be existed at a time of requesting
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-once
 */
declare const patronOnce: <T>(baseGuest: GuestType<T>) => GuestDisposableType<T>;

type DestructorType = () => void;
interface DestroyableType {
    destroy: DestructorType;
}
/**
 * Ability to create sources that support special destruction logic
 * @url https://silentium-lab.github.io/silentium/#/source/source-destroyable
 */
declare const sourceDestroyable: <T>(source: SourceExecutorType<T, DestructorType>) => SourceObjectType<T> & DestroyableType;

/**
 * Helps debug the application and detect issues with frozen pools
 * @url https://silentium-lab.github.io/silentium/#/utils/patron-pools-statistic
 */
declare const patronPoolsStatistic: SourceExecutorType<{
    poolsCount: number;
    patronsCount: number;
}, unknown>;
/**
 * Helps to connect source and subsource, needed to destroy all sub sources
 * when base source will be destroyed
 * @url https://silentium-lab.github.io/silentium/#/utils/sub-source
 */
declare const subSource: <T>(subSource: SourceType, source: SourceType<T>) => SourceType<T>;
/**
 * Helps to define many sources of one sub source
 */
declare const subSourceMany: <T>(subSourceSrc: SourceType<T>, sourcesSrc: SourceType[]) => SourceType<T>;
/**
 * Helps to check what given source is destroyable
 * @url https://silentium-lab.github.io/silentium/#/utils/is-destroyable
 */
declare const isDestroyable: (s: unknown) => s is DestroyableType;
/**
 * Helps to remove all pools of related initiators
 * @url https://silentium-lab.github.io/silentium/#/utils/destroy
 */
declare const destroy: (...initiators: SourceType[]) => void;
/**
 * Returns all pools related to one patron
 * @url https://silentium-lab.github.io/silentium/#/utils/patron-pools
 */
declare const patronPools: (patron: GuestObjectType) => PoolType<any>[];
/**
 * Removes patron from all existed pools
 * @url https://silentium-lab.github.io/silentium/#/utils/remove-patron-from-pools
 */
declare const removePatronFromPools: (patron: GuestObjectType) => void;
/**
 * Checks what patron is connected with any pool
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron-in-pools
 */
declare const isPatronInPools: (patron: GuestObjectType) => boolean;
interface PoolType<T = any> extends GuestObjectType<T> {
    add(guest: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    size(): number;
    destroy(): void;
}
/**
 * Pool class helps to implement dispatching for patron about new values
 * what may appear in sources
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-pool
 */
declare class PatronPool<T> implements PoolType<T> {
    private initiator;
    private patrons;
    give: (value: T) => this;
    constructor(initiator: SourceType);
    size(): number;
    add(shouldBePatron: GuestType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestType<T>): this;
    destroy(): this;
    private sendValueToGuest;
    private guestDisposed;
}

/**
 * Helps to apply function to patron
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-applied
 */
declare const patronApplied: <T, R>(baseGuest: GuestType<R>, applier: (value: T) => R) => GuestObjectType<T>;

/**
 * Helps to apply function to patrons executor
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-executor-applied
 */
declare const patronExecutorApplied: <T>(baseGuest: GuestType<T>, applier: (executor: GuestExecutorType) => GuestExecutorType) => {
    give(value: T): any;
    introduction: () => "patron";
};

type ExtractType<T> = T extends SourceType<infer U> ? U : never;
type ExtractTypesFromArray<T extends SourceType<any>[]> = {
    [K in keyof T]: ExtractType<T[K]>;
};
/**
 * Represents common value as Array of bunch of sources,
 * when all sources will gets it's values
 * @url https://silentium-lab.github.io/silentium/#/source/source-all
 */
declare const sourceAll: <const T extends SourceType[]>(sources: T) => SourceObjectType<ExtractTypesFromArray<T>> & DestroyableType$1;

interface LazyType<T> {
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}
/**
 * Helps to get lazy instance of dependency
 * @url https://silentium-lab.github.io/silentium/#/utils/lazy
 */
declare const lazy: <T>(buildingFn: (...args: any[]) => T) => LazyType<T>;

/**
 * Ability to apply source to source of array values sequentially
 * @url https://silentium-lab.github.io/silentium/#/source/source-sequence
 */
declare const sourceSequence: <T, TG>(baseSource: SourceType<T[]>, targetSource: LazyType<SourceType<TG>>) => (guest: GuestType<TG[]>) => void;

/**
 * Helps to modify many sources with one private source
 * @url https://silentium-lab.github.io/silentium/#/source/source-map
 */
declare const sourceMap: <T, TG>(baseSource: SourceType<T[]>, targetSource: LazyType<SourceType<TG>>) => SourceExecutorType<TG[], unknown>;

/**
 * Connects guest with source what give response faster than others
 * @url https://silentium-lab.github.io/silentium/#/source/source-race
 */
declare const sourceRace: <T>(sources: SourceType<T>[]) => (guest: GuestType<T>) => void;

type SourceChangeableType<T = any> = SourceObjectType<T> & GuestObjectType<T>;
/**
 * Ability to create source what can be changed later
 * @url https://silentium-lab.github.io/silentium/#/source/source-of
 */
declare const sourceOf: <T>(source?: SourceType<T>) => SourceChangeableType<T>;
/**
 * Changeable source what can be changed only once with specified value
 * @url https://silentium-lab.github.io/silentium/#/source/source-memo-of
 */
declare const sourceMemoOf: <T>(source?: SourceType<T>) => SourceChangeableType<T>;

type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;
/**
 * Returns value of some source when all sources before it gives their response
 * @url https://silentium-lab.github.io/silentium/#/source/source-chain
 */
declare const sourceChain: <T extends SourceType[]>(...sources: T) => SourceType<Last<T>>;

/**
 * Ability to build common changeable source from different guest and source
 * @url https://silentium-lab.github.io/silentium/#/source/source-dynamic
 */
declare const sourceDynamic: <T>(baseGuest: GuestType<T>, baseSource: SourceType<T>) => SourceChangeableType<T>;

/**
 * Gives ability to apply function to source value
 * @url https://silentium-lab.github.io/silentium/#/source/source-applied
 */
declare const sourceApplied: <T, R>(baseSource: SourceType<T>, applier: (v: T) => R) => (guest: GuestType<R>) => void;

/**
 * Ability to apply function to source executor, helpful when need to apply throttling or debounce
 * @url https://silentium-lab.github.io/silentium/#/source/source-executor-applied
 */
declare const sourceExecutorApplied: <T>(source: SourceType<T>, applier: (executor: SourceExecutorType<T>) => SourceExecutorType<T>) => SourceExecutorType<T>;

/**
 * Helps not to respond with information what checked by predicate function
 * @url https://silentium-lab.github.io/silentium/#/source/source-filtered
 */
declare const sourceFiltered: <T>(baseSource: SourceType<T>, predicate: (v: T) => boolean, defaultValue?: T) => (g: GuestType<T>) => void;

/**
 * Ability set the value only once
 * @url https://silentium-lab.github.io/silentium/#/source/source-once
 */
declare const sourceOnce: <T>(initialValue?: SourceType<T>) => {
    value(guest: GuestType<T>): any;
    give(value: T): any;
};

/**
 * Helps to represent source value as sync value, what can be returned
 * useful for example in tests
 * @url https://silentium-lab.github.io/silentium/#/source/source-sync
 */
declare const sourceSync: <T>(baseSource: SourceType<T>, defaultValue?: unknown) => SourceObjectType<T> & {
    syncValue(): T;
};

/**
 * Simplifies sources combination, when we need to create value depending on many sources
 * @url https://silentium-lab.github.io/silentium/#/source/source-combined
 */
declare const sourceCombined: <const T extends SourceType[]>(...sources: T) => <R>(source: (guest: GuestType<R>, ...sourcesValues: ExtractTypesFromArray<T>) => void) => SourceType<R>;

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-resettable
 */
declare const sourceResettable: <T>(baseSrc: SourceType<T>, resettableSrc: SourceType<unknown>) => SourceChangeableType<T>;

/**
 * Present source of value what was last appeared in any
 * of given sources, can be used as default value, when some source
 * don't respond
 * @url https://silentium-lab.github.io/silentium/#/source/source-any
 */
declare const sourceAny: <T>(sources: SourceType<T>[]) => SourceChangeableType<T>;

/**
 * Helps to build source only when all sources will give its values
 * @url https://silentium-lab.github.io/silentium/#/source/source-lazy
 */
declare const sourceLazy: <T>(lazySrc: LazyType<SourceType<T>>, args: SourceType[], resetSrc?: SourceType<unknown>) => SourceChangeableType<T>;

interface Prototyped<T> {
    prototype: T;
}
declare const lazyClass: <T>(constructorFn: Prototyped<T>, modules?: Record<string, unknown>) => LazyType<T>;

export { type DestroyableType, type DestructorType, type ExtractTypesFromArray, type GuestDisposableType, type GuestExecutorType, type GuestObjectType, type GuestType, type GuestValueType, type LazyType, type MaybeDisposableType, PatronPool, type PatronType, type PoolType, type SourceChangeableType, type SourceDataType, type SourceExecutorType, type SourceObjectType, type SourceType, destroy, give, guest, guestApplied, guestCast, guestDisposable, guestExecutorApplied, guestSync, introduction, isDestroyable, isGuest, isPatron, isPatronInPools, isSource, lazy, lazyClass, patron, patronApplied, patronExecutorApplied, patronOnce, patronPools, patronPoolsStatistic, removePatronFromPools, source, sourceAll, sourceAny, sourceApplied, sourceChain, sourceCombined, sourceDestroyable, sourceDynamic, sourceExecutorApplied, sourceFiltered, sourceLazy, sourceMap, sourceMemoOf, sourceOf, sourceOnce, sourceRace, sourceResettable, sourceSequence, sourceSync, subSource, subSourceMany, value };
