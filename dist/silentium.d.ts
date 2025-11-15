/**
 * Type of an object that can
 * be destroyed
 */
interface DestroyableType {
    destroy(): this;
}
/**
 * Represents an object that can provide an answer
 * whether it was destroyed
 */
interface DestroyedType {
    destroyed(): boolean;
}

/**
 * Allows creating an object that definitely has a destructor,
 * useful to avoid creating unnecessary conditions
 */
declare function Destroyable<T>(base: T): DestroyableImpl<T>;
declare class DestroyableImpl<T> implements DestroyableType {
    private base;
    constructor(base: T);
    destroy(): this;
}

/**
 * An object that allows collecting all disposable objects and
 * disposing them later all together
 */
declare function DestroyContainer(): DestroyContainerImpl;
declare class DestroyContainerImpl implements DestroyableType {
    private destructors;
    add<R>(e: R): R;
    destroy(): this;
}

/**
 * Type representing the process
 * of passing a value somewhere
 */
interface TransportType<T = unknown, R = any> {
    use(value: T): R;
}
/**
 * Transport that can be destroyed
 */
type TransportDestroyableType<T = any, R = any> = TransportType<T, R> & DestroyableType & DestroyedType;

/**
 * The message type from which
 * values should be received
 */
interface MessageType<T = unknown> {
    to(user: TransportType<T>): this;
}
/**
 * Value type from message
 */
type MessageTypeValue<T> = T extends MessageType<infer U> ? U : never;

type MessageExecutorType<T> = (transport: TransportType<T>) => void | (() => void);
/**
 * A message created from an executor function.
 * The executor function can return a message destruction function.
 */
declare function Message<T>(executor: MessageExecutorType<T>): MessageImpl<T>;
declare class MessageImpl<T> implements MessageType<T>, DestroyableType {
    private executor;
    private mbDestructor;
    constructor(executor: MessageExecutorType<T>);
    to(transport: TransportType<T>): this;
    destroy(): this;
}

/**
 * Create local copy of source what can be destroyed
 */
declare function Local<T>($base: MessageType<T>): LocalImpl<T>;
declare class LocalImpl<T> implements MessageType<T>, DestroyableType {
    private $base;
    private destroyed;
    constructor($base: MessageType<T>);
    to(transport: TransportType<T>): this;
    private transport;
    destroy(): this;
}

/**
 * Type that takes a value as an argument
 * and returns a specific value
 */
type ConstructorType<P extends unknown[] = unknown[], T = unknown> = (...args: P) => T;

/**
 * A component that, on each access, returns a new instance
 * of a reference type based on the constructor function
 */
declare function New<T>(construct: ConstructorType<[], T>): MessageImpl<T>;

/**
 * Helps convert a value into a message
 */
declare function Of<T>(value: T): OfImpl<T>;
declare class OfImpl<T> implements MessageType<T> {
    private value;
    constructor(value: T);
    to(transport: TransportType<T>): this;
}

/**
 * Type of value transfer logic executor
 */
type TransportExecutor<T> = (v: T) => void;
/**
 * Base transport that accepts the passed value,
 * acts as a conductor to deliver the value from a message to somewhere
 */
declare function Transport<T>(transportExecutor: TransportExecutor<T>): TransportImpl<T>;
declare class TransportImpl<T> implements TransportType<T> {
    private executor;
    constructor(executor: TransportExecutor<T>);
    use(value: T): this;
}
/**
 * Type of executor for value passing logic and message returning
 */
type TransportMessageExecutor<T, ET = T> = (v: T) => MessageType<ET>;
/**
 * A transport that delivers a value from one message
 * and returns another message based on the value
 */
declare function TransportMessage<T, ET = any>(executor: TransportMessageExecutor<T, ET>): TransportMessageImpl<T, ET>;
declare class TransportMessageImpl<T, ET = T> implements TransportType<T, MessageType<ET>> {
    private executor;
    constructor(executor: TransportMessageExecutor<T, ET>);
    use(value: T): MessageType<ET>;
}
/**
 * A transport that accepts a child transport
 * to perform some transformation on the value
 * during its transmission
 */
