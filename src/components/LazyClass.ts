import { Lazy } from "../base";

/**
 * Lazy instance from class constructor
 */
export class LazyClass<T> extends Lazy<T> {
  public constructor(constrFn: any) {
    const buildFn = (...args: unknown[]) => new constrFn(...args);
    super(buildFn);
  }
}
