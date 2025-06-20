type GuestIntroduction = "guest" | "patron";

export type GuestExecutorType<T = any, This = void> = (value: T) => This;

export interface GuestObjectType<T = any> {
  give(value: T): this;
  introduction?(): GuestIntroduction;
}

export type GuestType<T = any> = GuestExecutorType<T> | GuestObjectType<T>;
