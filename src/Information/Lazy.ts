import { O } from "../Owner";
import { LazyType } from "../types/LazyType";
import { Information } from "./Information";

/**
 * Helps in the process of executing information to create
 * a new information object and also destroy it if
 * destruction information is received
 * https://silentium-lab.github.io/silentium/#/en/information/lazy
 */
export const lazyS = <T>(
  lazyI: LazyType<Information<T>>,
  destroyI?: Information<unknown>,
) => {
  const info = new Information<T>((g) => {
    const instance = lazyI.get();
    info.subInfo(instance);
    instance.value(g);
  });

  if (destroyI) {
    info.subInfo(destroyI);
    destroyI.value(
      O(() => {
        info.destroy();
      }),
    );
  }

  return info;
};
