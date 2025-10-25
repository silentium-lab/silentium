import { EventType, TransportType } from "../types";

export class TransportArgs implements TransportType {
  public constructor(
    private baseTransport: TransportType<any[], EventType>,
    private args: unknown[],
    private startFromArgIndex: number = 0,
  ) {}

  public of(...runArgs: unknown[]): EventType<unknown> {
    return this.baseTransport.of(
      ...mergeAtIndex(runArgs, this.args, this.startFromArgIndex),
    );
  }
}

function mergeAtIndex(arr1: unknown[], arr2: unknown[], index: number) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(undefined);
  return result.concat(arr2);
}