declare function TransportParent<T>(executor: (this: TransportType, v: T, ...context: any[]) => void, ...args: any[]): TransportParentImpl<T>;
declare class TransportParentImpl<T> implements TransportType<T> {
    private executor;
    private args;
    private _child?;
    constructor(executor: (this: TransportType, v: T, ...context: any[]) => void, args?: any[], _child?: TransportType<T> | undefined);
    use(value: T): this;
    child(transport: TransportType, ...args: any[]): TransportParentImpl<T>;
}

/**
 * Allows subscribing a transport to a message
 * even if the transport reference does not exist,
 * helps avoid unnecessary conditions in application code
 */
declare function TransportOptional(base?: TransportType): TransportOptionalImpl;
declare class TransportOptionalImpl {
    private base?;
    constructor(base?: TransportType | undefined);
    wait(m: MessageType): this;
}

/**
 * Transport that does nothing with the passed value,
 * needed for silent message triggering
 */
declare function Void(): VoidImpl;
declare class VoidImpl implements TransportType {
    use(): this;
}

type ExtractTypeS<T> = T extends MessageType<infer U> ? U : never;
type ExtractTypesFromArrayS<T extends MessageType<any>[]> = {
    [K in keyof T]: ExtractTypeS<T[K]>;
};
/**
 * A message that represents values from
 * all provided messages as an array.
 * When all messages emit their values,
 * the combined value will be returned.
 * If at least one message later emits a new
 * value, the updated array with the new value
 * will be emitted by All.
 */
declare function All<const T extends MessageType[]>(...messages: T): AllImpl<T>;
declare class AllImpl<const T extends MessageType[]> implements MessageType<ExtractTypesFromArrayS<T>> {
    private known;
    private filled;
    private $messages;
    private result;
    constructor(...messages: T);
    to(transport: TransportType<ExtractTypesFromArrayS<T>>): this;
    private transport;
}

/**
 * A message that emits values received from
 * any of its bound messages
 */
declare function Any<const T>(...messages: MessageType<T>[]): AnyImpl<T>;
declare class AnyImpl<T> implements MessageType<T> {
    private $messages;
    constructor(...messages: MessageType<T>[]);
    to(transport: TransportType<T>): this;
}

/**
 * An message that applies a function
 * to the value of the base message
 */
declare function Applied<const T, R>($base: MessageType<T>, applier: ConstructorType<[T], R>): AppliedImpl<T, R>;
declare class AppliedImpl<T, R> implements MessageType<R> {
    private $base;
    private applier;
    constructor($base: MessageType<T>, applier: ConstructorType<[T], R>);
    to(transport: TransportType<R>): this;
    private transport;
}

/**
 * Allows applying variables from an message that passes an array to a function,
 * where each element of the array will be passed as a separate argument
 */
declare function AppliedDestructured<const T extends any[], R>($base: MessageType<T>, applier: ConstructorType<T[number][], R>): AppliedImpl<T, R>;

/**
 * An message representing a base message where
 * its operation is wrapped in try-catch
 * and expects exceptions. If an exception
 * bubbles up, it's passed to the transports
 * as errorMessage and errorOriginal
 */
declare function Catch<T>($base: MessageType<T>, errorMessage: TransportType, errorOriginal?: TransportType): CatchImpl<T>;
declare class CatchImpl<T> implements MessageType<T> {
    private $base;
    private errorMessage;
    private errorOriginal?;
    constructor($base: MessageType<T>, errorMessage: TransportType, errorOriginal?: TransportType | undefined);
    to(transport: TransportType<T>): this;
}

type Last<T extends readonly any[]> = T extends readonly [...infer _, infer L] ? L : never;
/**
 * Chains messages together and triggers
 * the last message only when all previous messages
 * have emitted their values. The value of Chain will be the value
 * of the last message. If any messages
 * emit a value again after the overall Chain response was already returned,
 * then Chain emits again with the value of the last message.
 */
