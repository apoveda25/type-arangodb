export interface IBaseClassDecorator {
  /**
   * The type of the collection to create.
   */
  type: CollectionType;

  /**
   * Synchronize to disk before returning from a create or update of a document.
   */
  waitForSync: boolean;
}

export interface IClassDecoratorOptions extends IBaseClassDecorator {
  /**
   * Schema definition for the collection.
   */
  schema: ISchemaOptions;
}

export interface IClassDecoratorOptionsDefault extends IBaseClassDecorator {
  /**
   * Collection name. By default it takes the name of the decorated class.
   */
  name: string;

  /**
   * Schema definition with default values for the collection.
   * More information here -> https://www.arangodb.com/docs/stable/data-modeling-documents-schema-validation.html#json-schema-rule
   */
  schema: ISchemaOptionsDefault;
}

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
  level: SchemaLevel;
}

export interface ISchemaOptions extends IBaseSchema {
  /**
   * Data type used to validate properties that are not defined in 'properties'.
   */
  additionalProperties?: SchemaType;
}

export interface ISchemaOptionsDefault extends IBaseSchema {
  /**
   * Definition of rules to validate the documents in the collection.
   */
  rule: IRule;
}

export interface IRule {
  /**
   * Definition of the properties of each document in the collection.
   */
  properties: Record<string, any>;

  /**
   * Data type used to validate properties that are not defined in 'properties'.
   */
  additionalProperties?: { type: SchemaType };

  /**
   * Definition of the required properties in each document of the collection.
   */
  required?: string[];
}
