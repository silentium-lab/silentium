export interface PersonalType<T> {
  get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

/**
 * Helps to get personal instance of dependency
 * @url https://silentium-lab.github.io/silentium/#/utils/private
 */
export const personal = <T>(
  buildingFn: (...args: any[]) => T,
): PersonalType<T> => {
  if (buildingFn === undefined) {
    throw new Error("personal didn't receive buildingFn argument");
  }

  return {
    get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT {
      return buildingFn(...args) as CT extends null ? T : CT;
    },
  };
};
