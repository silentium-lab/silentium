/**
 * Type that takes a value as an argument
 * and returns a specific value
 */
type ConstructorType<P extends unknown[] = unknown[], T = unknown> = (...args: P) => T;

/**
 * The message type from which
 * values should be received
 */
interface MessageType<T = unknown> {
    then(resolved: ConstructorType<[T]>): MessageType<T>;
    catch(rejected: ConstructorType<[unknown]>): this;
}
/**
 * Value type from message
 */
type MessageTypeValue<T> = T extends MessageType<infer U> ? U : never;
/**
 * A type that accepts either a message or a raw value
 */
type MaybeMessage<T = unknown> = MessageType<T> | T;

/**
 * A function that helps to ensure that
 * the message is indeed a message object
 * and not just a value
 */
declare function ActualMessage<T>(message: MaybeMessage<T>): MessageType<T>;

interface ChainableType<T> {
    chain(m: MessageType<T>): this;
}

/**
 * A type that can accept value
 */
interface SourceType<T = unknown> {
    use(value: T): this;
}
/**
 * Message and source at same time
 */
type MessageSourceType<T = unknown> = MessageType<T> & SourceType<T>;

/**
 * Helps to connect Different
 * message and source
 */
declare function Chainable<T>(src: SourceType<T>): ChainableImpl<T>;
declare class ChainableImpl<T> implements ChainableType<T> {
    private src;
    constructor(src: SourceType<T>);
    chain($m: MessageType<T>): this;
}

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

type MessageExecutorType<T> = (resolve: ConstructorType<[T]>, reject: ConstructorType<[unknown]>) => MessageType | (() => void) | void;
/**
 * A message created from an executor function.
 * The executor function can return a message destruction function.
 */
declare function Message<T>(executor: MessageExecutorType<T>): MessageImpl<T>;
/**
 * Reactive message implementation
 */
declare class MessageImpl<T> implements MessageType<T>, DestroyableType {
    private executor;
    private rejections;
    private dc;
    constructor(executor: MessageExecutorType<T>);
    then(resolve: ConstructorType<[T]>): this;
    catch(rejected: ConstructorType<[unknown]>): this;
    destroy(): this;
}

/**
 * First message - is main
 * others will be destroyed when first
 * will be destroyed
 */
declare function Connected<T>(...m: MessageType[]): MessageImpl<T>;

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
    /**
     * Add one destroyable
     * @param e
     * @returns
     */
    add<R>(e: R): R;
    /**
     * Add many destroyable objects
     * @param destroyableList
     * @returns
     */
    many(destroyableList: unknown[]): this;
    destroy(): this;
    destructor(): () => this;
}

/**
 * Create local copy of source what can be destroyed
 */
declare function Local<T>(_base: MaybeMessage<T>): MessageImpl<T>;

/**
 * Base message source object
 */
declare function MessageSource<T>(messageExecutor: MessageExecutorType<T>, sourceExecutor: ConstructorType<[T]>): MessageSourceImpl<T>;
declare class MessageSourceImpl<T> implements MessageSourceType<T> {
    private sourceExecutor;
    private message;
    constructor(messageExecutor: MessageExecutorType<T>, sourceExecutor: ConstructorType<[T]>);
    use(value: T): this;
    then(resolved: ConstructorType<[T]>): this;
    catch(rejected: ConstructorType<[unknown]>): this;
}

/**
 * A component that, on each access, returns a new instance
 * of a reference type based on the constructor function
 */
declare function New<T>(construct: ConstructorType<[], T>): MessageImpl<T>;

/**
 * Helps convert a value into a message
 */
declare function Of<T>(value: T): MessageImpl<T>;

/**
 * Handles rejections collection
 */
declare class Rejections {
    private catchers;
    private lastRejectReason;
    reject: (reason: unknown) => void;
    catch(rejected: ConstructorType<[unknown]>): this;
    destroy(): this;
}

declare const ResetSilenceCache: unique symbol;
/**
 * Silence is null or undefined or duplicated values
 * Everything else is not silence
 */
declare function Silence<T>(resolve: ConstructorType<[T]>): (v: T | undefined) => void;

/**
 * Resolver that does nothing with the passed value,
 * needed for silent message triggering
 */
declare function Void(): () => void;

