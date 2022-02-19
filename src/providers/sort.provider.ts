import { aql, GeneratedAqlQuery } from 'arangojs/aql';
import { SortInput } from '../interfaces/find-input.interface';

export class SortProvider {
  transform<T>(sort: SortInput<T>, docName: string): GeneratedAqlQuery {
    const listQuerySort = Object.entries(sort ?? {}).map(([key, value]) =>
      aql.literal(`${docName}.${key} ${value}`),
    );

    return listQuerySort.length
      ? aql`SORT ${aql.join(listQuerySort, ', ')}`
      : aql``;
  }
}
