import { ArangoStore } from '../metadata.store';
import { ARANGO_INDEXES } from '../type-arangodb.constant';
import { ArangoIndexDecoratorOption } from '../types/indexes.type';
import { Indexes } from './indexes.decorator';

describe('IndexesDecorator', () => {
  const metadataValue: ArangoIndexDecoratorOption[] = [
    {
      name: 'TestIndex',
      type: 'persistent',
      fields: ['name'],
      sparse: true,
      unique: true,
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
      })
      class EntityTest {}

      /**
       * Act
       */
      const result = ArangoStore.getMetadata(
        ARANGO_INDEXES,
        EntityTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
