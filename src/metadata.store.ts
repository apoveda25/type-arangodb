export class ArangoStore {
  private static readonly _metadata: Record<string, WeakMap<object, any>> = {};

  static setMetadata<T>(key: string, target: object, value: T): void {
    const existingMetadata = this._metadata[key] ?? new WeakMap();

    existingMetadata.set(target, value);

    this._metadata[key] = existingMetadata;
  }

  static getMetadata<T>(key: string, target: object): T {
    return this._metadata[key]?.get(target);
  }
}
