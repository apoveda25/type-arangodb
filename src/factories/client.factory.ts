import { CollectionType, Database } from 'arangojs';
import { Config } from 'arangojs/connection';
import {
  FulltextIndex,
  GeoIndex,
  HashIndex,
  PersistentIndex,
  TtlIndex,
} from 'arangojs/indexes';
import 'reflect-metadata';
import { ICollectionOptionsMetadata } from '../interfaces/collection.interface';
import { IRuleOptionsMetadata } from '../interfaces/field.interface';
import { ISchemaOptionsMetadata } from '../interfaces/schema.interface';
import {
  ARANGO_COLLECTION,
  ARANGO_FIELD,
  ARANGO_INDEXES,
  ARANGO_SCHEMA,
} from '../type-arangodb.constant';

export const clientFactory = async ({
  options,
  collections,
}: {
  options?: Config;
  collections: Function[];
}) => {
  const db = new Database(options);

  for (const collection of collections) {
    const collectionMetadata: ICollectionOptionsMetadata = Reflect.getMetadata(
      ARANGO_COLLECTION,
      collection.prototype,
    );

    const schemaMetadata: ISchemaOptionsMetadata = Reflect.getMetadata(
      ARANGO_SCHEMA,
      collection.prototype,
    );

    const indexesMetadata: (
      | FulltextIndex
      | GeoIndex
      | HashIndex
      | PersistentIndex
      | TtlIndex
    )[] = Reflect.getMetadata(ARANGO_INDEXES, collection.prototype);

    const fieldMetadata: IRuleOptionsMetadata = Reflect.getMetadata(
      ARANGO_FIELD,
      collection.prototype,
    );

    /**
     * Se debe agregar una factory para repositorios.
     */
    const newCollection = db.collection(collectionMetadata.name);
    const isExitsCollection = await newCollection.exists();

    if (!isExitsCollection) {
      const metadata = {
        ...collectionMetadata,
        type:
          collectionMetadata.type === 'document'
            ? CollectionType.DOCUMENT_COLLECTION
            : CollectionType.EDGE_COLLECTION,
        schema: {
          ...schemaMetadata,
          rule: {
            ...fieldMetadata,
            additionalProperties: schemaMetadata.rule.additionalProperties,
          },
        },
      };
      console.log('metadata: ', metadata);

      await newCollection.create(metadata);
    }
  }

  return db;
};
