export interface LazyType<T> {
  get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

/**
 * Helps to get lazy instance of dependency
 * @url https://silentium-lab.github.io/silentium/#/utils/lazy
 */
export const lazy = <T>(buildingFn: (...args: any[]) => T): LazyType<T> => {
  if (buildingFn === undefined) {
    throw new Error("lazy didn't receive buildingFn argument");
  }

  return {
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT {
      return buildingFn(...args) as CT extends null ? T : CT;
    },
  };
};
