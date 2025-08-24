import { DestroyFunc } from "../base/DestroyFunc";
import { From, InformationType, Of, OwnerType, TheInformation } from "../base";
import { All } from "./All";

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
export class FromEvent<T = unknown> extends TheInformation<T> {
  public constructor(
    private emitterSrc: InformationType<any>,
    private eventNameSrc: InformationType<string>,
    private subscribeMethodSrc: InformationType<string>,
    private unsubscribeMethodSrc: InformationType<string> = new Of(""),
  ) {
    super(emitterSrc, eventNameSrc, subscribeMethodSrc, unsubscribeMethodSrc);
  }

  public value(o: OwnerType<T>): this {
    const a = new All(
      this.emitterSrc,
      this.eventNameSrc,
      this.subscribeMethodSrc,
      this.unsubscribeMethodSrc,
    );
    const handler = (v: T) => {
      o.give(v);
    };
    a.value(
      new From(([emitter, eventName, subscribe, unsubscribe]) => {
        emitter[subscribe](eventName, handler);
        this.addDep(
          new DestroyFunc(() => {
            emitter[unsubscribe](eventName, handler);
          }),
        );
      }),
    );
    return this;
  }
}
