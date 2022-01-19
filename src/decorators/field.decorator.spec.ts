import { ARANGO_RULES } from '../type-arangodb.constant';
import { Collection } from './collection.decorator';
import { Field } from './field.decorator';

describe('FieldDecorator', () => {
  describe('getOwnMetadata', () => {
    test('get metadata of property with type', async () => {
      /**
       * Arrange
       */
      const metadataValue = [
        {
          properties: {
            propertyTest1: { type: 'string' },
            propertyTest2: { type: 'number' },
          },
          required: [],
        },
      ];
      @Collection()
      class CollectionTest {
        @Field('string')
        propertyTest1?: string;

        @Field('number')
        propertyTest2?: string;
      }
      const collectionTest = new CollectionTest();

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_RULES,
        collectionTest.constructor.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });

    test('get metadata of property with options', async () => {
      /**
       * Arrange
       */
      const metadataValue = [
        {
          properties: {
            propertyTest1: { type: 'string', minLength: 3, maxLength: 20 },
            propertyTest2: { type: 'number', minimum: 0, maximun: 9 },
          },
          required: [],
        },
      ];
      @Collection()
      class CollectionTest {
        @Field({ type: 'string', minLength: 3, maxLength: 20 })
        propertyTest1?: string;

        @Field({ type: 'number', minimum: 0, maximun: 9 })
        propertyTest2?: number;
      }
      const collectionTest = new CollectionTest();

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_RULES,
        collectionTest.constructor.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
