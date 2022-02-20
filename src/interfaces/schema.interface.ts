import { SchemaOptions } from 'arangojs/collection';
import { IArangoRule } from '.';
import { SchemaType } from '../types';

export interface IArangoSchemaDecoratorOptions
  extends Omit<SchemaOptions, 'rule'> {
  additionalProperties?: SchemaType;
}

export interface IArangoCreateSchemaOptions extends SchemaOptions {
  /**
   * JSON Schema description of the validation schema for documents.
   */
  rule: IArangoRule;
}
