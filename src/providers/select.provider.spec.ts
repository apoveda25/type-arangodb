import { SelectInput } from '../interfaces/find-input.interface';
import { SelectProvider } from './select.provider';

describe('SelectProvider', () => {
  let provider: SelectProvider = new SelectProvider();

  test('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('transform', () => {
    test('should transform selecting fields', async () => {
      /**
       * Arrange
       */
      const docName = 'node';
      class EntityTest {
        username!: string;
        email!: string;
        createdAt!: number;
      }

      const select: SelectInput<EntityTest> = {
        username: true,
        email: true,
        createdAt: true,
      };

      const queryExpected = 'KEEP(@value0, @value1, @value2, @value3)';
      const bindVarsExpected = {
        value0: 'node',
        value1: 'username',
        value2: 'email',
        value3: 'createdAt',
      };

      /**
       * Act
       */
      const result = provider.transform(select, docName);

      /**
       * Assert
       */
      expect(result.query).toMatch(queryExpected);
      expect(result.bindVars).toEqual(bindVarsExpected);
    });

    test('should transform selecting with param "select" === {}', async () => {
      /**
       * Arrange
       */
      const docName = 'node';
      const queryExpected = '@value0';
      const bindVarsExpected = { value0: 'node' };

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
