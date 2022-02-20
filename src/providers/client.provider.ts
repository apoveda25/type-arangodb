import { CollectionType } from 'arangojs';
import { Config } from 'arangojs/connection';
import { Database } from 'arangojs/database';
import { EnsureGeoIndexOptions } from 'arangojs/indexes';
import {
  ArangoEntity,
  IArangoCreateCollectionOptions,
  IArangoCreateSchemaOptions,
  IArangoRule,
} from '..';
import { ArangoStore } from '../metadata.store';
import {
  ARANGO_COLLECTION,
  ARANGO_INDEXES,
  ARANGO_RULES,
  ARANGO_SCHEMA,
} from '../type-arangodb.constant';
import { ArangoCreateIndexOption } from '../types/indexes.type';
import { ArangoRepository } from './repository.provider';

export class ArangoClient {
  protected readonly _database: Database;
  protected readonly _entities: Record<string, any>[] = [];
  protected readonly _store = ArangoStore;

  constructor(options: Config) {
    this._database = new Database(options);
  }

  getDatabase(): Database {
    return this._database;
  }

  async registerEntities(entities: ArangoEntity[]): Promise<void> {
    this._entities.push(...entities);

    for (const entity of entities) {
      const collectionMetadata =
        this._store.getMetadata<IArangoCreateCollectionOptions>(
          ARANGO_COLLECTION,
          entity.constructor.prototype,
        ) ?? {
          type: CollectionType.DOCUMENT_COLLECTION,
          name: entity.constructor.name,
        };

      const schemaMetadata =
        this._store.getMetadata<IArangoCreateSchemaOptions>(
          ARANGO_SCHEMA,
          entity.constructor.prototype,
        ) ?? {};

      const indexesMetadata =
        this._store.getMetadata<ArangoCreateIndexOption[]>(
          ARANGO_INDEXES,
          entity.constructor.prototype,
        ) ?? [];

      const ruleMetadata =
        this._store.getMetadata<IArangoRule>(
          ARANGO_RULES,
          entity.constructor.prototype,
        ) ?? {};

      const newCollection = this._database.collection(collectionMetadata.name);
      const isExitsCollection = await newCollection.exists();

      if (!isExitsCollection) {
        const metadata: IArangoCreateCollectionOptions = {
          ...collectionMetadata,
          schema: {
            ...schemaMetadata,
            rule: ruleMetadata,
          },
        };

        await newCollection.create(metadata);
      }

      for (const index of indexesMetadata) {
        await newCollection.ensureIndex(index as EnsureGeoIndexOptions);
      }
    }
  }

  getRepository<T>(entity: ArangoEntity) {
    return new ArangoRepository<T>(this._database, entity);
  }
}