declare function Chain<T extends readonly MessageType[]>(...messages: T): ChainImpl<T>;
declare class ChainImpl<T extends readonly MessageType[]> implements MessageType<MessageTypeValue<Last<T>>> {
    private $messages;
    private $latest;
    constructor(...messages: T);
    to(transport: TransportType<MessageTypeValue<Last<T>>>): this;
    private handleMessage;
    private oneMessageTransport;
}

type ExecutorApplier<T> = (executor: TransportExecutor<T>) => TransportExecutor<T>;
/**
 * Applies a value transfer function to the transport
 * and returns the same value transfer function for the transport
 * Useful for applying functions like debounced or throttle
 */
declare function ExecutorApplied<T>($base: MessageType<T>, applier: ExecutorApplier<T>): ExecutorAppliedImpl<T>;
declare class ExecutorAppliedImpl<T> implements MessageType<T> {
    private $base;
    private applier;
    constructor($base: MessageType<T>, applier: ExecutorApplier<T>);
    to(transport: TransportType<T>): this;
}

/**
 * Filters values from the source message based on a predicate function,
 * optionally providing a default value when the predicate fails.
 */
declare function Filtered<T>($base: MessageType<T>, predicate: ConstructorType<[T], boolean>, defaultValue?: T): MessageType<T>;
declare class FilteredImpl<T> implements MessageType<T> {
    private $base;
    private predicate;
    private defaultValue?;
    constructor($base: MessageType<T>, predicate: ConstructorType<[T], boolean>, defaultValue?: T | undefined);
    to(transport: TransportType<T>): this;
    private parent;
}

/**
 * A message derived from event with a different
 * method call interface, based on callbacks.
 * Allows attaching a custom handler to an existing event source
 * and presenting it as a silentium message
 */
declare function FromEvent<T>($emitter: MessageType<any>, $eventName: MessageType<string>, $subscribeMethod: MessageType<string>, $unsubscribeMethod?: MessageType<string>): FromEventImpl<T>;
declare class FromEventImpl<T> implements MessageType<T>, DestroyableType {
    private $emitter;
    private $eventName;
    private $subscribeMethod;
    private $unsubscribeMethod?;
    private lastTransport;
    private handler;
    constructor($emitter: MessageType<any>, $eventName: MessageType<string>, $subscribeMethod: MessageType<string>, $unsubscribeMethod?: MessageType<string> | undefined);
    to(transport: TransportType<T>): this;
    private parent;
    destroy(): this;
}

/**
 * Creates an message from a Promise, allowing the promise's resolution or rejection
 * to be handled as an message. The resolved value is emitted to the transport,
 * and if an error is provided, rejections are forwarded to it.
 */
declare function FromPromise<T>(p: Promise<T>, error?: TransportType): FromPromiseImpl<T>;
declare class FromPromiseImpl<T> implements MessageType<T> {
    private p;
    private error?;
    constructor(p: Promise<T>, error?: TransportType | undefined);
    to(transport: TransportType<T>): this;
}

/**
 * A type that serves as both
 * an message and a transport
 */
type SourceType<T = unknown> = MessageType<T> & TransportType<T>;

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare function Late<T>(v?: T): LateImpl<T>;
declare class LateImpl<T> implements SourceType<T> {
    private v?;
    private lateTransport;
    private notify;
    constructor(v?: T | undefined);
    to(transport: TransportType<T>): this;
    use(value: T): this;
}

/**
 * Helps represent an message as a primitive type, which can be useful
 * for cases when you need to always have a reference to the current value
 * without updating the shared value when the current one changes.
 * For example, this could be used when passing an authorization token.
 * It can also be useful for testing or logging purposes.
 */
declare function Primitive<T>($base: MessageType<T>, theValue?: T | null): PrimitiveImpl<T>;
declare class PrimitiveImpl<T> {
    private $base;
    private theValue;
    private touched;
    constructor($base: MessageType<T>, theValue?: T | null);
    private ensureTouched;
    [Symbol.toPrimitive](): T | null;
    primitive(): T | null;
    primitiveWithException(): T & ({} | undefined);
}

/**
 * An message with a value that will be set later,
 * capable of responding to different transports
 */
