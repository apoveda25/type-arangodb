import { ICollectionOptions } from '../interfaces/collection.interface';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';
import { Collection } from './collection.decorator';

describe('CollectionDecorator', () => {
  const metadataValue: ICollectionOptions = {
    name: 'CollectionTest',
    type: 'document',
  };

  describe('getOwnMetadata', () => {
    test('get metadata of Collection decorator in class without params', async () => {
      /**
       * Arrange
       */
      @Collection()
      class CollectionTest {}

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_COLLECTION,
        CollectionTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });

    test('get metadata of Collection decorator in class with param name', async () => {
      /**
       * Arrange
       */
      @Collection('CollectionTest')
      class CollectionTest {}

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_COLLECTION,
        CollectionTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });

    test('get metadata of Collection decorator in class with param options', async () => {
      /**
       * Arrange
       */
      @Collection({ type: 'document' })
      class CollectionTest {}

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_COLLECTION,
        CollectionTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });

    test('get metadata of Collection decorator in class with param options', async () => {
      /**
       * Arrange
       */
      @Collection({ type: 'document', name: 'CollectionTest' })
      class CollectionTest {}

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_COLLECTION,
        CollectionTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
