import { EventType, TransportType } from "../types";

/**
 * Creates a transport that merges additional arguments into the base transport's arguments
 * at a specified index position, allowing for flexible argument composition
 */
export function TransportArgs(
  baseTransport: TransportType<any[], EventType>,
  args: unknown[],
  startFromArgIndex: number = 0,
) {
  return new TransportArgsImpl(baseTransport, args, startFromArgIndex);
}

export class TransportArgsImpl
  implements TransportType<unknown[], EventType<unknown>>
{
  public constructor(
    private baseTransport: TransportType<any[], EventType>,
    private args: unknown[],
    private startFromArgIndex: number = 0,
  ) {}

  public use(runArgs: unknown[]): EventType<unknown> {
    return this.baseTransport.use(
      mergeAtIndex(runArgs, this.args, this.startFromArgIndex),
    );
  }
}

function mergeAtIndex(arr1: unknown[], arr2: unknown[], index: number) {
  const result = arr1.slice(0, index);
  while (result.length < index) result.push(undefined);
  return result.concat(arr2);
}
