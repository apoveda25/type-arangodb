import { IRuleOptionsMetadata } from '../interfaces/field.interface';
import { ARANGO_FIELD } from '../type-arangodb.constant';
import { Collection } from './collection.decorator';
import { Field } from './field.decorator';

describe('FieldDecorator', () => {
  describe('getOwnMetadata', () => {
    test('get metadata of property with type', async () => {
      /**
       * Arrange
       */
      const metadataValue: IRuleOptionsMetadata = {
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

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_FIELD,
        CollectionTest.prototype,
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
      const metadataValue: IRuleOptionsMetadata = {
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

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_FIELD,
        CollectionTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
