import { DebugCbType } from "src/types";
import { OwnerExecutorType } from "../types/OwnerType";

/**
 * Information owner, if information
 * has owner than information executed
 * https://silentium-lab.github.io/silentium/#/en/owner
 */
export class Owner<T = any> {
  private debugCbs: DebugCbType[] = [];

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

  public debug(cb: DebugCbType) {
    this.debugCbs.push(cb);
    return this;
  }

  private doDebug(...data: unknown[]) {
    this.debugCbs.forEach((cb) => cb(...data));
  }
}

export const O = <T>(ownerFn: OwnerExecutorType<T>) => new Owner(ownerFn);
