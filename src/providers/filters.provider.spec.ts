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
        name!: string;
        createdAt!: number;
      }

      const filters1: FilterInput<EntityTest> = {
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

      const filters2: FilterInput<EntityTest> = {
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

      const filters3: FilterInput<EntityTest> = {
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
        'FILTER @value0.@value1 == @value2   AND   @value0.@value3 LIKE %@value4 OR @value0.@value3 LIKE %@value5 AND @value0.@value6 == @value7   AND  @value0.@value8 <= @value9 AND @value0.@value8 >= @value9 ';
      const bindVarsExpected = {
        value0: 'node',
        value1: 'username',
        value2: 'usernameTest',
        value3: 'email',
        value4: '@gmail.com',
        value5: '@hotmail.com',
        value6: 'name',
        value7: 'nameTest',
        value8: 'createdAt',
        value9: 1645307101225,
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
