import {
  IArangoRuleDecoratorArrayOptions,
  IArangoRuleDecoratorBooleanOptions,
  IArangoRuleDecoratorNumberOptions,
  IArangoRuleDecoratorObjectOptions,
  IArangoRuleDecoratorStringOptions,
  IArangoSchemaRulePropertyArray,
  IArangoSchemaRulePropertyBoolean,
  IArangoSchemaRulePropertyNumber,
  IArangoSchemaRulePropertyObject,
  IArangoSchemaRulePropertyString,
} from '..';

export declare type ArangoPropertyDecoratorOptions =
  | IArangoRuleDecoratorBooleanOptions
  | IArangoRuleDecoratorNumberOptions
  | IArangoRuleDecoratorStringOptions
  | IArangoRuleDecoratorArrayOptions
  | IArangoRuleDecoratorObjectOptions;

export declare type ArangoCreatePropertiesOptions = Record<
  string,
  | IArangoSchemaRulePropertyBoolean
  | IArangoSchemaRulePropertyNumber
  | IArangoSchemaRulePropertyString
  | IArangoSchemaRulePropertyArray
  | IArangoSchemaRulePropertyObject
>;
