export interface IFindOneInput<T> {
  filters?: FilterInput<T>;
  select?: SelectInput<T>;
}

export interface IFindManyInput<T> {
  filters?: FilterInput<T>;
  sort?: SortInput<T>;
  select?: SelectInput<T>;
  count?: number;
  offset?: number;
}

export interface ICountInput<T> {
  filters?: FilterInput<T>;
}

export type FilterInput<
  T,
  U = Partial<T>,
  V = { [K in keyof U]: IFilterOperator<U[K]> },
> = V;

export interface IFilterCondition<T> {
  equals?: T;
  not?: T;
  in?: T[];
  notIn?: T[];
  lt?: T;
  lte?: T;
  gt?: T;
  gte?: T;
  contains?: T;
  notContains?: T;
  startsWith?: T;
  endsWith?: T;
}

export interface IFilterOperator<T> extends IFilterCondition<T> {
  AND?: IFilterCondition<T>[];
  OR?: IFilterCondition<T>[];
}

export type SortInput<
  T,
  U = Partial<T>,
  V = { [K in keyof U]: 'ASC' | 'DESC' },
> = V;

export type SelectInput<T, U = Partial<T>, V = { [K in keyof U]: true }> = V;
