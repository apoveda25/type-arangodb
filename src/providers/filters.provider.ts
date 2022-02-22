import { aql, GeneratedAqlQuery } from 'arangojs/aql';
import {
  ContainsOperatorValue,
  EndsWithOperatorValue,
  EntriesFilterOperator,
  EqualsOperatorValue,
  GteOperatorValue,
  GtOperatorValue,
  IFilterConditionParser,
  InOperatorValue,
  LteOperatorValue,
  LtOperatorValue,
  NotContainsOperatorValue,
  NotInOperatorValue,
  NotOperatorValue,
  StartsWithOperatorValue,
  ValueFilterOperator,
} from '../interfaces/filters.interface';
import {
  FilterInput,
  FilterInputCondition,
} from '../interfaces/find-input.interface';

export class FiltersProvider {
  transform<T>(
    { AND, OR, ...filtersInput }: FilterInput<T>,
    docName: string,
  ): GeneratedAqlQuery {
    const entriesFilterOperator = this.getEntriesFilterInput<T>(
      (filtersInput ? [filtersInput] : []) as FilterInputCondition<T>[],
    );

    const entriesFilterOperatorAndAnd = this.getEntriesFilterInput<T>(
      AND && AND.AND ? AND.AND : [],
    );

    const entriesFilterOperatorAndOr = this.getEntriesFilterInput<T>(
      AND && AND.OR ? AND.OR : [],
    );

    const entriesFilterOperatorOrOr = this.getEntriesFilterInput<T>(
      OR && OR.OR ? OR.OR : [],
    );

    const entriesFilterOperatorOrAnd = this.getEntriesFilterInput<T>(
      OR && OR.AND ? OR.AND : [],
    );

    const entriesFilterOperatorQueries = this.parseEntriesToQueries({
      entries: entriesFilterOperator,
      docName,
    });

    const entriesFilterOperatorAndAndQueries = this.parseEntriesToQueries({
      entries: entriesFilterOperatorAndAnd,
      docName,
    });

    const entriesFilterOperatorAndOrQueries = this.parseEntriesToQueries({
      entries: entriesFilterOperatorAndOr,
      docName,
    });

    const entriesFilterOperatorOrOrQueries = this.parseEntriesToQueries({
      entries: entriesFilterOperatorOrOr,
      docName,
    });

    const entriesFilterOperatorOrAndQueries = this.parseEntriesToQueries({
      entries: entriesFilterOperatorOrAnd,
      docName,
    });

    const entriesFilterOperatorQuery = this.mergeAqlQueries(
      entriesFilterOperatorQueries,
      'AND',
    );

    const entriesFilterOperatorAndAndQuery = this.mergeAqlQueries(
      entriesFilterOperatorAndAndQueries,
      'AND',
    );

    const entriesFilterOperatorAndOrQuery = this.mergeAqlQueries(
      entriesFilterOperatorAndOrQueries,
      'OR',
    );

    const entriesFilterOperatorOrOrQuery = this.mergeAqlQueries(
      entriesFilterOperatorOrOrQueries,
      'OR',
    );

    const entriesFilterOperatorOrAndQuery = this.mergeAqlQueries(
      entriesFilterOperatorOrAndQueries,
      'AND',
    );

    const entriesFilterOperatorAndQuery = this.mergeAqlQueries(
      [entriesFilterOperatorAndAndQuery, entriesFilterOperatorAndOrQuery],
      'AND',
    );

    const entriesFilterOperatorOrQuery = this.mergeAqlQueries(
      [entriesFilterOperatorOrOrQuery, entriesFilterOperatorOrAndQuery],
      'OR',
    );

    const filterOperator = this.buildFilterAqlQuery(entriesFilterOperatorQuery);

    const filterOperatorAnd = this.buildFilterAqlQuery(
      entriesFilterOperatorAndQuery,
    );

    const filterOperatorOr = this.buildFilterAqlQuery(
      entriesFilterOperatorOrQuery,
    );

    return aql`
      ${filterOperator}
      ${filterOperatorAnd}
      ${filterOperatorOr}
    `;
  }

  private getEntriesFilterInput<T>(
    filtersInput: FilterInputCondition<T>[],
  ): [string, IFilterConditionParser | string | number | boolean][] {
    return filtersInput.flatMap((input) => {
      return Object.entries(input ?? {}) as [
        string,
        IFilterConditionParser | string | number | boolean,
      ][];
    }, Infinity);
  }

