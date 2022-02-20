import { aql, GeneratedAqlQuery } from 'arangojs/aql';
import { SortInput } from '../interfaces/find-input.interface';

export class SortProvider {
  transform<T>(sort: SortInput<T>, docName: string): GeneratedAqlQuery {
    const listQuerySort = Object.entries(sort ?? {}) as [
      string,
      'ASC' | 'DESC',
    ][];

    const queriesSort = listQuerySort.map(
      ([key, value]) => aql`${docName}.${key} ${value}`,
    );

    return queriesSort.length
      ? aql`SORT ${aql.join([...queriesSort], ', ')}`
      : aql``;
  }
}
