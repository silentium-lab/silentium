type ConstructableType = { new (...args: any[]): any };

export function ComponentClass<T extends ConstructableType>(
  classConstructor: T,
): (...args: ConstructorParameters<T>) => InstanceType<T> {
  return (...args) => new classConstructor(...args);
}
