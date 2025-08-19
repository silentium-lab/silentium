export const destroyArr = (arr: unknown[]) => {
  arr.forEach((item) => {
    if (typeof item === "function") {
      item();
    }
  });
};
