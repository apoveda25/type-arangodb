import { CollectionType, Database } from 'arangojs';
import { Config } from 'arangojs/connection';
import {
  EnsureFulltextIndexOptions,
  EnsureGeoIndexOptions,
  EnsureHashIndexOptions,
  EnsurePersistentIndexOptions,
  EnsureSkiplistIndexOptions,
  EnsureTtlIndexOptions,
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

    if (!collectionMetadata) continue;

    const schemaMetadata: ISchemaOptionsMetadata = Reflect.getMetadata(
      ARANGO_SCHEMA,
      collection.prototype,
    );

    const indexesMetadata: (
      | EnsurePersistentIndexOptions
      | EnsureHashIndexOptions
      | EnsureSkiplistIndexOptions
      | EnsureTtlIndexOptions
      | EnsureFulltextIndexOptions
      | EnsureGeoIndexOptions
    )[] = Reflect.getMetadata(ARANGO_INDEXES, collection.prototype) ?? [];

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

      await newCollection.create(metadata);
    }

    for (const index of indexesMetadata) {
      await newCollection.ensureIndex(index as EnsureGeoIndexOptions);
    }
  }

  return db;
};
