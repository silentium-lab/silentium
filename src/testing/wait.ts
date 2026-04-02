export const wait = (ms: number) =>
  new Promise(function waitExecutor(resolve) {
    setTimeout(function waitTimeout() {
      resolve(1);
    }, ms);
  });
