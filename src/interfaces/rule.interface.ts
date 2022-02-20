import { SchemaType } from '../types';
import { ArangoCreatePropertiesOptions } from '../types/properties.type';

export interface IArangoSchemaRulePropertyBase {
  /**
   * Data type to validate the property in the body of the documents of each collection.
   */
  type: SchemaType;

  /**
   * The value of this keyword MUST be an array. This array SHOULD have at least one element. Elements in the array SHOULD be unique.
   */
  enum?: any[];

  /**
   * The value of this keyword MAY be of any type, including null.
   */
  const?: any;
}

export interface IArangoSchemaRulePropertyBoolean
  extends IArangoSchemaRulePropertyBase {
  type: 'boolean';
}

export interface IArangoSchemaRulePropertyNumber
  extends IArangoSchemaRulePropertyBase {
  type: 'number';

  /**
   * The value of "multipleOf" MUST be a number, strictly greater than 0.
   */
  multipleOf?: number;

  /**
   * The value of "maximum" MUST be a number, representing an inclusive upper limit for a numeric instance.
   */
  maximun?: number;

  /**
   * The value of "exclusiveMaximum" MUST be a number, representing an exclusive upper limit for a numeric instance.
   */
  exclusiveMaximum?: number;

  /**
   * The value of "minimum" MUST be a number, representing an inclusive lower limit for a numeric instance.
   */
  minimum?: number;

  /**
   * The value of "exclusiveMinimum" MUST be a number, representing an exclusive lower limit for a numeric instance.
   */
  exclusiveMinimum?: number;
}

export interface IArangoSchemaRulePropertyString
  extends IArangoSchemaRulePropertyBase {
  type: 'string';

  /**
   * The value of this keyword MUST be a non-negative integer.
   */
  maxLength?: number;

  /**
   * The value of this keyword MUST be a non-negative integer.
   */
  minLength?: number;

  /**
   * The value of this keyword MUST be a string. This string SHOULD be a valid regular expression, according to the ECMA-262 regular expression dialect.
   */
  pattern?: string | RegExp;
}

export interface IArangoSchemaRulePropertyArray
  extends IArangoSchemaRulePropertyBase {
  type: 'array';

  /**
   * The value of this keyword MUST be a non-negative integer.
   */
  maxItems?: number;

  /**
   * The value of this keyword MUST be a non-negative integer.
   */
  minItems?: number;

  /**
   * The value of this keyword MUST be a boolean.
   */
  uniqueItems?: boolean;

  /**
   * The value of this keyword MUST be a non-negative integer.
   * If "contains" is not present within the same schema object, then this keyword has no effect.
   */
  maxContains?: number;

  /**
   * The value of this keyword MUST be a non-negative integer.
   * If "contains" is not present within the same schema object, then this keyword has no effect.
   */
  minContains?: number;
}

export interface IArangoSchemaRulePropertyObject
  extends IArangoSchemaRulePropertyBase {
  type: 'object';

  /**
   * The value of this keyword MUST be a non-negative integer.
   */
  maxProperties?: number;

  /**
   * The value of this keyword MUST be a non-negative integer.
   */
  minProperties?: number;

  /**
   * The value of this keyword MUST be an array. Elements of this array, if any, MUST be strings, and MUST be unique.
   */
  required?: string[];

  /**
   * The value of this keyword MUST be an object. Properties in this object, if any, MUST be arrays. Elements in each array, if any, MUST be strings, and MUST be unique.
   * This keyword specifies properties that are required if a specific other property is present. Their requirement is dependent on the presence of the other property.
   */
  dependentRequired?: Record<string, string[]>;
}

export interface IArangoRule {
  /**
   * Definition of the properties of each document in the collection.
   */
  properties: ArangoCreatePropertiesOptions;

  /**
   * Data type used to validate properties that are not defined in 'properties'.
   */
  additionalProperties?: { type: SchemaType } | null;

  /**
   * Definition of the required properties in each document of the collection.
   */
  required?: string[];
}

export interface IArangoCollectionDecoratorBaseOptions {
  /**
   * Indicates if the field is required.
   */
  requiredField?: boolean;
}

export interface IArangoRuleDecoratorBooleanOptions
  extends IArangoCollectionDecoratorBaseOptions,
    IArangoSchemaRulePropertyBoolean {}

export interface IArangoRuleDecoratorNumberOptions
  extends IArangoCollectionDecoratorBaseOptions,
    IArangoSchemaRulePropertyNumber {}

export interface IArangoRuleDecoratorStringOptions
  extends IArangoCollectionDecoratorBaseOptions,
    IArangoSchemaRulePropertyString {}

export interface IArangoRuleDecoratorArrayOptions
  extends IArangoCollectionDecoratorBaseOptions,
    IArangoSchemaRulePropertyArray {}

export interface IArangoRuleDecoratorObjectOptions
  extends IArangoCollectionDecoratorBaseOptions,
    IArangoSchemaRulePropertyObject {}
