import { EventType, EventUserType } from "../types";

export class Any<T> implements EventType<T> {
  private $infos: EventType[];

  public constructor(...infos: EventType<T>[]) {
    this.$infos = infos;
  }

  public event(user: EventUserType<T>): this {
    this.$infos.forEach((info) => {
      info.event(user);
    });
    return this;
  }
}
