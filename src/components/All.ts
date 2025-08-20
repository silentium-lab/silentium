import { From, TheInformation, TheOwner } from "../base";

type ExtractTypeS<T> = T extends TheInformation<infer U> ? U : never;

export type ExtractTypesFromArrayS<T extends TheInformation<any>[]> = {
  [K in keyof T]: ExtractTypeS<T[K]>;
};

/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
export class All<const T extends TheInformation[]> extends TheInformation<
  ExtractTypesFromArrayS<T>
> {
  private keysKnown: Set<string>;
  private keysFilled = new Set();
  private infos: T;

  public constructor(...theInfos: T) {
    super(theInfos);
    this.infos = theInfos;
    this.keysKnown = new Set<string>(Object.keys(theInfos));
  }

  public value(o: TheOwner<ExtractTypesFromArrayS<T>>): this {
    const result: Record<string, unknown> = {};

    Object.entries(this.infos).forEach(([key, info]) => {
      this.keysKnown.add(key);
      info.value(
        new From((v) => {
          this.keysFilled.add(key);
          result[key] = v;
          if (this.isAllFilled()) {
            o.give(Object.values(result) as ExtractTypesFromArrayS<T>);
          }
        }),
      );
    });
    return this;
  }

  private isAllFilled() {
    return (
      this.keysFilled.size > 0 && this.keysFilled.size === this.keysKnown.size
    );
  }
}