  private parseEntriesToQueries({
    entries,
    docName,
  }: {
    entries: [string, string | number | boolean | IFilterConditionParser][];
    docName: string;
  }): GeneratedAqlQuery[] {
    return entries.map(([key, value]) => {
      const filterOperator =
        typeof value === 'object' ? value : { equals: value };

      const entriesFilterOperator = Object.entries(
        filterOperator,
      ) as EntriesFilterOperator[];

      const entriesFilterOperatorQuery = this.buildFilterOperatorQueries({
        entries: entriesFilterOperator,
        key,
        docName,
      });

      return aql.join([...entriesFilterOperatorQuery], ' AND ');
    });
  }

  private mergeAqlQueries(
    queries: GeneratedAqlQuery[],
    separator: 'AND' | 'OR',
  ): GeneratedAqlQuery {
    const queriesFiltered = queries.filter(({ query }) => query);

    return aql.join(queriesFiltered, ` ${separator} `);
  }

  private buildFilterAqlQuery(query: GeneratedAqlQuery): GeneratedAqlQuery {
    return query.query ? aql`FILTER ${query}` : aql``;
  }

  private buildFilterOperator({
    operatorKey,
    operatorValue,
    key,
    docName,
  }: {
    operatorKey: string;
    operatorValue: ValueFilterOperator;
    key: string;
    docName: string;
  }): GeneratedAqlQuery | null {
    if (operatorKey === 'equals')
      return this.equalsTransform(operatorValue as EqualsOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'not')
      return this.notTransform(operatorValue as NotOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'in')
      return this.inTransform(operatorValue as InOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'notIn')
      return this.notInTransform(operatorValue as NotInOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'lt')
      return this.ltTransform(operatorValue as LtOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'lte')
      return this.lteTransform(operatorValue as LteOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'gt')
      return this.gtTransform(operatorValue as GtOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'gte')
      return this.gteTransform(operatorValue as GteOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'contains')
      return this.containsTransform(operatorValue as ContainsOperatorValue, {
        key,
        docName,
      });

    if (operatorKey === 'notContains')
      return this.notContainsTransform(
        operatorValue as NotContainsOperatorValue,
        {
          key,
          docName,
        },
      );

    if (operatorKey === 'startsWith')
      return this.startsWithTransform(
        operatorValue as StartsWithOperatorValue,
        {
          key,
          docName,
        },
      );

    if (operatorKey === 'endsWith')
      return this.endsWithTransform(operatorValue as EndsWithOperatorValue, {
        key,
        docName,
      });

    return null;
  }

  private buildFilterOperatorQueries({
    entries,
    key,
    docName,
  }: {
    entries: EntriesFilterOperator[];
    key: string;
    docName: string;
  }): GeneratedAqlQuery[] {
    return entries.flatMap(
      ([operatorKey, operatorValue]) =>
        this.buildFilterOperator({
          operatorKey,
          operatorValue,
          key,
          docName,
        }) ?? [],
    );
  }

  private equalsTransform(
    value: IFilterConditionParser['equals'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} == ${value}`;
  }

  private notTransform(
    value: IFilterConditionParser['not'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} != ${value}`;
  }

  private inTransform(
    value: IFilterConditionParser['in'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} IN ${value}`;
  }

  private notInTransform(
    value: IFilterConditionParser['notIn'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} NOT IN ${value}`;
  }

  private ltTransform(
    value: IFilterConditionParser['lt'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} < ${value}`;
  }

  private lteTransform(
    value: IFilterConditionParser['lte'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} <= ${value}`;
  }

  private gtTransform(
    value: IFilterConditionParser['gt'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} > ${value}`;
  }

  private gteTransform(
    value: IFilterConditionParser['gte'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} >= ${value}`;
  }

  private containsTransform(
    value: IFilterConditionParser['contains'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} LIKE %${value}%`;
  }

  private notContainsTransform(
    value: IFilterConditionParser['notContains'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} NOT LIKE %${value}%`;
  }

  private startsWithTransform(
    value: IFilterConditionParser['startsWith'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} LIKE ${value}%`;
  }

  private endsWithTransform(
    value: IFilterConditionParser['endsWith'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} LIKE %${value}`;
  }
}
