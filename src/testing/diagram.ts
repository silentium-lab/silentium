import { From } from "../base";

/**
 * Помогает отлаживать поток ответов от источников информации
 * в виде текстовой диаграммы
 */
export class Diagram {
  private responses: any[] = [];
  private theOwner = new From((v) => {
    this.responses.push(v);
  });

  public constructor(private joinSymbol = "|") {}

  public toString(): string {
    return this.responses.join(this.joinSymbol);
  }

  public owner() {
    return this.theOwner;
  }
}
