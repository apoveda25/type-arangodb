import { SortInput } from '../interfaces/find-input.interface';
import { SortProvider } from './sort.provider';

describe('SortProvider', () => {
  let provider: SortProvider = new SortProvider();

  test('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('transform', () => {
    test('should transform sorting', async () => {
      /**
       * Arrange
       */
      const docName = 'node';
      class EntityTest {
        username!: string;
        email!: string;
        createdAt!: number;
      }

      const sort: SortInput<EntityTest> = {
        username: 'ASC',
        email: 'ASC',
        createdAt: 'DESC',
      };

      const queryExpected =
        'SORT @value0.@value1 @value2, @value0.@value3 @value2, @value0.@value4 @value5';
      const bindVarsExpected = {
        value0: 'node',
        value1: 'username',
        value2: 'ASC',
        value3: 'email',
        value4: 'createdAt',
        value5: 'DESC',
      };

      /**
       * Act
       */
      const result = provider.transform(sort, docName);

      /**
       * Assert
       */
      expect(result.query).toMatch(queryExpected);
      expect(result.bindVars).toEqual(bindVarsExpected);
    });

    test('should transform sorting with param "sort" `undefined`', async () => {
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
