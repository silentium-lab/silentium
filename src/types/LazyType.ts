export interface LazyType<T> {
  get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}
