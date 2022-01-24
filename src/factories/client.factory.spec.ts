import { Database } from 'arangojs';
import { Collection } from '../decorators/collection.decorator';
import { Field } from '../decorators/field.decorator';
import { Schema } from '../decorators/schema.decorator';
import { clientFactory } from './client.factory';

describe('ClientFactory', () => {
  test('get client', async () => {
    /**
     * Arrange
     */
    @Collection()
    @Schema('moderate')
    class CollectionTest {
      @Field('string')
      propertyTest1?: string;

      @Field({ type: 'number', requiredField: true })
      propertyTest2?: string;
    }

    const client = await clientFactory({
      options: {
        url: 'http://root:secret123@localhost:8529',
        databaseName: 'fast-route',
      },
      collections: [CollectionTest],
    });

    /**
     * Act
     */

    /**
     * Assert
     */
    expect(client).toBeInstanceOf(Database);
  });
});
