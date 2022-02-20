import { Database } from 'arangojs';
import { ArangoClient } from './client.provider';
import { ArangoRepository } from './repository.provider';

describe('ArangoClient', () => {
  let client!: ArangoClient;

  beforeEach(async () => {
    client = new ArangoClient({});
  });

  test('should be defined', () => {
    expect(client).toBeDefined();
  });

  describe('get Database', () => {
    test('should return instance of Database arangojs', async () => {
      /**
       * Arrange
       */

      /**
       * Act
       */
      const database = client.getDatabase();

      /**
       * Assert
       */
      expect(database).toBeInstanceOf(Database);
    });
  });

  describe('get Repository', () => {
    test('should return instance of ArangoRepository', async () => {
      /**
       * Arrange
       */
      class EntityTest {
        name!: string;
        email!: string;
        username!: string;
      }

      /**
       * Act
       */
      const entity = client.getRepository<EntityTest>(EntityTest);

      /**
       * Assert
       */
      expect(entity).toBeInstanceOf(ArangoRepository);
    });
  });
});
