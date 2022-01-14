import { ARANGO_COLLECTION } from '../type-arangodb.constant';
import { Collection } from './collection.decorator';

describe('CollectionDecorator', () => {
  describe('getOwnMetadata', () => {
    test('get metadata of class without params', async () => {
      /**
       * Arrange
       */
      @Collection()
      class CollectionTest {}
      const collectionTest = new CollectionTest();
      const metadataValue = [
        { name: 'CollectionTest', type: 'document', waitForSync: false },
      ];

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_COLLECTION,
        collectionTest.constructor.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });

    test('get metadata of class with name', async () => {
      /**
       * Arrange
       */
      @Collection('CollectionTest')
      class CollectionTest {}
      const collectionTest = new CollectionTest();
      const metadataValue = [
        { name: 'CollectionTest', type: 'document', waitForSync: false },
      ];

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_COLLECTION,
        collectionTest.constructor.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });

    test('get metadata of class with name', async () => {
      /**
       * Arrange
       */
      @Collection('CollectionTest', { type: 'edge', waitForSync: true })
      class CollectionTest {}
      const collectionTest = new CollectionTest();
      const metadataValue = [
        { name: 'CollectionTest', type: 'edge', waitForSync: true },
      ];

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_COLLECTION,
        collectionTest.constructor.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
