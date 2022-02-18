import { aql, Database } from 'arangojs';
import {
  CollectionMetadata,
  DocumentCollection,
  EdgeCollection,
} from 'arangojs/collection';
import { ArangoEntity } from '..';
import {
  FilterInput,
  IFindManyInput,
  IFindOneInput,
} from '../interfaces/find-input.interface';
import { ArangoStore } from '../metadata.store';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';
import { FiltersProvider } from './filters.provider';

export class ArangoRepository<T> {
  private readonly _collection: DocumentCollection<T> & EdgeCollection<T>;
  private readonly _metadata: CollectionMetadata;
  private readonly _store = ArangoStore;
  private readonly _filtersProvider = new FiltersProvider();

  constructor(
    private readonly _database: Database,
    private readonly _entity: ArangoEntity,
  ) {
    this._metadata = this._store.getMetadata<CollectionMetadata>(
      ARANGO_COLLECTION,
      this._entity.constructor.prototype,
    );

    this._collection = _database.collection(
      this._metadata ? this._metadata.name : this._entity.constructor.name,
    );
  }

  async findOne({ filters, select }: IFindOneInput<T>): Promise<T | null> {
    const cursor = await this._database.query(aql`
      FOR node IN ${this._collection}
      ${this._filtersProvider.transform<T>(
        (filters ?? {}) as FilterInput<T>,
        'node',
      )}
      LIMIT 1
      RETURN KEEP(node, ${aql.literal(select as any)})
    `);

    return cursor.reduce<T | null>((accu, curr) => curr ?? accu, null);
  }

  async findMany({
    filters,
    sort,
    select,
    count = 10,
    offset = 0,
  }: IFindManyInput<T>) {
    const cursor = await this._database.query(aql`
      FOR node IN ${this._collection}
      ${this._filtersProvider.transform<T>(
        (filters ?? {}) as FilterInput<T>,
        'node',
      )}
      ${aql.join(sort as any)}
      LIMIT ${aql.literal(`${offset}, ${count}`)}
      RETURN KEEP(node, ${aql.literal(select as any)})
    `);

    return cursor.map<T>((node) => node);
  }
}
