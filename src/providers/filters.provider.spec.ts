import { FilterInput } from '../interfaces/find-input.interface';
import { FiltersProvider } from './filters.provider';

describe('FiltersProvider', () => {
  let provider: FiltersProvider = new FiltersProvider();

  test('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('transform', () => {
    test('should transform filters', async () => {
      /**
       * Arrange
       */
      const docName = 'node';
      class EntityTest {
        username!: string;
        email!: string;
        createdAt!: number;
      }

      const filters: FilterInput<EntityTest> = {
        username: {
          equals: 'usernameTest',
        },
        email: {
          OR: [
            {
              endsWith: '@gmail.com',
            },
            {
              endsWith: '@hotmail.com',
            },
          ],
        },
        createdAt: {
          AND: [
            {
              lte: 1645307101225,
              gte: 1645307101225,
            },
          ],
        },
      };

      const queryExpected =
        'FILTER @value0.@value1 == @value2   AND   @value0.@value3 LIKE %@value4 OR @value0.@value3 LIKE %@value5 AND  @value0.@value6 <= @value7 AND @value0.@value6 >= @value7 ';
      const bindVarsExpected = {
        value0: 'node',
        value1: 'username',
        value2: 'usernameTest',
        value3: 'email',
        value4: '@gmail.com',
        value5: '@hotmail.com',
        value6: 'createdAt',
        value7: 1645307101225,
      };

      /**
       * Act
       */
      const result = provider.transform(filters, docName);

      /**
       * Assert
       */
      expect(result.query).toMatch(queryExpected);
      expect(result.bindVars).toEqual(bindVarsExpected);
    });

    test('should transform filters', async () => {
      /**
       * Arrange
       */
      const docName = 'node';
      const queryExpected = '';
      const bindVarsExpected = {};

      /**
       * Act
       */
      const result = provider.transform({}, docName);

      /**
       * Assert
       */
      expect(result.query).toMatch(queryExpected);
      expect(result.bindVars).toEqual(bindVarsExpected);
    });
  });
});
