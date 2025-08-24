export interface OwnerType<T = unknown> {
  give(value: T): this;
}

/**
 * Representation of Information Owner
 */
export abstract class TheOwner<T = unknown> implements OwnerType<T> {
  public abstract give(value: T): this;
}
