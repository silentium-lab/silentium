export type NamedType = {
  name: string;
};

/**
 * Helps to bind name to object or function
 */
export const withName = <T>(obj: T, name: string): T & NamedType => {
  return new Proxy(obj as any, {
    get(target, field) {
      if (field === "name") {
        return name;
      }

      return (target as any)[field];
    },
  }) as T & NamedType;
};
