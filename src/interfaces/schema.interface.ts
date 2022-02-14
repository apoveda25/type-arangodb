import { SchemaOptions } from 'arangojs/collection';
import { IArangoRule } from '.';

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
