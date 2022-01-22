import { ISchemaOptions } from '../interfaces/schema.interface';
import { ARANGO_SCHEMA } from '../type-arangodb.constant';
import { Schema } from './schema.decorator';

describe('SchemaDecorator', () => {
  describe('getOwnMetadata', () => {
    test('get metadata of Schema decorator in class with level', async () => {
      /**
       * Arrange
       */
      const metadataValue: ISchemaOptions = { level: 'moderate' };

      @Schema('moderate')
      class CollectionTest {}

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_SCHEMA,
        CollectionTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });

    test('get metadata of Schema decorator in class with options', async () => {
      /**
       * Arrange
       */
      const metadataValue: ISchemaOptions = {
        level: 'moderate',
        message: 'Message example',
        additionalProperties: 'string',
      };

      @Schema({
        level: 'moderate',
        message: 'Message example',
        additionalProperties: 'string',
      })
      class CollectionTest {}

      /**
       * Act
       */
      const result = Reflect.getOwnMetadata(
        ARANGO_SCHEMA,
        CollectionTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
