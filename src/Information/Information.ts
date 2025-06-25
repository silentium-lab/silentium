import { Owner } from "../Owner/Owner";
import { InformationDataType } from "../types/InformationType";

type InfoExecutorType<T> = (g: Owner<T>) => (() => void | undefined) | void;
type InfoObjectType<T> = {
  value: InfoExecutorType<T>;
};

type InformationExecutedCb<T> = (g: Owner<T>) => void;

/**
 * Main information representation
 * https://silentium-lab.github.io/silentium/#/en/information
 */
export class Information<T = any> {
  private static instances = 0;
  private theSubInfos: Information<unknown>[] = [];
  private destructor?: () => void;
  private owner?: Owner<T>;
  private executedCbs?: InformationExecutedCb<T>[];
  private alreadyExecuted = false;

  public constructor(
    private info?:
      | InfoObjectType<T>
      | InfoExecutorType<T>
      | InformationDataType<T>,
    private theName = "unknown",
    private onlyOneOwner = true,
  ) {
    Information.instances += 1;
  }

  /**
   * Следующее значение источника
   */
  private next(value: T) {
    if (this.owner !== undefined) {
      this.owner.give(value);
    }
    return this;
  }

  /**
   * Возможность гостю получить информацию от источника
   */
  public value(owner: Owner<T>) {
    if (this.onlyOneOwner && this.owner !== undefined) {
      throw new Error(`owner already connected to info ${this.name()}`);
    }

    this.owner = owner;
    if (this.executedCbs !== undefined && !this.alreadyExecuted) {
      this.executedCbs.forEach((cb) => cb(owner));
      this.alreadyExecuted = true;
    }

    if (this.info === undefined) {
      return this;
    }

    if (typeof this.info === "function") {
      const mbDestructor = this.info(owner);
      if (
        this.destructor === undefined &&
        mbDestructor !== undefined &&
        this.info !== mbDestructor &&
        typeof mbDestructor === "function"
      ) {
        this.destructor = mbDestructor as () => void;
      }
    } else if (
      typeof this.info === "object" &&
      this.info !== null &&
      "value" in this.info &&
      typeof this.info.value === "function"
    ) {
      this.info.value(owner);
    } else {
      this.next(this.info as T);
    }

    return this;
  }

  /**
   * Ability to destroy the information info
   */
  public destroy() {
    while (this.theSubInfos.length > 0) {
      const subInfo = this.theSubInfos.shift();
      subInfo?.destroy();
    }
    if (this.destructor) {
      this.destructor();
    }
    this.owner = undefined;
    this.executedCbs = undefined;
    this.destructor = undefined;
    return this;
  }

  /**
   * The ability to link another info to the current info
   */
  public subInfo(info: Information<any>) {
    this.theSubInfos.push(info);
    return this;
  }

  public subInfos() {
    return this.theSubInfos;
  }

  public name() {
    return `#info_${this.theName}_${Information.instances}`;
  }

  public executed(cb: InformationExecutedCb<T>) {
    if (!this.executedCbs) {
      this.executedCbs = [];
    }
    this.executedCbs.push(cb);
    if (this.alreadyExecuted && this.owner !== undefined) {
      cb(this.owner);
    }
    return this;
  }

  public hasOwner(): boolean {
    return !!this.owner;
  }
}

export const I = <T>(
  info?: InfoObjectType<T> | InfoExecutorType<T> | InformationDataType<T>,
  theName = "unknown",
  onlyOneOwner = true,
) => new Information(info, theName, onlyOneOwner);
