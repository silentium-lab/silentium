import { OwnerExecutorType } from "../types/OwnerType";

type OwnerDebugCB = (...data: unknown[]) => void;

/**
 * Information owner, if information
 * has owner than information executed
 * https://silentium-lab.github.io/silentium/#/en/owner
 */
export class Owner<T = any> {
  private cbs: OwnerDebugCB[] = [];

  public constructor(
    private ownerFn: OwnerExecutorType<T>,
    private errorFn?: (cause: unknown) => void,
    private disposedFn?: () => boolean,
  ) {}

  public give(value: T) {
    this.doDebug("value", value);
    if (!this.disposed()) {
      this.ownerFn(value);
    }
    return this;
  }

  public error(cause: unknown) {
    this.doDebug("error", cause);
    if (this.errorFn !== undefined) {
      this.errorFn(cause);
    }
    return this;
  }

  public disposed() {
    return this.disposedFn !== undefined ? this.disposedFn() : false;
  }

  public debug(cb: OwnerDebugCB) {
    this.cbs.push(cb);
    return this;
  }

  private doDebug(...data: unknown[]) {
    this.cbs.forEach((cb) => cb(...data));
  }
}

export const O = <T>(ownerFn: OwnerExecutorType<T>) => new Owner(ownerFn);
