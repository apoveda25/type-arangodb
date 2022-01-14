import 'reflect-metadata';
import {
  IClassDecoratorOptions,
  IClassDecoratorOptionsDefault,
} from '../interfaces/options.interface';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';

export function Collection(): ClassDecoratorType;
export function Collection(name: string): ClassDecoratorType;
export function Collection(
  name: string,
  options: IClassDecoratorOptions,
): ClassDecoratorType;
export function Collection(
  name?: string,
  options: IClassDecoratorOptions = {
    type: 'document',
    waitForSync: false,
  },
): ClassDecoratorType {
  return function (target: Function) {
    const optionsDefault: IClassDecoratorOptionsDefault = {
      name: name ? name : target.name,
      ...options,
    };

    const collections =
      Reflect.getOwnMetadata(ARANGO_COLLECTION, target.prototype) || [];
    collections.push(optionsDefault);

    Reflect.defineMetadata(ARANGO_COLLECTION, collections, target.prototype);
  };
}
