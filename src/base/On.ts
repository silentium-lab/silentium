import { DataType, DataUserType } from "../types";

/**
 * Run data with user
 */
export const on = <T>(src: DataType<T>, user: DataUserType<T>) => src(user);
