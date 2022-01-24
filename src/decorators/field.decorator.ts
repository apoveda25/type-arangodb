import 'reflect-metadata';
import {
  IFieldDecoratorTypeArray,
  IFieldDecoratorTypeBoolean,
  IFieldDecoratorTypeNumber,
  IFieldDecoratorTypeObject,
  IFieldDecoratorTypeString,
  IRuleOptionsMetadata,
} from '../interfaces/field.interface';
import { ARANGO_FIELD } from '../type-arangodb.constant';

export function Field(type: SchemaType): PropertyDecoratorType;
export function Field(
  options:
    | IFieldDecoratorTypeBoolean
    | IFieldDecoratorTypeNumber
    | IFieldDecoratorTypeString
    | IFieldDecoratorTypeArray
    | IFieldDecoratorTypeObject,
): PropertyDecoratorType;
export function Field(
  typeOrOptions:
    | SchemaType
    | IFieldDecoratorTypeBoolean
    | IFieldDecoratorTypeNumber
    | IFieldDecoratorTypeString
    | IFieldDecoratorTypeArray
    | IFieldDecoratorTypeObject,
): PropertyDecoratorType {
  return function (target: Function | Object, field: string) {
    const options =
      typeof typeOrOptions === 'string'
        ? { type: typeOrOptions, requiredField: false }
        : typeOrOptions;

    const { requiredField } = options;
    delete options.requiredField;

    const fieldsOptions = { [field]: options } as Record<
      string,
      | IFieldDecoratorTypeBoolean
      | IFieldDecoratorTypeNumber
      | IFieldDecoratorTypeString
      | IFieldDecoratorTypeArray
      | IFieldDecoratorTypeObject
    >;

    const fieldsMetadata: IRuleOptionsMetadata = Reflect.getOwnMetadata(
      ARANGO_FIELD,
      target.constructor.prototype,
    ) || { properties: {} };

    const rulesField: IRuleOptionsMetadata = {
      properties: {
        ...fieldsMetadata.properties,
        ...fieldsOptions,
      },
      required: [
        ...(fieldsMetadata.required ?? []),
        ...(requiredField ? [field] : []),
      ],
    };

    Reflect.defineMetadata(
      ARANGO_FIELD,
      rulesField,
      target.constructor.prototype,
    );
  };
}
