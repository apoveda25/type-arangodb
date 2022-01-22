import 'reflect-metadata';
import { ISchemaOptions } from '../interfaces/schema.interface';
import { ARANGO_SCHEMA } from '../type-arangodb.constant';

export function Schema(level: SchemaLevel): ClassDecoratorType;
export function Schema(options: ISchemaOptions): ClassDecoratorType;
export function Schema(
  levelOrOptions: SchemaLevel | ISchemaOptions,
): ClassDecoratorType {
  const optionsDefault: ISchemaOptions =
    typeof levelOrOptions === 'string'
      ? { level: levelOrOptions }
      : levelOrOptions;

  return function (target: Function) {
    const schema: ISchemaOptions =
      Reflect.getOwnMetadata(ARANGO_SCHEMA, target.prototype) || {};

    Reflect.defineMetadata(
      ARANGO_SCHEMA,
      { ...schema, ...optionsDefault },
      target.prototype,
    );
  };
}