import { CollectionType } from 'arangojs';
import { Config } from 'arangojs/connection';
import { Database } from 'arangojs/database';
import {
  EnsureFulltextIndexOptions,
  EnsureGeoIndexOptions,
  EnsurePersistentIndexOptions,
  EnsureTtlIndexOptions,
} from 'arangojs/indexes';
import {
  ArangoEntity,
  ICollectionOptionsMetadata,
  IRuleOptionsMetadata,
  ISchemaOptionsMetadata,
} from '..';
import { ArangoStore } from '../metadata.store';
import {
  ARANGO_COLLECTION,
  ARANGO_FIELD,
  ARANGO_INDEXES,
  ARANGO_SCHEMA,
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

  async registerEntities(entities: ArangoEntity[]): Promise<void> {
    this._entities.push(...entities);

    for (const entity of entities) {
      const collectionMetadata =
        this._store.getMetadata<ICollectionOptionsMetadata>(
          ARANGO_COLLECTION,
          entity.constructor.prototype,
        );

      if (!collectionMetadata) continue;

      const schemaMetadata = this._store.getMetadata<ISchemaOptionsMetadata>(
        ARANGO_SCHEMA,
        entity.constructor,
      );

      const indexesMetadata =
        this._store.getMetadata<
          (
            | EnsurePersistentIndexOptions
            | EnsureTtlIndexOptions
            | EnsureFulltextIndexOptions
            | EnsureGeoIndexOptions
          )[]
        >(ARANGO_INDEXES, entity.constructor.prototype) ?? [];

      const fieldMetadata = this._store.getMetadata<IRuleOptionsMetadata>(
        ARANGO_FIELD,
        entity.constructor.prototype,
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

  getRepository<T>(entity: ArangoEntity) {
    return new ArangoRepository<T>(this._database, entity, this._store);
  }
}

class EntityTest {
  name!: string;
  email!: string;
  username!: string;
}

const arangoClient = new ArangoClient({});

const repository = arangoClient.getRepository<EntityTest>(EntityTest);

const a = repository.findOne({
  filters: { name: { equals: '' }, email: { in: [] } },
  select: { name: true, username: true },
});

const b = repository.findMany({
  filters: { name: { equals: '' }, email: { in: [] } },
  sort: { name: 'ASC' },
  select: { name: true, username: true },
  count: 20,
  offset: 20,
});
