type ownerIntroduction = "owner" | "patron";

export type OwnerExecutorType<T = any, This = void> = (value: T) => This;

export interface OwnerObjectType<T = any> {
  give(value: T): this;
  introduction?(): ownerIntroduction;
}

export type OwnerType<T = any> = OwnerExecutorType<T> | OwnerObjectType<T>;
