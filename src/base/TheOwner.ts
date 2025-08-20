/**
 * Representation of Information Owner
 */
export abstract class TheOwner<T> {
  public abstract give(value: T): this;
}
