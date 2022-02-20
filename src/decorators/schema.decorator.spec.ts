import { IArangoCreateSchemaOptions } from '..';
import { ArangoStore } from '../metadata.store';
import { ARANGO_SCHEMA } from '../type-arangodb.constant';
import { Schema } from './schema.decorator';

describe('SchemaDecorator', () => {
  describe('getOwnMetadata', () => {
    test('get metadata of Schema decorator in class with level', async () => {
      /**
       * Arrange
       */
      const metadataValue: IArangoCreateSchemaOptions = {
        level: 'moderate',
        rule: { properties: {} },
      };

      @Schema('moderate')
      class EntityTest {}

      /**
       * Act
       */
      const result = ArangoStore.getMetadata<IArangoCreateSchemaOptions>(
        ARANGO_SCHEMA,
        EntityTest.prototype,
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
      const metadataValue: IArangoCreateSchemaOptions = {
        level: 'moderate',
        message: 'Message example',
        rule: { properties: {}, additionalProperties: { type: 'string' } },
      };

      @Schema({
        level: 'moderate',
        message: 'Message example',
        additionalProperties: 'string',
      })
      class EntityTest {}

      /**
       * Act
       */
      const result = ArangoStore.getMetadata<IArangoCreateSchemaOptions>(
        ARANGO_SCHEMA,
        EntityTest.prototype,
      );

      /**
       * Assert
       */
      expect(result).toEqual(metadataValue);
    });
  });
});
