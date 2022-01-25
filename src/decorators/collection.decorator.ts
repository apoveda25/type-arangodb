import 'reflect-metadata';
import {
  ICollectionOptions,
  ICollectionOptionsMetadata,
} from '../interfaces/collection.interface';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';

export function Collection(): ClassDecoratorType;
export function Collection(name: string): ClassDecoratorType;
export function Collection(options: ICollectionOptions): ClassDecoratorType;
export function Collection(
  nameOrOptions?: string | ICollectionOptions,
): ClassDecoratorType {
  return function (target: Function) {
    const options: ICollectionOptionsMetadata =
      typeof nameOrOptions === 'string'
        ? { name: nameOrOptions, type: 'document' }
        : typeof nameOrOptions === 'object'
        ? {
            ...nameOrOptions,
            name: nameOrOptions.name ? nameOrOptions.name : target.name,
          }
        : { name: target.name, type: 'document' };

    const collection: ICollectionOptionsMetadata =
      Reflect.getOwnMetadata(ARANGO_COLLECTION, target.prototype) || {};

    Reflect.defineMetadata(
      ARANGO_COLLECTION,
      { ...collection, ...options },
      target.prototype,
    );
  };
}
