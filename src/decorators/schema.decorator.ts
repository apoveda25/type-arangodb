import { ValidationLevel } from 'arangojs/collection';
import { IArangoCreateSchemaOptions, IArangoSchemaDecoratorOptions } from '..';
import { ArangoStore } from '../metadata.store';
import { ARANGO_SCHEMA } from '../type-arangodb.constant';
import { ClassDecoratorType } from '../types';

export function Schema(level: ValidationLevel): ClassDecoratorType;
export function Schema(
  options: IArangoSchemaDecoratorOptions,
): ClassDecoratorType;
export function Schema(
  levelOrOptions: ValidationLevel | IArangoSchemaDecoratorOptions,
): ClassDecoratorType {
  return function (target: Function) {
    const options: IArangoCreateSchemaOptions =
      typeof levelOrOptions === 'string'
        ? {
            level: levelOrOptions,
            rule: { properties: {} },
          }
        : {
            message: levelOrOptions.message,
            level: levelOrOptions.level,
            rule: {
              properties: {},
              additionalProperties: levelOrOptions.additionalProperties
                ? {
                    type: levelOrOptions.additionalProperties,
                  }
                : null,
            },
          };

    const schema =
      ArangoStore.getMetadata<IArangoCreateSchemaOptions>(
        ARANGO_SCHEMA,
        target.prototype,
      ) ?? {};

    ArangoStore.setMetadata(ARANGO_SCHEMA, target.prototype, {
      ...schema,
      ...options,
    });
  };
}
