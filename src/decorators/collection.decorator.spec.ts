import { CollectionType } from 'arangojs';
import { IArangoCreateCollectionOptions } from '..';
import { ArangoStore } from '../metadata.store';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';
import { Collection } from './collection.decorator';

describe('CollectionDecorator', () => {
  const metadataValue: IArangoCreateCollectionOptions = {
    name: 'EntityTest',
    type: CollectionType.DOCUMENT_COLLECTION,
  };

  describe('getOwnMetadata', () => {
    test('get metadata of Collection decorator in class without params', async () => {
      /**
       * Arrange
       */
      @Collection()
      class EntityTest {}

      /**
       * Act
       */
      const result = ArangoStore.getMetadata<IArangoCreateCollectionOptions>(
        ARANGO_COLLECTION,
        EntityTest.prototype,
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
      @Collection('EntityTest')
      class EntityTest {}

      /**
       * Act
       */
      const result = ArangoStore.getMetadata<IArangoCreateCollectionOptions>(
        ARANGO_COLLECTION,
        EntityTest.prototype,
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
      @Collection({ type: CollectionType.DOCUMENT_COLLECTION })
      class EntityTest {}

      /**
       * Act
       */
      const result = ArangoStore.getMetadata<IArangoCreateCollectionOptions>(
        ARANGO_COLLECTION,
        EntityTest.prototype,
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
      @Collection({
        type: CollectionType.DOCUMENT_COLLECTION,
        name: 'EntityTest',
      })
      class EntityTest {}

      /**
       * Act
       */
      const result = ArangoStore.getMetadata<IArangoCreateCollectionOptions>(
        ARANGO_COLLECTION,
        EntityTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
