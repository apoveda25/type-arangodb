import { Database } from 'arangojs';
import { Collection } from '../decorators/collection.decorator';
import { Field } from '../decorators/field.decorator';
import { Indexes } from '../decorators/indexes.decorator';
import { Schema } from '../decorators/schema.decorator';
import { clientFactory } from './client.factory';

describe('ClientFactory', () => {
  test('get client with all decorators', async () => {
    /**
     * Arrange
     */
    @Collection()
    @Schema('moderate')
    @Indexes({
      name: 'propertyTest1',
      fields: ['propertyTest1'],
      unique: true,
      type: 'persistent',
    })
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

  test('get client without indexes decorator', async () => {
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

  test('get client without schema decorator', async () => {
    /**
     * Arrange
     */
    @Collection()
    @Indexes({
      name: 'propertyTest1',
      fields: ['propertyTest1'],
      unique: true,
      type: 'persistent',
    })
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

  test('get client without collection decorator', async () => {
    /**
     * Arrange
     */
    @Schema('moderate')
    @Indexes({
      name: 'propertyTest1',
      fields: ['propertyTest1'],
      unique: true,
      type: 'persistent',
    })
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

  test('get client without field decorator', async () => {
    /**
     * Arrange
     */
    @Collection()
    @Schema('moderate')
    @Indexes({
      name: 'propertyTest1',
      fields: ['propertyTest1'],
      unique: true,
      type: 'persistent',
    })
    class CollectionTest {
      propertyTest1?: string;

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
