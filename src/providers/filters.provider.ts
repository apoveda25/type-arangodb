import { aql, GeneratedAqlQuery } from 'arangojs/aql';
import {
  ContainsOperatorValue,
  EndsWithOperatorValue,
  EntriesFilterOperator,
  EqualsOperatorValue,
  GteOperatorValue,
  GtOperatorValue,
  IFilterOperatorParser,
  InOperatorValue,
  LteOperatorValue,
  LtOperatorValue,
  NotContainsOperatorValue,
  NotInOperatorValue,
  NotOperatorValue,
  StartsWithOperatorValue,
  ValueFilterOperator,
} from '../interfaces/filters.interface';
import { FilterInput } from '../interfaces/find-input.interface';

export class FiltersProvider {
  transform<T>(filters: FilterInput<T>, docName: string): GeneratedAqlQuery {
    const entriesFilters = Object.entries(filters ?? {}) as [
      string,
      IFilterOperatorParser,
    ][];

    const entriesQueries = entriesFilters.map(
      ([key, { AND, OR, ...filtersContidions }]) => {
        const entriesFilterOperator = Object.entries(
          filtersContidions,
        ) as EntriesFilterOperator[];

        const entriesFilterOperatorAnd = AND
          ? AND.flatMap(
              (filterCondition) =>
                Object.entries(filterCondition) as EntriesFilterOperator[],
              Infinity,
            )
          : [];

        const entriesFilterOperatorOr = OR
          ? OR.flatMap(
              (filterCondition) =>
                Object.entries(filterCondition) as EntriesFilterOperator[],
              Infinity,
            )
          : [];

        const entriesFilterOperatorQuery = this.buildFilterOperatorQueries({
          entries: entriesFilterOperator,
          key,
          docName,
        });

        const entriesFilterOperatorAndQuery = this.buildFilterOperatorQueries({
          entries: entriesFilterOperatorAnd,
          key,
          docName,
        });

        const entriesFilterOperatorOrQuery = this.buildFilterOperatorQueries({
          entries: entriesFilterOperatorOr,
          key,
          docName,
        });

        return aql.join([
          aql.join([...entriesFilterOperatorQuery], ' AND '),
          aql.join([...entriesFilterOperatorAndQuery], ' AND '),
          aql.join([...entriesFilterOperatorOrQuery], ' OR '),
        ]);
      },
    );

    return entriesQueries.length
      ? aql`FILTER ${aql.join([...entriesQueries], ' AND ')}`
      : aql``;
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
    value: IFilterOperatorParser['equals'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} == ${value}`;
  }

  private notTransform(
    value: IFilterOperatorParser['not'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} != ${value}`;
  }

  private inTransform(
    value: IFilterOperatorParser['in'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} IN ${value}`;
  }

  private notInTransform(
    value: IFilterOperatorParser['notIn'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} NOT IN ${value}`;
  }

  private ltTransform(
    value: IFilterOperatorParser['lt'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} < ${value}`;
  }

  private lteTransform(
    value: IFilterOperatorParser['lte'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} <= ${value}`;
  }

  private gtTransform(
    value: IFilterOperatorParser['gt'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} > ${value}`;
  }

  private gteTransform(
    value: IFilterOperatorParser['gte'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} >= ${value}`;
  }

  private containsTransform(
    value: IFilterOperatorParser['contains'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} LIKE %${value}%`;
  }

  private notContainsTransform(
    value: IFilterOperatorParser['notContains'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} NOT LIKE %${value}%`;
  }

  private startsWithTransform(
    value: IFilterOperatorParser['startsWith'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} LIKE ${value}%`;
  }

  private endsWithTransform(
    value: IFilterOperatorParser['endsWith'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql`${docName}.${key} LIKE %${value}`;
  }
}
