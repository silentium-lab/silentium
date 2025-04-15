import { GuestType } from "../Guest/Guest";
import { GuestSync } from "../Guest/GuestSync";
import { Patron } from "../Patron/Patron";
import { SourceObjectType, SourceType, value } from "../Source/Source";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-sync
 */
export class SourceSync<T> implements SourceObjectType<T> {
  private syncGuest = new GuestSync();

  public constructor(private baseSource: SourceType<T>) {
    value(baseSource, new Patron(this.syncGuest));
  }

  public value(guest: GuestType<T>) {
    value(this.baseSource, guest);
    return this;
  }

  public syncValue() {
    try {
      return this.syncGuest.value();
    } catch {
      throw new Error("No value in SourceSync");
    }
  }
}
