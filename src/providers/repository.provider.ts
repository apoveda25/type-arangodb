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
  ICreateInput,
  IFindManyInput,
  IFindOneInput,
  IRemoveInput,
  IReplaceInput,
  IUpdateInput,
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
  async findOne({
    filters,
    select,
  }: IFindOneInput<T>): Promise<Partial<T> | T | null> {
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
  }: IFindManyInput<T>): Promise<Partial<T>[] | T[]> {
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

  /**
   * Create a new document in the database and return the result
   * @param  - data: The data to insert into the collection.
   * @returns The document inserted.
   */
  async createOne({ data, select }: ICreateInput<T>): Promise<T | Partial<T>> {
    const newNode = 'NEW';
    const cursor = await this._database.query(aql`
      INSERT ${data}
      INTO ${this._collection}
      RETURN ${this._selectProvider.transform(
        select as SelectInput<T>,
        newNode,
      )}
    `);

    return cursor.reduce<T>((_, curr) => curr, {} as T);
  }

  /**
   * Create many documents
   * @param  - data: The data to be inserted.
   * @returns The documents inserted.
   */
  async createMany({
    data,
    select,
  }: ICreateInput<T>): Promise<T[] | Partial<T>[]> {
    const node = 'node';
    const newNode = 'NEW';
    const cursor = await this._database.query(aql`
      FOR ${node} IN ${data}
        INSERT ${node}
        INTO ${this._collection}
        RETURN ${this._selectProvider.transform(
          select as SelectInput<T>,
          newNode,
        )}
    `);

    return cursor.map<T>((doc) => doc);
  }

  /**
   * Upserts a document into the collection, and returns the upserted document
   * @param  - data: The data to be inserted or updated.
   * @returns The upserted document.
   */
  async createUpdateOne({
    data,
    select,
  }: ICreateInput<T>): Promise<T | Partial<T>> {
    const newNode = 'NEW';
    const cursor = await this._database.query(aql`
      UPSERT ${data}
      INSERT ${data}
      UPDATE ${data}
      IN ${this._collection}
      RETURN ${this._selectProvider.transform(
        select as SelectInput<T>,
        newNode,
      )}
    `);

    return cursor.reduce<T>((_, curr) => curr, {} as T);
  }

  /**
   * It takes a list of documents and upserts them into the collection
   * @param  - data: The data to be inserted.
   * @returns The upserted documents.
   */
  async createUpdateMany({
    data,
    select,
  }: ICreateInput<T>): Promise<T[] | Partial<T>[]> {
    const node = 'node';
    const newNode = 'NEW';
    const cursor = await this._database.query(aql`
      FOR ${node} IN ${data}
        UPSERT ${node}
        INSERT ${node}
        UPDATE ${node}
        IN ${this._collection}
        RETURN ${this._selectProvider.transform(
          select as SelectInput<T>,
          newNode,
        )}
    `);

    return cursor.map<T>((doc) => doc);
  }

  /**
   * Update a document in the collection
   * @param  - data
   * @returns The updated document.
   */
  async updateOne({ data, select }: IUpdateInput<T>): Promise<T | Partial<T>> {
    const newNode = 'NEW';
    const cursor = await this._database.query(aql`
      UPDATE ${data}
      IN ${this._collection}
      RETURN ${this._selectProvider.transform(
        select as SelectInput<T>,
        newNode,
      )}
    `);

    return cursor.reduce<T>((_, curr) => curr, {} as T);
  }

  /**
   * Update many documents in the collection
   * @param  - data: The data to update.
   * @returns The updated documents.
   */
  async updateMany({
    data,
    select,
  }: IUpdateInput<T>): Promise<T[] | Partial<T>[]> {
    const node = 'node';
    const newNode = 'NEW';
    const cursor = await this._database.query(aql`
      FOR ${node} IN ${data}
        UPDATE ${node}
        IN ${this._collection}
        RETURN ${this._selectProvider.transform(
          select as SelectInput<T>,
          newNode,
        )}
    `);

    return cursor.map<T>((doc) => doc);
  }

  /**
   * Replace a document in the collection
   * @param  - data: The data to replace.
   * @returns The replaced document.
   */
  async replaceOne({
    data,
    select,
  }: IReplaceInput<T>): Promise<T | Partial<T>> {
    const newNode = 'NEW';
    const cursor = await this._database.query(aql`
      REPLACE ${data}
      IN ${this._collection}
      RETURN ${this._selectProvider.transform(
        select as SelectInput<T>,
        newNode,
      )}
    `);

    return cursor.reduce<T>((_, curr) => curr, {} as T);
  }

  /**
   * Replace many documents in the collection
   * @param  - data: The data to replace.
   * @returns The replaced documents.
   */
  async replaceMany({
    data,
    select,
  }: IReplaceInput<T>): Promise<T[] | Partial<T>[]> {
    const node = 'node';
    const newNode = 'NEW';
    const cursor = await this._database.query(aql`
      FOR ${node} IN ${data}
        REPLACE ${node}
        IN ${this._collection}
        RETURN ${this._selectProvider.transform(
          select as SelectInput<T>,
          newNode,
        )}
    `);

    return cursor.map<T>((doc) => doc);
  }

  /**
   * Remove a single document from the collection
   * @param  - data
   * @returns The removed document.
   */
  async removeOne({
    data,
    select,
  }: IRemoveInput<T>): Promise<T | Partial<T>[]> {
    const oldNode = 'OLD';
    const cursor = await this._database.query(aql`
      REMOVE ${data}
      IN ${this._collection}
      RETURN ${this._selectProvider.transform(
        select as SelectInput<T>,
        oldNode,
      )}
    `);

    return cursor.reduce<T>((_, curr) => curr, {} as T);
  }

  /**
   * Remove many documents from the collection
   * @param  - data: The data to remove.
   * @returns The removed documents.
   */
  async removeMany({
    data,
    select,
  }: IRemoveInput<T>): Promise<T[] | Partial<T>[]> {
    const node = 'node';
    const oldNode = 'OLD';
    const cursor = await this._database.query(aql`
      FOR ${node} IN ${data}
        REMOVE ${node}
        IN ${this._collection}
        RETURN ${this._selectProvider.transform(
          select as SelectInput<T>,
          oldNode,
        )}
    `);

    return cursor.map<T>((doc) => doc);
  }
}
