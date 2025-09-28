import { DataUserType } from "./DataUserType";

export type DestructorType = () => void;
export type DataType<T = unknown> = (
  user: DataUserType<T>,
) => DestructorType | void;

type ExcludeVoidFromReturnType<F extends (...args: any[]) => any> = F extends (
  ...args: infer Args
) => infer Return
  ? (...args: Args) => Exclude<Return, void>
  : never;

export type DataTypeDestroyable<T = unknown> = ExcludeVoidFromReturnType<
  DataType<T>
>;

export interface DestroyableType {
  destroy: DestructorType;
}

export type DataTypeValue<T> = T extends DataType<infer U> ? U : never;
