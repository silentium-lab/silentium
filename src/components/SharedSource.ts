import { Shared } from "../components/Shared";
import { EventUserType, SourceType } from "../types";

export class SharedSource<T> implements SourceType<T> {
  private $sharedBase: Shared<T>;

  public constructor(
    private $base: SourceType<T>,
    stateless = false,
  ) {
    this.$sharedBase = new Shared(this.$base, stateless);
  }

  public event(user: EventUserType<T>) {
    this.$sharedBase.event(user);
    return this;
  }

  public use(value: T) {
    this.$sharedBase.touched();
    this.$base.use(value);
    return this;
  }
}
