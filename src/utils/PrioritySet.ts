interface PriorityItem<T> {
  value: T;
  priority: number;
}

class PrioritySet<T> {
  private items: Map<T, PriorityItem<T>>;
  private sortedItems: PriorityItem<T>[];

  public constructor() {
    this.items = new Map();
    this.sortedItems = [];
  }

  private findInsertPosition(priority: number): number {
    let left = 0;
    let right = this.sortedItems.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.sortedItems[mid].priority > priority) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return left;
  }

  private findItemIndex(value: T): number {
    return this.sortedItems.findIndex((item) => item.value === value);
  }

  public add(value: T, priority: number = 100): this {
    const existingItem = this.items.get(value);

    if (existingItem) {
      if (existingItem.priority !== priority) {
        const oldIndex = this.findItemIndex(value);
        if (oldIndex !== -1) {
          this.sortedItems.splice(oldIndex, 1);
        }

        existingItem.priority = priority;

        const newIndex = this.findInsertPosition(priority);
        this.sortedItems.splice(newIndex, 0, existingItem);
      }
    } else {
      const newItem: PriorityItem<T> = { value, priority };

      this.items.set(value, newItem);

      const insertIndex = this.findInsertPosition(priority);
      this.sortedItems.splice(insertIndex, 0, newItem);
    }

    return this;
  }

  public delete(value: T): boolean {
    const item = this.items.get(value);
    if (!item) {
      return false;
    }

    this.items.delete(value);

    const index = this.findItemIndex(value);
    if (index !== -1) {
      this.sortedItems.splice(index, 1);
    }

    return true;
  }

  public has(value: T): boolean {
    return this.items.has(value);
  }

  public get size(): number {
    return this.items.size;
  }

  public clear(): void {
    this.items.clear();
    this.sortedItems = [];
  }

  public getPriority(value: T): number | undefined {
    const item = this.items.get(value);
    return item?.priority;
  }

  public setPriority(value: T, priority: number): boolean {
    if (this.items.has(value)) {
      this.add(value, priority); // Переиспользуем логику add для обновления
      return true;
    }
    return false;
  }

  public forEach(
    callback: (value: T, priority: number, set: this) => void,
  ): void {
    this.sortedItems.forEach((item) => {
      callback(item.value, item.priority, this);
    });
  }

  public values(): IterableIterator<T> {
    const values = this.sortedItems.map((item) => item.value);
    return values[Symbol.iterator]();
  }

  public entries(): IterableIterator<[T, number]> {
    const entries = this.sortedItems.map(
      (item) => [item.value, item.priority] as [T, number],
    );
    return entries[Symbol.iterator]();
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }

  public toArray(): T[] {
    return this.sortedItems.map((item) => item.value);
  }

  public toArrayWithPriorities(): Array<{ value: T; priority: number }> {
    return [...this.sortedItems];
  }

  public debug(): void {
    console.log("Map size:", this.items.size);
    console.log("Sorted array length:", this.sortedItems.length);
    console.log("Sorted items:", this.sortedItems);
  }
}

export default PrioritySet;
