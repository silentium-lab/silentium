import { GuestType } from "../types/GuestType";

export type SourceExecutorType<T, R = unknown> = (guest: GuestType<T>) => R;

export interface SourceObjectType<T> {
  value: SourceExecutorType<T>;
}

export type SourceDataType<T> = Extract<
  T,
  string | number | boolean | Date | object | Array<unknown> | symbol
>;

export type SourceType<T = any> =
  | SourceExecutorType<T>
  | SourceObjectType<T>
  | SourceDataType<T>;
