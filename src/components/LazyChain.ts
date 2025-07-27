import { InformationType, LazyType } from "../types";
import { chain } from "./Chain";

/**
 * Helps to chain lazy info after
 * another lazy info
 */
export const lazyChain = <T>(
  lazy: LazyType<T>,
  chainSrc: InformationType<T>,
): LazyType<T> => {
  return (...args) => {
    const baseSrc = lazy(...args);
    return chain(chainSrc, baseSrc);
  };
};
