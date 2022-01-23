import { IRule } from '../interfaces/field.interface';
import { ARANGO_FIELD } from '../type-arangodb.constant';
import { Collection } from './collection.decorator';
import { Field } from './field.decorator';

describe('FieldDecorator', () => {
  describe('getOwnMetadata', () => {
    test('get metadata of property with type', async () => {
      /**
       * Arrange
       */
      const metadataValue: IRule = {
        properties: {
          propertyTest1: { type: 'string' },
          propertyTest2: { type: 'number' },
        },
        required: [],
      };
      @Collection()
      class CollectionTest {
        @Field('string')
        propertyTest1?: string;

        @Field('number')
        propertyTest2?: number;
      }
      const collectionTest = new CollectionTest();

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_FIELD,
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
      const metadataValue: IRule = {
        properties: {
          propertyTest1: { type: 'string', minLength: 3, maxLength: 20 },
          propertyTest2: { type: 'number', minimum: 0, maximun: 9 },
        },
        required: ['propertyTest1'],
      };
      @Collection()
      class CollectionTest {
        @Field({
          type: 'string',
          minLength: 3,
          maxLength: 20,
          requiredField: true,
        })
        propertyTest1?: string;

        @Field({ type: 'number', minimum: 0, maximun: 9 })
        propertyTest2?: number;
      }
      const collectionTest = new CollectionTest();

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_FIELD,
        collectionTest.constructor.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
