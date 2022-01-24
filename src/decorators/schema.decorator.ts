import { ValidationLevel } from 'arangojs/collection';
import 'reflect-metadata';
import {
  ISchemaOptions,
  ISchemaOptionsMetadata,
} from '../interfaces/schema.interface';
import { ARANGO_SCHEMA } from '../type-arangodb.constant';

export function Schema(level: ValidationLevel): ClassDecoratorType;
export function Schema(options: ISchemaOptions): ClassDecoratorType;
export function Schema(
  levelOrOptions: ValidationLevel | ISchemaOptions,
): ClassDecoratorType {
  return function (target: Function) {
    const options: ISchemaOptions =
      typeof levelOrOptions === 'string'
        ? { level: levelOrOptions }
        : { ...levelOrOptions };

    const { additionalProperties } = options;
    delete options.additionalProperties;

    const optionsDefault: ISchemaOptionsMetadata =
      typeof levelOrOptions === 'string'
        ? {
            level: levelOrOptions,
            rule: {
              properties: {},
              additionalProperties: { type: additionalProperties ?? 'null' },
            },
          }
        : {
            ...levelOrOptions,
            rule: {
              properties: {},
              additionalProperties: { type: additionalProperties ?? 'null' },
            },
          };

    const schema: ISchemaOptionsMetadata =
      Reflect.getOwnMetadata(ARANGO_SCHEMA, target.prototype) || {};

    Reflect.defineMetadata(
      ARANGO_SCHEMA,
      { ...schema, ...optionsDefault },
      target.prototype,
    );
  };
}
