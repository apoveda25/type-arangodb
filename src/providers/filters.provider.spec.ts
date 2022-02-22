import { FilterInput } from '../interfaces/find-input.interface';
import { FiltersProvider } from './filters.provider';

describe('FiltersProvider', () => {
  let provider: FiltersProvider = new FiltersProvider();

  test('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('transform', () => {
    test('should transform filters of type object plain', async () => {
      /**
       * Arrange
       */
      const docName = 'node';
      class EntityTest {
        username!: string;
        email!: string;
        name!: string;
        createdAt!: number;
      }

      const filters: FilterInput<EntityTest> = {
        username: {
          equals: 'usernameTest',
        },
        email: {
          endsWith: '@hotmail.com',
        },
        name: 'nameTest',
        createdAt: {
          lte: 1645307101225,
          gte: 1645307101225,
        },
      };

      const queryExpected =
        '\n      FILTER @value0.@value1 == @value2 AND @value0.@value3 LIKE %@value4 AND @value0.@value5 == @value6 AND @value0.@value7 <= @value8 AND @value0.@value7 >= @value8\n      \n      \n    ';
      const bindVarsExpected = {
        value0: 'node',
        value1: 'username',
        value2: 'usernameTest',
        value3: 'email',
        value4: '@hotmail.com',
        value5: 'name',
        value6: 'nameTest',
        value7: 'createdAt',
        value8: 1645307101225,
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

    test('should transform filters of type object AND', async () => {
      /**
       * Arrange
       */
      const docName = 'node';
      class EntityTest {
        username!: string;
        email!: string;
        name!: string;
        createdAt!: number;
      }

      const filters: FilterInput<EntityTest> = {
        OR: {
          OR: [
            {
              email: { endsWith: '@gmail.com' },
            },
            {
              email: { endsWith: '@hotmail.com' },
            },
          ],
          AND: [
            {
              createdAt: {
                lte: 1645307101225,
                gte: 1645307101225,
              },
            },
          ],
        },
      };

      const queryExpected =
        '\n      \n      \n      FILTER @value0.@value1 LIKE %@value2 OR @value0.@value1 LIKE %@value3 OR @value0.@value4 <= @value5 AND @value0.@value4 >= @value5\n    ';
      const bindVarsExpected = {
        value0: 'node',
        value1: 'email',
        value2: '@gmail.com',
        value3: '@hotmail.com',
        value4: 'createdAt',
        value5: 1645307101225,
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

    test('should transform filters of type object OR', async () => {
      /**
       * Arrange
       */
      const docName = 'node';
      class EntityTest {
        username!: string;
        email!: string;
        name!: string;
        createdAt!: number;
      }

      const filters: FilterInput<EntityTest> = {
        AND: {
          OR: [
            {
              email: { endsWith: '@gmail.com' },
            },
            {
              email: { endsWith: '@hotmail.com' },
            },
          ],
          AND: [
            {
              createdAt: {
                lte: 1645307101225,
                gte: 1645307101225,
              },
            },
          ],
        },
      };

      const queryExpected =
        '\n      \n      FILTER @value0.@value1 <= @value2 AND @value0.@value1 >= @value2 AND @value0.@value3 LIKE %@value4 OR @value0.@value3 LIKE %@value5\n      \n    ';
      const bindVarsExpected = {
        value0: 'node',
        value1: 'createdAt',
        value2: 1645307101225,
        value3: 'email',
        value4: '@gmail.com',
        value5: '@hotmail.com',
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

    test('should transform filters with param "filters" === {}', async () => {
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
