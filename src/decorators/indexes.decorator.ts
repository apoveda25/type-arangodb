import {
  FulltextIndex,
  GeoIndex,
  HashIndex,
  PersistentIndex,
  TtlIndex,
} from 'arangojs/indexes';
import 'reflect-metadata';
import { ARANGO_INDEXES } from '../type-arangodb.constant';

export function Indexes(
  ...indexes: (
    | FulltextIndex
    | GeoIndex
    | HashIndex
    | PersistentIndex
    | TtlIndex
  )[]
): ClassDecoratorType {
  return function (target: Function) {
    const indexesMetadata: (
      | FulltextIndex
      | GeoIndex
      | HashIndex
      | PersistentIndex
      | TtlIndex
    )[] = Reflect.getOwnMetadata(ARANGO_INDEXES, target.prototype) || [];
    indexesMetadata.push(...indexes);

    Reflect.defineMetadata(ARANGO_INDEXES, indexesMetadata, target.prototype);
  };
}
