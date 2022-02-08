import { CollectionType } from 'arangojs';
import { Config } from 'arangojs/connection';
import { Database } from 'arangojs/database';
import {
  EnsureFulltextIndexOptions,
  EnsureGeoIndexOptions,
  EnsurePersistentIndexOptions,
  EnsureTtlIndexOptions
} from 'arangojs/indexes';
import {
  IArangoEntity,
  ICollectionOptionsMetadata,
  IRuleOptionsMetadata,
  ISchemaOptionsMetadata
} from '..';
import { ArangoStore } from '../metadata.store';
import {
  ARANGO_COLLECTION,
  ARANGO_FIELD,
  ARANGO_INDEXES,
  ARANGO_SCHEMA
} from '../type-arangodb.constant';
import { ArangoRepository } from './repository.provider';

export class ArangoClient {
  protected readonly _database: Database;
  protected readonly _entities: Record<string, any>[] = [];
  protected readonly _store: ArangoStore = new ArangoStore();

  constructor(options: Config) {
    this._database = new Database(options);
  }

  get database(): Database {
    return this._database;
  }

  async registerEntities(entities: IArangoEntity[]): Promise<void> {
    this._entities.push(...entities);

    for (const entity of entities) {
      const collectionMetadata =
        this._store.getMetadata<ICollectionOptionsMetadata>(
          ARANGO_COLLECTION,
          entity.prototype,
        );

      if (!collectionMetadata) continue;

      const schemaMetadata = this._store.getMetadata<ISchemaOptionsMetadata>(
        ARANGO_SCHEMA,
        entity.prototype,
      );

      const indexesMetadata =
        this._store.getMetadata<
          (
            | EnsurePersistentIndexOptions
            | EnsureTtlIndexOptions
            | EnsureFulltextIndexOptions
            | EnsureGeoIndexOptions
          )[]
        >(ARANGO_INDEXES, entity.prototype) ?? [];

      const fieldMetadata = this._store.getMetadata<IRuleOptionsMetadata>(
        ARANGO_FIELD,
        entity.prototype,
      );

      const newCollection = this._database.collection(collectionMetadata.name);
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
  }

  getRepository(
    entity: IArangoEntity,
  ): ArangoRepository<IArangoEntity> {
    return new ArangoRepository<typeof entity>(this._database, entity, this._store);
  }
}
