import { OwnerType } from "./OwnerType";

export type InformationExecutorType<T, R = unknown> = (
  owner: OwnerType<T>,
) => R;

export interface InformationObjectType<T> {
  value: InformationExecutorType<T>;
}

export type InformationDataType<T> = Extract<
  T,
  string | number | boolean | Date | object | Array<unknown> | symbol
>;

export type InformationType<T = any> =
  | InformationExecutorType<T>
  | InformationObjectType<T>
  | InformationDataType<T>;
