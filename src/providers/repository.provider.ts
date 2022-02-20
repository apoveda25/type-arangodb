import { aql, Database } from 'arangojs';
import {
  CollectionMetadata,
  DocumentCollection,
  EdgeCollection,
} from 'arangojs/collection';
import { ArangoEntity } from '..';
import {
  FilterInput,
  ICountInput,
  IFindManyInput,
  IFindOneInput,
  SelectInput,
  SortInput,
} from '../interfaces/find-input.interface';
import { ArangoStore } from '../metadata.store';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';
import { FiltersProvider } from './filters.provider';
import { SelectProvider } from './select.provider';
import { SortProvider } from './sort.provider';

export class ArangoRepository<T> {
  private readonly _collection: DocumentCollection<T> & EdgeCollection<T>;
  private readonly _metadata: CollectionMetadata;
  private readonly _store = ArangoStore;
  private readonly _filtersProvider = new FiltersProvider();
  private readonly _sortProvider = new SortProvider();
  private readonly _selectProvider = new SelectProvider();

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

  /**
   * Returns the collection that this edge belongs to
   * @returns The collection used by this repository.
   */
  getCollection(): DocumentCollection<T> & EdgeCollection<T> {
    return this._collection;
  }

  /**
   * It returns the first document that matches the given filters
   * @param  - filters: The filters to apply to the query.
   * @returns Document or null.
   */
  async findOne({ filters, select }: IFindOneInput<T>): Promise<T | null> {
    const node = 'node';
    const cursor = await this._database.query(aql`
      FOR ${node} IN ${this._collection}
      ${this._filtersProvider.transform<T>(
        (filters ?? {}) as FilterInput<T>,
        node,
      )}
      LIMIT 1
      RETURN ${this._selectProvider.transform(select as SelectInput<T>, node)}
    `);

    return cursor.reduce<T | null>((accu, curr) => curr ?? accu, null);
  }

  /**
   * It returns a cursor of nodes that match the given filters, and it sorts the results by the given
   * sort
   * @param  - Filters:
   * @returns An array of objects.
   */
  async findMany({
    filters,
    sort,
    select,
    count = 10,
    offset = 0,
  }: IFindManyInput<T>): Promise<T[]> {
    const node = 'node';
    const cursor = await this._database.query(aql`
      FOR ${node} IN ${this._collection}
      ${this._filtersProvider.transform<T>(
        (filters ?? {}) as FilterInput<T>,
        node,
      )}
      ${this._sortProvider.transform<T>(sort as SortInput<T>, node)}
      LIMIT ${aql.literal(`${offset}, ${count}`)}
      RETURN ${this._selectProvider.transform(select as SelectInput<T>, node)}
    `);

    return cursor.map<T>((node) => node);
  }

  /**
   * It returns the number of documents in the collection that match the given filters
   * @param  - Filters:
   * @returns An number of documents.
   */
  async count({ filters }: ICountInput<T>): Promise<number> {
    const node = 'node';
    const cursor = await this._database.query(aql`
      RETURN COUNT(
        FOR ${node} IN ${this._collection}
        ${this._filtersProvider.transform<T>(
          (filters ?? {}) as FilterInput<T>,
          node,
        )}
        RETURN ${node}
      )
    `);

    return cursor.reduce<number>((accu, curr) => accu + curr, 0);
  }
}
