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
 * Новая версия all компонента
 */
declare const all: <const T extends Information[]>(...infos: T) => Information<ExtractTypesFromArrayS<T>>;

declare const any: <T>(...infos: Information<T>[]) => Information<unknown>;

type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;
declare const chain: <T extends Information[]>(...infos: T) => Information<Last<T>>;

declare const executorApplied: <T>(base: Information<T>, applier: (executor: Owner<T>) => Owner<T>) => Information<T>;

declare const filtered: <T>(base: Information<T>, predicate: (v: T) => boolean, defaultValue?: T) => Information<T>;

interface LazyType<T> {
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

declare const lazyS: <T>(lazyI: LazyType<Information<T>>, destroyI?: Information<unknown>) => Information<T>;

declare const map: <T, TG>(base: Information<T[]>, targetI: LazyType<Information<TG>>) => Information<TG[]>;

declare const ownerApplied: <T, R>(baseowner: Owner<R>, applier: (value: T) => R) => Owner<T>;

declare const ownerExecutorApplied: <T>(baseowner: Owner<T>, applier: (ge: (v: T) => void) => (v: T) => void) => Owner<T>;

interface infoSync<T> {
    syncValue(): T;
}
declare const ownerSync: <T>(baseinfo: Information<T>, defaultValue?: T) => infoSync<T>;

declare const of: <T>(incomeI?: InformationDataType<T>) => readonly [Information<T>, Owner<T>];

declare const once: <T>(base: Information<T>) => Information<T>;

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
 * An information info that helps multiple owners access
 * a single information info
 */
declare const pool: <T>(base: Information<T>) => readonly [Information<T>, OwnerPool<T>];

/**
 * Helps to get lazy instance of dependency
 * @url https://silentium-lab.github.io/silentium/#/utils/lazy
 */
declare const lazy: <T>(buildingFn: (...args: any[]) => T) => LazyType<T>;

interface Prototyped<T> {
    prototype: T;
}
declare const lazyClass: <T>(constructorFn: Prototyped<T>, modules?: Record<string, unknown>) => LazyType<T>;

export { type ExtractTypesFromArray, type ExtractTypesFromArrayS, I, Information, type InformationDataType, type InformationExecutorType, type InformationObjectType, type InformationType, type LazyType, O, Owner, type OwnerExecutorType, type OwnerObjectType, OwnerPool, type OwnerType, all, any, chain, executorApplied, filtered, type infoSync, lazy, lazyClass, lazyS, map, of, once, ownerApplied, ownerExecutorApplied, ownerSync, pool };
