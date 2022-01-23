import { CollectionType, Database } from 'arangojs';
import { Config } from 'arangojs/connection';
import {
  IClassDecoratorOptionsDefault,
  IRule,
} from '../interfaces/collection.interface';
import { ARANGO_COLLECTION, ARANGO_RULES } from '../type-arangodb.constant';

export const clientFactory = async ({
  options,
  collections,
}: {
  options?: Config;
  collections: Function[];
}) => {
  const db = new Database(options);

  for (const collection of collections) {
    const [classMetadata]: IClassDecoratorOptionsDefault[] =
      Reflect.getMetadata(ARANGO_COLLECTION, collection.prototype);

    const { name, type, waitForSync, schema } = classMetadata;

    const [propertyMetadata]: IRule[] = Reflect.getMetadata(
      ARANGO_RULES,
      collection.prototype,
    );

    const rule: IRule = {
      properties: propertyMetadata.properties,
      additionalProperties: schema.rule.additionalProperties,
      required: propertyMetadata.required,
    };

    /**
     * Se debe agregar una factory para repositorios.
     */
    const newCollection = db.collection(name);
    const isExitsCollection = await newCollection.exists();

    if (!isExitsCollection) {
      await newCollection.create({
        type:
          type === 'document'
            ? CollectionType.DOCUMENT_COLLECTION
            : CollectionType.EDGE_COLLECTION,
        waitForSync,
        schema: { ...schema, rule },
      });
    }
  }

  return db;
};
