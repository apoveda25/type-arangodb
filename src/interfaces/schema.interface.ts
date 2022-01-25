import { ValidationLevel } from 'arangojs/collection';
import { IRuleOptionsMetadata } from './field.interface';

export interface IBaseSchema {
  /**
   * Message displayed when a schema validation error is generated.
   * More information here -> https://www.arangodb.com/docs/stable/data-modeling-documents-schema-validation.html#error-message
   */
  message?: string;

  /**
   * The level that controls when validation is triggered.
   * More information here -> https://www.arangodb.com/docs/stable/data-modeling-documents-schema-validation.html#levels
   */
  level: ValidationLevel;
}

export interface ISchemaOptions extends IBaseSchema {
  /**
   * Data type used to validate properties that are not defined in 'properties'.
   */
  additionalProperties?: SchemaType;
}

export interface ISchemaOptionsMetadata extends IBaseSchema {
  rule: IRuleOptionsMetadata;
}
