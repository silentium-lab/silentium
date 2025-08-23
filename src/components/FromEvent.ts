import { DestroyFunc } from "../base/DestroyFunc";
import { From, Of, TheInformation, TheOwner } from "../base";
import { All } from "./All";

/**
 * A component that receives data from an event and
 * presents it as an information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-event
 */
export class FromEvent<T = unknown> extends TheInformation<T> {
  public constructor(
    private emitterSrc: TheInformation<any>,
    private eventNameSrc: TheInformation<string>,
    private subscribeMethodSrc: TheInformation<string>,
    private unsubscribeMethodSrc: TheInformation<string> = new Of(""),
  ) {
    super([emitterSrc, eventNameSrc, subscribeMethodSrc, unsubscribeMethodSrc]);
  }

  public value(o: TheOwner<T>): this {
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
