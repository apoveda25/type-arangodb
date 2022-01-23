import { CreateCollectionOptions } from 'arangojs/collection';

export interface ICollectionOptions
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
