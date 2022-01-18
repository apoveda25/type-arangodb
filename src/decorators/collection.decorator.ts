import 'reflect-metadata';
import {
  IClassDecoratorOptions,
  IClassDecoratorOptionsDefault,
} from '../interfaces/class-options.interface';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';

export function Collection(): ClassDecoratorType;
export function Collection(name: string): ClassDecoratorType;
export function Collection(
  name: string,
  options: Partial<IClassDecoratorOptions>,
): ClassDecoratorType;
export function Collection(
  name?: string,
  options: Partial<IClassDecoratorOptions> = {
    type: 'document',
    waitForSync: false,
    schema: { message: '', level: 'none', additionalProperties: 'null' },
  },
): ClassDecoratorType {
  return function (target: Function) {
    const {
      type = 'document',
      waitForSync = false,
      schema = { message: '', level: 'none', additionalProperties: 'null' },
    } = options;

    const {
      message = '',
      level = 'none',
      additionalProperties = 'null',
    } = schema;

    const optionsDefault: IClassDecoratorOptionsDefault = {
      name: name ? name : target.name,
      type,
      waitForSync,
      schema: {
        message,
        level,
        rule: {
          properties: {},
          additionalProperties: { type: additionalProperties },
          required: [],
        },
      },
    };

    const collections: IClassDecoratorOptionsDefault[] =
      Reflect.getOwnMetadata(ARANGO_COLLECTION, target.prototype) || [];
    collections.push(optionsDefault);

    Reflect.defineMetadata(ARANGO_COLLECTION, collections, target.prototype);
  };
}
