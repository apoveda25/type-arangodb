import {
  EnsureFulltextIndexOptions,
  EnsureGeoIndexOptions,
  EnsureHashIndexOptions,
  EnsurePersistentIndexOptions,
  EnsureSkiplistIndexOptions,
  EnsureTtlIndexOptions,
} from 'arangojs/indexes';
import 'reflect-metadata';
import { ARANGO_INDEXES } from '../type-arangodb.constant';

export function Indexes(
  ...indexes: (
    | EnsurePersistentIndexOptions
    | EnsureHashIndexOptions
    | EnsureSkiplistIndexOptions
    | EnsureTtlIndexOptions
    | EnsureFulltextIndexOptions
    | EnsureGeoIndexOptions
  )[]
): ClassDecoratorType {
  return function (target: Function) {
    const indexesMetadata: (
      | EnsurePersistentIndexOptions
      | EnsureHashIndexOptions
      | EnsureSkiplistIndexOptions
      | EnsureTtlIndexOptions
      | EnsureFulltextIndexOptions
      | EnsureGeoIndexOptions
    )[] = Reflect.getOwnMetadata(ARANGO_INDEXES, target.prototype) || [];
    indexesMetadata.push(
      ...indexes.map((index) => ({
        ...index,
        name: index.name ?? index.fields.join('-'),
      })),
    );

    Reflect.defineMetadata(ARANGO_INDEXES, indexesMetadata, target.prototype);
  };
}
