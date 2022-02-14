import { Property } from '.';
import { IArangoRule } from '..';
import { ArangoStore } from '../metadata.store';
import { ARANGO_RULES } from '../type-arangodb.constant';
import { Collection } from './collection.decorator';

describe('FieldDecorator', () => {
  describe('getOwnMetadata', () => {
    test('get metadata of property with type', async () => {
      /**
       * Arrange
       */
      const metadataValue: IArangoRule = {
        properties: {
          propertyTest1: { type: 'string' },
          propertyTest2: { type: 'number' },
        },
        required: [],
      };

      @Collection()
      class EntityTest {
        @Property('string')
        propertyTest1?: string;

        @Property('number')
        propertyTest2?: number;
      }

      /**
       * Act
       */
      const result = ArangoStore.getMetadata(
        ARANGO_RULES,
        EntityTest.prototype,
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
      const metadataValue: IArangoRule = {
        properties: {
          propertyTest1: { type: 'string', minLength: 3, maxLength: 20 },
          propertyTest2: { type: 'number', minimum: 0, maximun: 9 },
        },
        required: ['propertyTest1'],
      };

      @Collection()
      class EntityTest {
        @Property({
          type: 'string',
          minLength: 3,
          maxLength: 20,
          requiredField: true,
        })
        propertyTest1?: string;

        @Property({ type: 'number', minimum: 0, maximun: 9 })
        propertyTest2?: number;
      }

      /**
       * Act
       */
      const result = ArangoStore.getMetadata(
        ARANGO_RULES,
        EntityTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
