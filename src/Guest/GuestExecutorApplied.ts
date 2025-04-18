import {
  give,
  GuestExecutorType,
  GuestObjectType,
  GuestType,
} from "../Guest/Guest";

/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-executor-applied
 */
export class GuestExecutorApplied<T> implements GuestObjectType<T> {
  public give: GuestExecutorType<T, this>;

  public constructor(
    baseGuest: GuestType<T>,
    applier: (executor: GuestExecutorType) => GuestExecutorType,
  ) {
    this.give = applier((v) => give(v, baseGuest)) as GuestExecutorType<
      T,
      this
    >;
  }
}
