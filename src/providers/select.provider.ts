import { aql, GeneratedAqlQuery } from 'arangojs/aql';
import { SelectInput } from '../interfaces/find-input.interface';

export class SelectProvider {
  transform<T>(select: SelectInput<T>, docName: string): GeneratedAqlQuery {
    const listQuerySelect = Object.entries(select ?? {}).flatMap(
      ([key, value]) => (value ? aql.literal(key) : []),
    );

    return listQuerySelect.length
      ? aql`KEEP(${docName}, ${aql.join(listQuerySelect, ', ')})`
      : aql`${docName}`;
  }
}
