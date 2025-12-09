export {};

declare global {
  interface GlobalThis {
    silentiumValue: (value: any) => any;
  }

  function silentiumValue(value: any): any;
}
