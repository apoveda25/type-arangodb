import { CollectionType } from 'arangojs';
import { CreateCollectionOptions } from 'arangojs/collection';
import { IArangoCreateSchemaOptions } from '.';

export interface IArangoCollectionDecoratorOptions
  extends Omit<CreateCollectionOptions, 'schema'> {
  /**
   * The type of the collection to create.
   */
  type: CollectionType;

  /**
   * Collection name. By default it takes the name of the decorated class.
   */
  name?: string;
}

export interface IArangoCreateCollectionOptions
  extends IArangoCollectionDecoratorOptions {
  /**
   * Collection name. By default it takes the name of the decorated class.
   */
  name: string;

  /**
   * Options for validating documents in the collection.
   */
  schema?: IArangoCreateSchemaOptions;
}

export class ArangoEntity implements Object {}
