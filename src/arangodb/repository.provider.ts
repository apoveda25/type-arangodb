import { aql, Database } from 'arangojs';
import {
  CollectionMetadata,
  DocumentCollection,
  EdgeCollection
} from 'arangojs/collection';
import { IArangoEntity } from '..';
import { IFindOneInput } from '../interfaces/repository-input.interface';
import { ArangoStore } from '../metadata.store';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';

export class ArangoRepository<TEntity extends IArangoEntity> {
  private readonly _collection: DocumentCollection<any> & EdgeCollection<any>;
  private readonly _metadata: CollectionMetadata;

  constructor(
    private readonly _database: Database,
    private readonly _entity: TEntity,
    private readonly _store: ArangoStore,
  ) {
    this._metadata = this._store.getMetadata<CollectionMetadata>(
      ARANGO_COLLECTION,
      this._entity.constructor,
    );
    this._collection = _database.collection(this._metadata.name);
  }

  async findOne({
    filters,
    sort,
    select,
  }: IFindOneInput<TEntity>): Promise<TEntity | null> {
    const cursor = await this._database.query(aql`
      FOR node IN ${this._collection}
      ${aql.join(filters as any[])}
      ${aql.join(sort as any[])}
      LIMIT 1
      RETURN ${aql.join(select as any[])}
    `);

    return cursor.reduce<TEntity | null>((accu, curr) => curr ?? accu, null);
  }

  async findMany(filters: any) {
    const cursor = await this._database.query(aql`
      FOR node IN ${this._collection}
      ${aql.join(filters)}
      LIMIT 1
      RETURN node
    `);

    return cursor.map<TEntity>((node) => node);
  }
}

class Entity {
  name!: string
}

const entity: IArangoEntity = new Entity()

const repository = new ArangoRepository<typeof entity>({} as Database, entity, {} as ArangoStore)
repository.findOne({filters: {name: {equals: '', not: '', AND: [{not: ''}]}}})
