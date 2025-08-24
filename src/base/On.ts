import { Destroyable } from "../base/Destroyable";
import { From } from "../base/From";
import { InformationType } from "../base/TheInformation";
import { Void } from "../base/Void";

/**
 * Run information with functional owner if needed
 */
export class On<T = unknown> extends Destroyable {
  public constructor(src: InformationType<T>, fn?: (value: T) => void) {
    super(src, fn);
    src.value(fn ? new From(fn) : new Void());
  }
}
