import { aql, GeneratedAqlQuery } from 'arangojs/aql';
import { IFilterOperatorParser } from '../interfaces/filters.interface';
import { FilterInput } from '../interfaces/find-input.interface';

export class FiltersProvider {
  transform<T>(filters: FilterInput<T>, docName: string): GeneratedAqlQuery {
    const entriesFilters = Object.entries(filters) as [
      string,
      IFilterOperatorParser,
    ][];

    return this.entriesFiltersTransform(entriesFilters, docName);
  }

  private entriesFiltersTransform(
    entries: [string, IFilterOperatorParser][],
    docName: string,
  ): GeneratedAqlQuery {
    const queriesAQL = entries.flatMap(([key, value]) => {
      const [listAQL, listAndAQL, listOrAQL] =
        this.entriesConditionOperatorTransform({ key, value, docName });

      return aql.join(
        [
          aql.join(listAQL, ' AND '),
          aql.join(listAndAQL, ' AND '),
          aql.join(listOrAQL, ' OR '),
        ],
        ' AND ',
      );
    });

    return queriesAQL.length ? aql.join([aql`FILTER `, queriesAQL]) : aql``;
  }

  private entriesConditionOperatorTransform({
    key,
    value,
    docName,
  }: {
    key: string;
    value: IFilterOperatorParser;
    docName: string;
  }): GeneratedAqlQuery[][] {
    const entriesConditionOperator = Object.entries(value);

    return entriesConditionOperator.flatMap(([_key, _value]) => {
      const listAQL: GeneratedAqlQuery[] = [];
      const listAndAQL: GeneratedAqlQuery[] = [];
      const listOrAQL: GeneratedAqlQuery[] = [];

      if (_key === 'equals')
        listAQL.push(this.equalsTransform(value.equals, { key, docName }));

      if (_key === 'not')
        listAQL.push(this.notTransform(value.not, { key, docName }));

      if (_key === 'in')
        listAQL.push(this.inTransform(value.in, { key, docName }));

      if (_key === 'notIn')
        listAQL.push(this.notInTransform(value.notIn, { key, docName }));

      if (_key === 'lt')
        listAQL.push(this.ltTransform(value.lt, { key, docName }));

      if (_key === 'lte')
        listAQL.push(this.lteTransform(value.lte, { key, docName }));

      if (_key === 'gt')
        listAQL.push(this.gtTransform(value.gt, { key, docName }));

      if (_key === 'gte')
        listAQL.push(this.gteTransform(value.gte, { key, docName }));

      if (_key === 'contains')
        listAQL.push(this.containsTransform(value.contains, { key, docName }));

      if (_key === 'notContains')
        listAQL.push(
          this.notContainsTransform(value.notContains, { key, docName }),
        );

      if (_key === 'startsWith')
        listAQL.push(
          this.startsWithTransform(value.startsWith, { key, docName }),
        );

      if (_key === 'endsWith')
        listAQL.push(this.endsWithTransform(value.endsWith, { key, docName }));

      if (_key === 'AND') {
        listAndAQL.push(
          ...this.entriesConditionOperatorTransform({
            key,
            value: _value,
            docName,
          }).flat(),
        );
      }

      if (_key === 'OR') {
        listOrAQL.push(
          ...this.entriesConditionOperatorTransform({
            key,
            value: _value,
            docName,
          }).flat(),
        );
      }

      return [listAQL, listAndAQL, listOrAQL];
    });
  }

  private equalsTransform(
    value: IFilterOperatorParser['equals'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} == ${value}`;
  }

  private notTransform(
    value: IFilterOperatorParser['not'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} != ${value}`;
  }

  private inTransform(
    value: IFilterOperatorParser['in'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} IN ${value}`;
  }

  private notInTransform(
    value: IFilterOperatorParser['notIn'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} NOT IN ${value}`;
  }

  private ltTransform(
    value: IFilterOperatorParser['lt'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} < ${value}`;
  }

  private lteTransform(
    value: IFilterOperatorParser['lte'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} <= ${value}`;
  }

  private gtTransform(
    value: IFilterOperatorParser['gt'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} > ${value}`;
  }

  private gteTransform(
    value: IFilterOperatorParser['gte'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} >= ${value}`;
  }

  private containsTransform(
    value: IFilterOperatorParser['contains'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} LIKE %${value}%`;
  }

  private notContainsTransform(
    value: IFilterOperatorParser['notContains'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} NOT LIKE %${value}%`;
  }

  private startsWithTransform(
    value: IFilterOperatorParser['startsWith'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} LIKE ${value}%`;
  }

  private endsWithTransform(
    value: IFilterOperatorParser['endsWith'],
    { key, docName }: { key: string; docName: string },
  ): GeneratedAqlQuery {
    return aql` ${docName}.${key} LIKE %${value}`;
  }
}
