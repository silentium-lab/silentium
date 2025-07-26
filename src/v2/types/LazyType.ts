import { InformationType } from "./InformationType";

/**
 * Lazy accepts any number of arguments and returns information
 */
export type LazyType<T> = (...args: any[]) => InformationType<T>;
