import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * Creates a tap that merges additional arguments into the base tap's arguments
 * at a specified index position, allowing for flexible argument composition
 */
export function TapArgs(
  baseTap: TapType<any[], MessageType>,
  args: unknown[],
  startFromArgIndex: number = 0,
) {
  return new TapArgsImpl(baseTap, args, startFromArgIndex);
}

export class TapArgsImpl implements TapType<unknown[], MessageType<unknown>> {
  public constructor(
    private baseTap: TapType<any[], MessageType>,
    private args: unknown[],
    private startFromArgIndex: number = 0,
  ) {}

  public use(runArgs: unknown[]): MessageType<unknown> {
    return this.baseTap.use(
      mergeAtIndex(runArgs, this.args, this.startFromArgIndex),
    );
  }
}

function mergeAtIndex(arr1: unknown[], arr2: unknown[], index: number) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(undefined);
  return result.concat(arr2);
}
