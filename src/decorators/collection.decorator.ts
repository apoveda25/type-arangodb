import { CollectionType } from 'arangojs';
import {
  IArangoCollectionDecoratorOptions,
  IArangoCreateCollectionOptions,
} from '..';
import { ArangoStore } from '../metadata.store';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';

export function Collection(): ClassDecoratorType;
export function Collection(name: string): ClassDecoratorType;
export function Collection(
  options: IArangoCollectionDecoratorOptions,
): ClassDecoratorType;
export function Collection(
  nameOrOptions?: string | IArangoCollectionDecoratorOptions,
): ClassDecoratorType {
  return function (target: Function) {
    const options: IArangoCreateCollectionOptions =
      typeof nameOrOptions === 'string'
        ? { name: nameOrOptions, type: CollectionType.DOCUMENT_COLLECTION }
        : typeof nameOrOptions === 'object'
        ? {
            ...nameOrOptions,
            name: nameOrOptions.name ? nameOrOptions.name : target.name,
          }
        : {
            name: target.name,
            type: CollectionType.DOCUMENT_COLLECTION,
          };

    const collection =
      ArangoStore.getMetadata<IArangoCreateCollectionOptions>(
        ARANGO_COLLECTION,
        target.prototype,
      ) ?? {};

    ArangoStore.setMetadata<IArangoCreateCollectionOptions>(
      ARANGO_COLLECTION,
      target.prototype,
      {
        ...collection,
        ...options,
      },
    );
  };
}