type ExtractTypeS<T> = T extends MaybeMessage<infer U> ? U : never;
type ExtractTypesFromArrayS<T extends MaybeMessage<any>[]> = {
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
declare function All<const T extends MaybeMessage[]>(...messages: T): MessageImpl<ExtractTypesFromArrayS<T>>;

/**
 * A message that emits values received from
 * any of its bound messages
 */
declare function Any<const T>(...messages: MaybeMessage<T>[]): MessageImpl<T>;

/**
 * An message that applies a function
 * to the value of the base message
 */
declare function Applied<const T, R>(base: MaybeMessage<T>, applier: ConstructorType<[T], MaybeMessage<R>>): MessageImpl<R>;

/**
 * Allows applying variables from an message that passes an array to a function,
 * where each element of the array will be passed as a separate argument
 */
declare function AppliedDestructured<const T extends any[], R>($base: MaybeMessage<T>, applier: ConstructorType<any[], R>): MessageImpl<R>;

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
 * An information object that helps multiple owners access
 * a single another information object
 */
declare function Shared<T>($base: MessageType<T> | MessageSourceType<T>): SharedImpl<T>;
declare class SharedImpl<T> implements MessageSourceType<T>, ChainableType<T> {
    private $base;
    private resolver;
    private lastV;
    private resolvers;
    private source?;
    constructor($base: MessageType<T> | MessageSourceType<T>);
    then(resolved: ConstructorType<[T]>): this;
    use(value: T): this;
    catch(rejected: ConstructorType<[unknown]>): this;
    destroy(): this;
    value(): PrimitiveImpl<T>;
    chain(m: MessageType<T>): this;
}

/**
 * Message with error catched
 * inside another message
 */
declare function Catch<T>($base: MessageType): SharedImpl<T>;

type Last$1<T extends readonly any[]> = T extends readonly [...infer _, infer L] ? L : never;
/**
 * Chains messages together and triggers
 * the last message only when all previous messages
 * have emitted their values. The value of Chain will be the value
 * of the last message. If any messages
 * emit a value again after the overall Chain response was already returned,
 * then Chain emits again with the value of the last message.
 */
declare function Chain<T extends readonly MessageType[]>(...messages: T): MessageImpl<MessageTypeValue<Last$1<T>>>;

/**
 * Component what helps to compute
 * poor functions, and represent result
 * as message
 */
declare function Computed<const T extends MaybeMessage<any>[], R>(applier: ConstructorType<any[], R>, ...messages: T): MessageImpl<R>;

/**
 * Type for passing action requirements
 * to an external system
 */
interface ContextType extends Record<string, any> {
    transport: any;
    params?: Record<string, any>;
    result?: ConstructorType<[any]>;
    error?: ConstructorType<[any]>;
}

/**
 * The ability to call an external system through
 * sending a message in a standardized format
 * ContextType, the list of transport should be defined via
 * the Context.transport map object
 */
declare function Context<T>(name: MaybeMessage<string | symbol>, params?: MaybeMessage<ContextType["params"]>): MessageImpl<T>;
declare namespace Context {
    var transport: Map<any, ConstructorType<[ContextType]>>;
}

/**
 * Connects an external message to an Context message chain
 */
declare function ContextChain(base: MaybeMessage): (context: ContextType) => void;

/**
 * Message for the arrival of a specific Context message
 * for specific transport
 */
declare function ContextOf(transport: string): MessageImpl<ContextType>;

interface EmptyType {
    empty(): MessageType<boolean>;
}

declare const Nothing: unique symbol;
/**
 * Helps to split message and empty
 * response
 */
declare function Empty<T>($base: MessageType<T>): EmptyImpl<T>;
declare class EmptyImpl<T> implements EmptyType {
    private $base;
    private $empty;
    constructor($base: MessageType<T>);
    message(): MessageType<T>;
    empty(): MessageType<boolean>;
}

type ExecutorApplier<T> = (executor: (v: T) => void) => (v: T) => void;
/**
 * Applies a value transfer function to the resolver
 * and returns the same value transfer function for the resolver
 * Useful for applying functions like debounced or throttle
 */
declare function ExecutorApplied<T>($base: MessageType<T>, applier: ExecutorApplier<T>): MessageImpl<T>;

/**
 * Filters values from the source message based on a predicate function,
 * optionally providing a default value when the predicate fails.
 */
declare function Filtered<T>(base: MaybeMessage<T>, predicate: ConstructorType<[T], boolean>, defaultValue?: T): MessageType<T>;

/**
 * Message what freezes first known value
 */
declare function Freeze<T>($base: MessageType<T>, $invalidate?: MessageType<T>): MessageImpl<T>;

/**
 * A message derived from event with a different
 * method call interface, based on callbacks.
 * Allows attaching a custom handler to an existing event source
 * and presenting it as a silentium message
 */
declare function FromEvent<T>(emitter: MaybeMessage<any>, eventName: MaybeMessage<string>, subscribeMethod: MaybeMessage<string>, unsubscribeMethod?: MaybeMessage<string>): MessageImpl<T>;

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
declare function Late<T>(v?: T): SharedImpl<T>;
declare class LateImpl<T> implements MessageSourceType<T> {
    private v?;
    private rejections;
    private lateR;
    private notify;
    constructor(v?: T | undefined);
    then(r: ConstructorType<[T]>): this;
    use(value: T): this;
    catch(rejected: ConstructorType<[unknown]>): this;
}

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 */
declare function Map$1<T, TG>(base: MaybeMessage<T[]>, target: ConstructorType<[any], MessageType<TG>>): MessageImpl<TG[]>;

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 */
declare function Once<T>($base: MessageType<T>): MessageImpl<T>;

type Last<T extends readonly any[]> = T extends readonly [...infer _, infer L] ? L extends (...args: any) => any ? L : never : never;
declare function Piped<T extends ((...vars: any) => MaybeMessage)[]>($m: MaybeMessage, ...c: T): ReturnType<Last<T>>;

declare function Process<T, R = unknown>($base: MessageType<T>, builder: ConstructorType<[T], MessageType<R>>): MessageImpl<R>;

/**
 * First responded message
 */
declare function Race<const T extends MaybeMessage[]>(...messages: T): MessageImpl<unknown>;

/**
 * Creates a sequence that accumulates all values from the source into an array,
 * emitting the growing array with each new value.
 */
declare function Sequence<T>($base: MessageType<T>): MessageImpl<T[]>;

/**
 * Component that receives a data array and yields values one by one
 */
declare function Stream<T>(base: MaybeMessage<T[]>): MessageImpl<T>;

/**
 * Track creation and destruction of components
 * uses Context component to send messages
 * when created sends action=created
 * when destroyed sends action=destroyed
 */
declare function Trackable(name: string, target: object): object;

declare global {
    interface SilentiumDebug {
        value: ($message: MessageType) => unknown;
        print: (...messages: MessageType[]) => void;
        destroyable: (onDestroy: () => void) => MessageType<any> & DestroyableType;
    }
    interface GlobalThis {
        silentiumDebug: SilentiumDebug;
    }
    const silentiumDebug: SilentiumDebug;
}
declare class MessageDestroyable implements MessageType<any>, DestroyableType {
    private onDestroy;
    constructor(onDestroy: () => void);
    then(resolve: ConstructorType<[string]>): this;
    catch(): this;
    destroy(): this;
}
/**
 * global functions for debuging
 * silentium programs
 */
declare function DevTools(): void;

declare function ensureFunction(v: unknown, label: string): void;
declare function ensureMessage(v: unknown, label: string): void;

/**
 * Checks that the value is neither undefined nor null
 */
declare const isFilled: <T>(value?: T) => value is Exclude<T, null | undefined>;
/**
 * Checks that the object is an message
 */
declare function isMessage(o: unknown): o is MessageType;
/**
 * Checks that the object is an message
 */
declare function isSource(o: unknown): o is SourceType;
/**
 * Checks that the object is destroyable
 */
declare function isDestroyable(o: unknown): o is DestroyableType;
/**
 * Checks that the object can indicate whether it has been destroyed or not
 */
declare function isDestroyed(o: unknown): o is DestroyedType;

export { ActualMessage, All, Any, Applied, AppliedDestructured, Catch, Chain, Chainable, ChainableImpl, Computed, Connected, type ConstructorType, Context, ContextChain, ContextOf, type ContextType, DestroyContainer, DestroyContainerImpl, Destroyable, DestroyableImpl, type DestroyableType, type DestroyedType, DevTools, Empty, EmptyImpl, ExecutorApplied, Filtered, Freeze, FromEvent, Late, LateImpl, Local, Map$1 as Map, type MaybeMessage, Message, MessageDestroyable, type MessageExecutorType, MessageImpl, MessageSource, MessageSourceImpl, type MessageSourceType, type MessageType, type MessageTypeValue, New, Nothing, Of, Once, Piped, Primitive, PrimitiveImpl, Process, Race, Rejections, ResetSilenceCache, Sequence, Shared, SharedImpl, Silence, type SourceType, Stream, Trackable, Void, ensureFunction, ensureMessage, isDestroyable, isDestroyed, isFilled, isMessage, isSource };
