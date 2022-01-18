import { IClassDecoratorOptionsDefault } from '../interfaces/class-options.interface';
import { ARANGO_COLLECTION } from '../type-arangodb.constant';
import { Collection } from './collection.decorator';

describe('CollectionDecorator', () => {
  const metadataValue: IClassDecoratorOptionsDefault[] = [
    {
      name: 'CollectionTest',
      type: 'document',
      waitForSync: false,
      schema: {
        message: '',
        level: 'none',
        rule: {
          properties: {},
          additionalProperties: { type: 'null' },
          required: [],
        },
      },
    },
  ];

  describe('getOwnMetadata', () => {
    test('get metadata of class without params', async () => {
      /**
       * Arrange
       */
      @Collection()
      class CollectionTest {}
      const collectionTest = new CollectionTest();

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
      @Collection('CollectionTest', {
        type: 'document',
        waitForSync: false,
        schema: {
          message: '',
          level: 'none',
          additionalProperties: 'null',
        },
      })
      class CollectionTest {}
      const collectionTest = new CollectionTest();

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