declare function LateShared<T>(value?: T): LateSharedImpl<T>;
declare class LateSharedImpl<T> implements SourceType<T> {
    private $msg;
    private primitive;
    constructor(value?: T);
    to(transport: TransportType<T>): this;
    use(value: T): this;
    value(): PrimitiveImpl<T>;
}

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 */
declare function Map<T, TG>($base: MessageType<T[]>, $target: TransportType<any, MessageType<TG>>): MapImpl<T, TG>;
declare class MapImpl<T, TG> implements MessageType<TG[]> {
    private $base;
    private $target;
    constructor($base: MessageType<T[]>, $target: TransportType<any, MessageType<TG>>);
    to(transport: TransportType<TG[]>): this;
    private parent;
}

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 */
declare function Once<T>($base: MessageType<T>): OnceImpl<T>;
declare class OnceImpl<T> implements MessageType<T> {
    private $base;
    private isFilled;
    constructor($base: MessageType<T>);
    to(transport: TransportType<T>): this;
    private parent;
}

/**
 * Type for passing action requirements
 * to an external system
 */
interface RPCType extends Record<string, any> {
    method: string;
    transport?: string;
    params?: Record<string, any>;
    result?: TransportType;
    error?: TransportType;
}

interface RPCImplType<T> {
    result(): MessageType<T>;
    error(): MessageType<Error | string>;
}
/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * RPCType, the list of transports should be defined via
 * the RPC.transport object
 */
declare function RPC<T>($rpc: MessageType<RPCType>): RPCImplType<T>;
declare namespace RPC {
    var transport: {
        default: TransportType<RPCType>;
    } & Record<string, TransportType<RPCType, any>>;
}
declare class RPCImpl {
    private $rpc;
    private $result;
    private $error;
    constructor($rpc: MessageType<RPCType>);
    result(): LateSharedImpl<unknown>;
    error(): LateSharedImpl<unknown>;
}

/**
 * Connects an external message to an RPC message chain
 */
declare function RPCChain($base: MessageType): TransportImpl<RPCType>;

/**
 * Message for the arrival of a specific RPC message
 * for specific transport
 */
declare function RPCOf(transport: string): MessageImpl<RPCType>;

/**
 * Creates a sequence that accumulates all values from the source into an array,
 * emitting the growing array with each new value.
 */
