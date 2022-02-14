import { IArangoRule } from '..';
import { ArangoStore } from '../metadata.store';
import { ARANGO_RULES } from '../type-arangodb.constant';
import { ArangoPropertyDecoratorOptions } from '../types/properties.type';

export function Property(type: SchemaType): PropertyDecoratorType;
export function Property(
  options: ArangoPropertyDecoratorOptions,
): PropertyDecoratorType;
export function Property(
  typeOrOptions: SchemaType | ArangoPropertyDecoratorOptions,
): PropertyDecoratorType {
  return function (target: Object, field: string) {
    const { requiredField, ...optionsProperties } =
      typeof typeOrOptions === 'string'
        ? { requiredField: false, type: typeOrOptions }
        : typeOrOptions;

    const options: IArangoRule = {
      properties: {
        [field]: { ...optionsProperties },
      },
      required: requiredField ? [field] : [],
    } as IArangoRule;

    const rulesMetadata = ArangoStore.getMetadata<IArangoRule>(
      ARANGO_RULES,
      target,
    ) ?? { properties: {} };

    const rulesCreate: IArangoRule = {
      properties: {
        ...rulesMetadata.properties,
        ...options.properties,
      },
      required: [
        ...(rulesMetadata.required ?? []),
        ...(options.required ?? []),
      ],
    };

    ArangoStore.setMetadata(ARANGO_RULES, target, rulesCreate);
  };
}
