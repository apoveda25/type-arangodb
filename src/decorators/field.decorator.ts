import 'reflect-metadata';
import { IRule } from '../interfaces/class-options.interface';
import {
  IBasePropertyDecoratorTypeArray,
  IBasePropertyDecoratorTypeNumber,
  IBasePropertyDecoratorTypeObject,
  IBasePropertyDecoratorTypeString,
} from '../interfaces/property-options.interface';
import { ARANGO_PROPERTIES } from '../type-arangodb.constant';

export function Field(type: SchemaType): PropertyDecoratorType;
export function Field(
  options:
    | IBasePropertyDecoratorTypeNumber
    | IBasePropertyDecoratorTypeString
    | IBasePropertyDecoratorTypeArray
    | IBasePropertyDecoratorTypeObject,
): PropertyDecoratorType;
export function Field(
  typeOrOptions:
    | SchemaType
    | IBasePropertyDecoratorTypeNumber
    | IBasePropertyDecoratorTypeString
    | IBasePropertyDecoratorTypeArray
    | IBasePropertyDecoratorTypeObject,
): PropertyDecoratorType {
  return function (target: Function | Object, property: string) {
    const options =
      typeof typeOrOptions === 'string'
        ? { type: typeOrOptions, requiredField: false }
        : typeOrOptions;

    const { requiredField } = options;
    delete options.requiredField;

    const properties = { ...options };

    const propertiesMetadata: IRule[] = Reflect.getOwnMetadata(
      ARANGO_PROPERTIES,
      target.constructor.prototype,
    ) || [{ properties: {}, required: [] }];

    propertiesMetadata[0] = {
      properties: {
        ...propertiesMetadata[0].properties,
        [property]: properties,
      },
      required: [
        ...(propertiesMetadata[0].required ?? []),
        ...(requiredField ? [property] : []),
      ],
    };

    Reflect.defineMetadata(
      ARANGO_PROPERTIES,
      propertiesMetadata,
      target.constructor.prototype,
    );
  };
}
