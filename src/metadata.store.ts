export class ArangoStore {
  private readonly _metadata: Record<string, WeakMap<Function | object, any>> =
    {};

  setMetadata<T>(key: string, target: Function | object, value: T): void {
    const existingMetadata = this._metadata[key] ?? new WeakMap();

    existingMetadata.set(target, value);

    this._metadata[key] = existingMetadata;
  }

  getMetadata<T>(key: string, target: Function | object): T {
    return this._metadata[key]?.get(target);
  }
}
