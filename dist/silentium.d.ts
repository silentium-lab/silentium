type GuestIntroduction = "guest" | "patron";
type GuestExecutorType<T = any, This = void> = (value: T) => This;
interface GuestObjectType<T = any> {
    give(value: T): this;
    introduction?(): GuestIntroduction;
}
type GuestType<T = any> = GuestExecutorType<T> | GuestObjectType<T>;
/**
 * @url https://silentium-lab.github.io/silentium/#/utils/give
 */
declare function give<T>(data: T, guest: GuestType<T>): GuestType<T>;
/**
 * @url https://silentium-lab.github.io/silentium/#/utils/is-guest
 */
declare function isGuest(mbGuest: any): mbGuest is GuestType;
/**
 * @url https://silentium-lab.github.io/silentium/#/guest
 */
declare class Guest<T> implements GuestObjectType<T> {
    private receiver;
    constructor(receiver: GuestExecutorType<T>);
    give(value: T): this;
}

interface GuestDisposableType<T = any> extends GuestObjectType<T> {
    disposed(value: T | null): boolean;
}
type MaybeDisposableType<T = any> = Partial<GuestDisposableType<T>>;
/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-disposable
 */
declare class GuestDisposable<T> implements GuestDisposableType<T> {
    private guest;
    private disposeCheck;
    constructor(guest: GuestType, disposeCheck: (value: T | null) => boolean);
    disposed(value: T | null): boolean;
    give(value: T): this;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-cast
 */
declare class GuestCast<T> implements GuestDisposableType<T> {
    private sourceGuest;
    private targetGuest;
    constructor(sourceGuest: GuestType<any>, targetGuest: GuestType<T>);
    introduction(): "guest" | "patron";
    give(value: T): this;
    disposed(value: T | null): boolean;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/utils/patron-pools
 */
declare const patronPools: (patron: GuestObjectType) => PoolType<any>[];
/**
 * @url https://silentium-lab.github.io/silentium/#/utils/remove-patron-from-pools
 */
declare const removePatronFromPools: (patron: GuestObjectType) => void;
/**
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron-in-pools
 */
declare const isPatronInPools: (patron: GuestObjectType) => boolean;
interface PoolType<T = any> extends GuestObjectType<T> {
    add(guest: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    size(): number;
}
/**
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-pool
 */
declare class PatronPool<T> implements PoolType<T> {
    private initiator;
    private patrons;
    give: (value: T) => this;
    constructor(initiator: unknown);
    size(): number;
    add(shouldBePatron: GuestType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestType<T>): this;
    private sendValueToGuest;
    private guestDisposed;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-pool
 */
declare class GuestPool<T> implements GuestObjectType<T>, PoolType<T> {
    private guests;
    private patronPool;
    constructor(initiator: unknown);
    give(value: T): this;
    add(guest: GuestType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
    size(): number;
    private deliverToGuests;
}

interface GuestValueType<T = any> extends GuestObjectType<T> {
    value(): T;
}
/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-sync
 */
declare class GuestSync<T> implements GuestValueType<T> {
    private theValue?;
    constructor(theValue?: T | undefined);
    give(value: T): this;
    value(): T & ({} | null);
}

/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-object
 */
declare class GuestObject<T> implements GuestDisposableType<T> {
    private baseGuest;
    constructor(baseGuest: GuestType<T>);
    give(value: T): this;
    introduction(): "guest" | "patron";
    disposed(value: T | null): boolean;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-applied
 */
declare class GuestApplied<T, R> implements GuestObjectType<T> {
    private baseGuest;
    private applier;
    constructor(baseGuest: GuestType<R>, applier: (value: T) => R);
    give(value: T): this;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-executor-applied
 */
declare class GuestExecutorApplied<T> implements GuestObjectType<T> {
    give: GuestExecutorType<T, this>;
    constructor(baseGuest: GuestType<T>, applier: (executor: GuestExecutorType) => GuestExecutorType);
}

/**
 * @url https://silentium-lab.github.io/silentium/#/patron
 */
declare class Patron<T> implements GuestDisposableType<T> {
    private willBePatron;
    constructor(willBePatron: GuestType<T>);
    introduction(): "patron";
    give(value: T): this;
    disposed(value: T | null): boolean;
}
/**
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron
 */
declare const isPatron: (guest: GuestType) => guest is Patron<unknown>;

/**
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-once
 */
declare class PatronOnce<T> implements GuestDisposableType<T> {
    private baseGuest;
    private received;
    constructor(baseGuest: GuestType<T>);
    introduction(): "patron";
    give(value: T): this;
    disposed(value: T | null): boolean;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-applied
 */
declare class PatronApplied<T, R> implements GuestObjectType<T> {
    private guestApplied;
    constructor(baseGuest: GuestType<R>, applier: (value: T) => R);
    give(value: T): this;
    introduction(): "guest" | "patron";
}

/**
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-executor-applied
 */
declare class PatronExecutorApplied<T> implements GuestObjectType<T> {
    private guestApplied;
    constructor(baseGuest: GuestType<T>, applier: (executor: GuestExecutorType) => GuestExecutorType);
    give(value: T): this;
    introduction(): "guest" | "patron";
}

type SourceExecutorType<T> = (guest: GuestType<T>) => unknown;
interface SourceObjectType<T> {
    value: SourceExecutorType<T>;
}
type SourceDataType = string | number | boolean | Date | object | Array<unknown> | symbol;
type SourceType<T = any> = SourceExecutorType<T> | SourceObjectType<T> | SourceDataType;
/**
 * @url https://silentium-lab.github.io/silentium/#/utils/value
 */
declare function value<T>(source: SourceType<T>, guest: GuestType<T>): string | number | boolean | symbol | object;
/**
 * @url https://silentium-lab.github.io/silentium/#/utils/is-source
 */
declare function isSource(mbSource: any): mbSource is SourceType;
/**
 * @url https://silentium-lab.github.io/silentium/#/source
 */
declare class Source<T = any> implements SourceObjectType<T> {
    private source;
    constructor(source: SourceType<T>);
    value(guest: GuestType<T>): GuestType<T>;
}
/**
 * @url https://silentium-lab.github.io/silentium/#/utils/source-of
 */
declare const sourceOf: <T>(value: T) => Source<T>;

interface SourceAllType<T = any> extends SourceObjectType<T> {
    valueArray(guest: GuestObjectType<T>): this;
    guestKey<R>(key: string): GuestObjectType<R>;
}
/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-all
 */
declare class SourceAll<T> implements SourceAllType<T> {
    private theAll;
    private keysKnown;
    private keysFilled;
    private filledAllPool;
    constructor(initialKnownKeys?: string[]);
    valueArray(guest: GuestType<T>): this;
    value(guest: GuestType<T>): this;
    guestKey<R>(key: string): GuestObjectType<R>;
    private isAllFilled;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/utils/private
 */
interface PrivateType<T> {
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}
declare class Private<T> implements PrivateType<T> {
    private buildingFn;
    constructor(buildingFn: (...args: any[]) => T);
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-sequence
 */
declare class SourceSequence<T, TG> implements SourceObjectType<TG[]> {
    private baseSource;
    private targetSource;
    constructor(baseSource: SourceType<T[]>, targetSource: PrivateType<SourceType<TG>>);
    value(guest: GuestType<TG[]>): this;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-map
 */
declare class SourceMap<T, TG> implements SourceObjectType<TG[]> {
    private baseSource;
    private targetSource;
    constructor(baseSource: SourceType<T[]>, targetSource: PrivateType<SourceType<TG>>);
    value(guest: GuestType<TG[]>): this;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-race
 */
declare class SourceRace<T> implements SourceObjectType<T> {
    private sources;
    constructor(sources: SourceType<T>[]);
    value(guest: GuestType<T>): this;
}

interface PoolAwareType<T = any> {
    pool(): PatronPool<T>;
}
/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-changeable
 */
type SourceChangeableType<T = any> = SourceObjectType<T> & GuestObjectType<T> & PoolAwareType<T>;
declare class SourceChangeable<T> implements SourceChangeableType<T> {
    private thePool;
    private theEmptyPool;
    private isEmpty;
    private sourceDocument?;
    constructor(sourceDocument?: T | SourceType<T>);
    pool(): PatronPool<unknown>;
    give(value: T): this;
    value(guest: GuestType<T>): this;
    filled(): boolean;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-dynamic
 */
declare class SourceDynamic<T = unknown> implements SourceChangeableType<T> {
    private baseGuest;
    private baseSource;
    constructor(baseGuest: GuestType<T>, baseSource: SourceType<T>);
    value(guest: GuestType<T>): this;
    give(value: T): this;
    pool(): PatronPool<T>;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-applied
 */
declare class SourceApplied<T, R> implements SourceObjectType<R> {
    private baseSource;
    private applier;
    constructor(baseSource: SourceType<T>, applier: (v: T) => R);
    value(g: GuestType<R>): this;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-executor-applied
 */
declare class SourceExecutorApplied<T> implements SourceObjectType<T> {
    value: SourceExecutorType<T>;
    constructor(source: SourceType<T>, applier: (executor: SourceExecutorType<T>) => SourceExecutorType<T>);
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-filtered
 */
declare class SourceFiltered<T> implements SourceObjectType<T> {
    private baseSource;
    private predicate;
    constructor(baseSource: SourceType<T>, predicate: (v: T) => boolean);
    value(g: GuestType<T>): this;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-once
 */
declare class SourceOnce<T> implements SourceChangeableType<T> {
    private source;
    constructor(initialValue?: T);
    value(guest: GuestType<T>): this;
    give(value: T): this;
    pool(): PatronPool<T>;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-sync
 */
declare class SourceSync<T> implements SourceObjectType<T> {
    private baseSource;
    private syncGuest;
    constructor(baseSource: SourceType<T>);
    value(guest: GuestType<T>): this;
    syncValue(): {} | null;
}

interface Prototyped<T> {
    prototype: T;
}
declare class PrivateClass<T> implements PrivateType<T> {
    private constructorFn;
    private modules;
    constructor(constructorFn: Prototyped<T>, modules?: Record<string, unknown>);
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

export { Guest, GuestApplied, GuestCast, GuestDisposable, type GuestDisposableType, GuestExecutorApplied, type GuestExecutorType, GuestObject, type GuestObjectType, GuestPool, GuestSync, type GuestType, type GuestValueType, type MaybeDisposableType, Patron, PatronApplied, PatronExecutorApplied, PatronOnce, PatronPool, type PoolAwareType, type PoolType, Private, PrivateClass, type PrivateType, Source, SourceAll, type SourceAllType, SourceApplied, SourceChangeable, type SourceChangeableType, type SourceDataType, SourceDynamic, SourceExecutorApplied, type SourceExecutorType, SourceFiltered, SourceMap, type SourceObjectType, SourceOnce, SourceRace, SourceSequence, SourceSync, type SourceType, give, isGuest, isPatron, isPatronInPools, isSource, patronPools, removePatronFromPools, sourceOf, value };
