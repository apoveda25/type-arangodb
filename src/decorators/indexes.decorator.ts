import { ArangoStore } from '../metadata.store';
import { ARANGO_INDEXES } from '../type-arangodb.constant';
import { ClassDecoratorType } from '../types';
import {
  ArangoCreateIndexOption,
  ArangoIndexDecoratorOption,
} from '../types/indexes.type';

export function Indexes(
  ...indexes: ArangoIndexDecoratorOption[]
): ClassDecoratorType {
  return function (target: Function) {
    const indexesMetadata =
      ArangoStore.getMetadata<ArangoCreateIndexOption[]>(
        ARANGO_INDEXES,
        target.prototype,
      ) ?? [];

    const indexesCreateOptions: ArangoCreateIndexOption[] = indexes.map(
      (index) => ({
        ...index,
        name: index.name ?? index.fields.join('-'),
      }),
    );

    ArangoStore.setMetadata<ArangoCreateIndexOption[]>(
      ARANGO_INDEXES,
      target.prototype,
      [...indexesMetadata, ...indexesCreateOptions],
    );
  };
}
