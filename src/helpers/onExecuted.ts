/**
 * Helps to run callback only once
 * when information was executed at first time
 */
export const onExecuted = (fn: (...args: any[]) => void) => {
  let executed = false;
  return (...args: unknown[]) => {
    if (!executed) {
      fn(...args);
    }
    executed = true;
  };
};