declare function Sequence<T>($base: MessageType<T>): SequenceImpl<T>;
declare class SequenceImpl<T> implements MessageType<T[]> {
    private $base;
    private result;
    constructor($base: MessageType<T>);
    to(transport: TransportType<T[]>): this;
    private parent;
}

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
declare class TransportPool<T> {
    private transports;
    private innerTransport;
    constructor();
    transport(): TransportType<T, any>;
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
declare function Shared<T>($base: MessageType<T>, stateless?: boolean): SharedImpl<T>;
declare class SharedImpl<T> implements SourceType<T> {
    private $base;
    private stateless;
    private transportPool;
    private lastValue;
    private calls;
    constructor($base: MessageType<T>, stateless?: boolean);
    to(transport: TransportType<T>): this;
    use(value: T): this;
    private firstCallTransport;
    touched(): void;
    pool(): TransportPool<T>;
    destroy(): TransportPool<T>;
}

/**
 * Creates a shared source that allows multiple transports to subscribe to the same underlying source.
 * The stateless parameter controls whether the sharing maintains state or not.
 */
declare function SharedSource<T>($base: SourceType<T>, stateless?: boolean): SharedSourceImpl<T>;
declare class SharedSourceImpl<T> implements SourceType<T> {
    private $base;
    private $sharedBase;
    constructor($base: SourceType<T>, stateless?: boolean);
    to(transport: TransportType<T>): this;
    use(value: T): this;
}

/**
 * Component that receives a data array and yields values one by one
 */
declare function Stream<T>($base: MessageType<T[]>): StreamImpl<T>;
declare class StreamImpl<T> implements MessageType<T> {
    private $base;
    constructor($base: MessageType<T[]>);
    to(transport: TransportType<T>): this;
    private parent;
}

/**
 * Creates a transport that applies a constructor to the result of another transport.
 */
declare function TransportApplied<T>(baseTransport: TransportType<any, MessageType<T>>, applier: ConstructorType<[MessageType], MessageType<T>>): TransportAppliedImpl<T>;
declare class TransportAppliedImpl<T> implements TransportType<unknown, MessageType<T>> {
    private baseTransport;
    private applier;
    constructor(baseTransport: TransportType<any, MessageType<T>>, applier: ConstructorType<[MessageType], MessageType<T>>);
    use(args: unknown): MessageType<T>;
}

/**
 * Creates a transport that merges additional arguments into the base transport's arguments
 * at a specified index position, allowing for flexible argument composition
 */
declare function TransportArgs(baseTransport: TransportType<any[], MessageType>, args: unknown[], startFromArgIndex?: number): TransportArgsImpl;
declare class TransportArgsImpl implements TransportType<unknown[], MessageType<unknown>> {
    private baseTransport;
    private args;
    private startFromArgIndex;
    constructor(baseTransport: TransportType<any[], MessageType>, args: unknown[], startFromArgIndex?: number);
    use(runArgs: unknown[]): MessageType<unknown>;
}

/**
 * Creates a transport wrapper that automatically manages destruction of created instances
 */
declare function TransportDestroyable<T>(baseTransport: TransportType<any[], MessageType<T>>): TransportDestroyableImpl<T>;
declare class TransportDestroyableImpl<T> implements TransportType<unknown, MessageType<T>>, DestroyableType {
    private baseTransport;
    private destructors;
    constructor(baseTransport: TransportType<any[], MessageType<T>>);
    use(args: any[]): MessageType<T>;
    destroy(): this;
}

declare function ensureFunction(v: unknown, label: string): void;
declare function ensureMessage(v: unknown, label: string): void;
declare function ensureTransport(v: unknown, label: string): void;

/**
 * Checks that the value is neither undefined nor null
 */
declare const isFilled: <T>(value?: T) => value is Exclude<T, null | undefined>;
/**
 * Checks that the object is an message
 */
declare function isMessage<T>(o: T): o is T & MessageType;
/**
 * Checks that the object is destroyable
 */
declare function isDestroyable<T>(o: T): o is T & DestroyableType;
/**
 * Checks that the object can indicate whether it has been destroyed or not
 */
declare function isDestroyed<T>(o: T): o is T & DestroyedType;
/**
 * Checks that the object is a transport
 */
declare function isTransport<T>(o: T): o is T & TransportType;

export { All, AllImpl, Any, AnyImpl, Applied, AppliedDestructured, AppliedImpl, Catch, CatchImpl, Chain, ChainImpl, type ConstructorType, DestroyContainer, DestroyContainerImpl, Destroyable, DestroyableImpl, type DestroyableType, type DestroyedType, ExecutorApplied, ExecutorAppliedImpl, Filtered, FilteredImpl, FromEvent, FromEventImpl, FromPromise, FromPromiseImpl, Late, LateImpl, LateShared, LateSharedImpl, Local, LocalImpl, Map, MapImpl, Message, MessageImpl, type MessageType, type MessageTypeValue, New, Of, OfImpl, Once, OnceImpl, Primitive, PrimitiveImpl, RPC, RPCChain, RPCImpl, RPCOf, type RPCType, Sequence, SequenceImpl, Shared, SharedImpl, SharedSource, SharedSourceImpl, type SourceType, Stream, StreamImpl, Transport, TransportApplied, TransportAppliedImpl, TransportArgs, TransportArgsImpl, TransportDestroyable, TransportDestroyableImpl, type TransportDestroyableType, type TransportExecutor, TransportImpl, TransportMessage, type TransportMessageExecutor, TransportMessageImpl, TransportOptional, TransportOptionalImpl, TransportParent, TransportParentImpl, TransportPool, type TransportType, Void, VoidImpl, ensureFunction, ensureMessage, ensureTransport, isDestroyable, isDestroyed, isFilled, isMessage, isTransport };
