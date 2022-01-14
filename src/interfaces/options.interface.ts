export interface IClassDecoratorOptions {
  type: CollectionType;
  waitForSync: boolean;
}

export interface IClassDecoratorOptionsDefault extends IClassDecoratorOptions {
  name: string;
}
