import { OwnerExecutorType } from "../types/OwnerType";

/**
 * Information owner, if information
 * has owner than information executed
 * https://silentium-lab.github.io/silentium/#/en/owner
 */
export class Owner<T = any> {
  public constructor(
    private ownerFn: OwnerExecutorType<T>,
    private errorFn?: (cause: unknown) => void,
    private disposedFn?: () => boolean,
  ) {}

  public give(value: T) {
    if (!this.disposed()) {
      this.ownerFn(value);
    }
    return this;
  }

  public error(cause: unknown) {
    if (this.errorFn !== undefined) {
      this.errorFn(cause);
    }

    return this;
  }

  public disposed() {
    return this.disposedFn !== undefined ? this.disposedFn() : false;
  }
}

export const O = <T>(ownerFn: OwnerExecutorType<T>) => new Owner(ownerFn);
