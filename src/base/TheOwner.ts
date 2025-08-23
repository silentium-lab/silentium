/**
 * Representation of Information Owner
 */
export abstract class TheOwner<T = unknown> {
  public abstract give(value: T): this;
}
