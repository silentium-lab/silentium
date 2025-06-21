export const decorated = <T>(
  target: T,
  methods: Record<string | symbol, (...args: any[]) => any>,
): T => {
  return new Proxy(target as any, {
    get(target, field) {
      if (typeof methods[field] === "function") {
        return methods[field];
      }

      return (target as any)[field];
    },
  });
};
