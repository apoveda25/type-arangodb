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

export type CreateInputData<
  T,
  U = { _id?: string; _key?: string },
  V = Omit<T, '_id' | '_key'>,
> = U & V;

export type UpdateInputData<
  T,
  U = { _id: string } | { _key: string } | { _id: string; _key: string },
  V = Partial<Omit<T, '_id' | '_key'>>,
> = U & V;

export type ReplaceInputData<
  T,
  U = { _id: string } | { _key: string } | { _id: string; _key: string },
  V = Omit<T, '_id' | '_key'>,
> = U & V;

export type RemoveInputData =
  | { _id: string }
  | { _key: string }
  | { _id: string; _key: string };

export interface ICreateOneInput<T> {
  data: CreateInputData<T>;
  select?: SelectInput<T>;
}

export interface ICreateManyInput<T> {
  data: CreateInputData<T>[];
  select?: SelectInput<T>;
}

export interface IUpdateOneInput<T> {
  data: UpdateInputData<T>;
  select?: SelectInput<T>;
}

export interface IUpdateManyInput<T> {
  data: UpdateInputData<T>[];
  select?: SelectInput<T>;
}

export interface IReplaceOneInput<T> {
  data: ReplaceInputData<T>;
  select?: SelectInput<T>;
}

export interface IReplaceManyInput<T> {
  data: ReplaceInputData<T>[];
  select?: SelectInput<T>;
}

export interface IRemoveOneInput<T> {
  data: RemoveInputData;
  select?: SelectInput<T>;
}

export interface IRemoveManyInput<T> {
  data: RemoveInputData[];
  select?: SelectInput<T>;
}
