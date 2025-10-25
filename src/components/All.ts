import { ParentUser } from "src/base/User";
import { EventType, EventUserType } from "../types";

type ExtractTypeS<T> = T extends EventType<infer U> ? U : never;

export type ExtractTypesFromArrayS<T extends EventType<any>[]> = {
  [K in keyof T]: ExtractTypeS<T[K]>;
};

const isAllFilled = (keysFilled: Set<string>, keysKnown: Set<string>) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};

export class All<const T extends EventType[]>
  implements EventType<ExtractTypesFromArrayS<T>>
{
  private keysKnown: Set<string>;
  private keysFilled = new Set<string>();
  private $infos: T;
  private result: Record<string, unknown> = {};

  public constructor(...theInfos: T) {
    this.keysKnown = new Set<string>(Object.keys(theInfos));
    this.$infos = theInfos;
  }

  public event(user: EventUserType<ExtractTypesFromArrayS<T>>): this {
    Object.entries(this.$infos).forEach(([key, info]) => {
      this.keysKnown.add(key);
      info.event(this.user.child(user, key));
    });
    return this;
  }

  private user = new ParentUser((v: T, child: EventUserType, key: string) => {
    this.keysFilled.add(key);
    this.result[key] = v;
    if (isAllFilled(this.keysFilled, this.keysKnown)) {
      child.use(Object.values(this.result) as ExtractTypesFromArrayS<T>);
    }
  });
}
