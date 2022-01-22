import {
  FulltextIndex,
  GeoIndex,
  HashIndex,
  PersistentIndex,
  TtlIndex,
} from 'arangojs/indexes';
import { ARANGO_INDEXES } from '../type-arangodb.constant';
import { Indexes } from './indexes.decorator';

describe('IndexesDecorator', () => {
  const metadataValue: (
    | FulltextIndex
    | GeoIndex
    | HashIndex
    | PersistentIndex
    | TtlIndex
  )[] = [
    {
      name: 'TestIndex',
      type: 'persistent',
      fields: ['name'],
      sparse: true,
      unique: true,
      id: '123456',
    },
  ];

  describe('getOwnMetadata', () => {
    test('get indexes metadata of class with params', async () => {
      /**
       * Arrange
       */
      @Indexes({
        name: 'TestIndex',
        type: 'persistent',
        fields: ['name'],
        sparse: true,
        unique: true,
        id: '123456',
      })
      class CollectionTest {}

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_INDEXES,
        CollectionTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
