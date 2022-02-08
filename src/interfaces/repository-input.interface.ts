export interface IFindOneInput<T> {
  filters?: FilterInput<T>;
  sort?: Record<string, any>;
  select?: Record<string, any>;
}

export type FilterInput<T, U = Partial<T>, V = {[K in keyof U]: IFilterOperator<U[K]>}> = V;

export interface IFilterCondition<T> {
  equals?: T
  not?: T
  in?: T[]
  notIn?: T[]
  lt?: T
  lte?: T
  gt?: T
  gte?: T
  contains?: T
  search?: T
  startsWith?: T
  endsWith?: T
}

export interface IFilterOperator<T> extends IFilterCondition<T> {
  AND?: IFilterCondition<T>[]
  OR?: IFilterCondition<T>[]
  NOT?: IFilterCondition<T>[]
}

// ------------------------------------------------------------
// --------------- Data transformations utils -----------------
// ------------------------------------------------------------
export const mapEntries = <
  Key extends string | number,
  V,
  RetKey extends string | number,
  RV,
>(
  fn: (a: [Key, V]) => [RetKey, RV],
  obj: Record<Key, V>,
) =>
  Object.fromEntries(Object.entries(obj).map(fn as any)) as Record<RetKey, RV>;

// ------------------------------------------------------------
// ----------------------- type-utils  ------------------------
// ------------------------------------------------------------
export type SchemaArr = {
  type: 'array';
  required?: boolean;
  items: Schema;
};

export type SchemaObject = {
  type: 'object';
  required?: boolean;
  properties: Record<string, Schema>;
};

type SchemaBoolean = {
  type: 'boolean';
  required?: boolean;
};
type SchemaString = {
  type: 'string';
  required?: boolean;
};
type SchemaNumber = {
  type: 'number';
  required?: boolean;
};

export type Schema =
  | SchemaArr
  | SchemaObject
  | SchemaString
  | SchemaNumber
  | SchemaBoolean;

type NiceMerge<T, U, T0 = T & U, T1 = { [K in keyof T0]: T0[K] }> = T1;

type MakeOptional<T, Required extends boolean> = Required extends true
  ? T
  : T | undefined;

export type InferSchemaType<T extends Schema> = T extends {
  type: 'object';
  properties: infer U;
}
  ? // @ts-expect-error
    { [K in keyof U]: InferSchemaType<U[K]> }
  : T extends { type: 'array'; items: any }
  ? // @ts-expect-error
    MakeOptional<InferSchemaType<T['items']>[], T['required']>
  : T extends { type: 'boolean' }
  ? // @ts-expect-error
    MakeOptional<boolean, T['required']>
  : T extends { type: 'string' }
  ? // @ts-expect-error
    MakeOptional<string, T['required']>
  : T extends { type: 'number' }
  ? // @ts-expect-error
    MakeOptional<number, T['required']>
  : never;

// ------------------------------------------------------------
// ------------------ helper json builders --------------------
// ------------------------------------------------------------
const stringType = () => ({
  type: 'string' as const,
  required: false as const,
});

const nonNullable = <T extends { required: any }>(
  a: T,
): NiceMerge<Omit<T, 'required'>, { required: true }> => ({
  ...a,
  required: true as const,
});

const objectType = <T>(a: T) => ({
  type: 'object' as const,
  properties: a,
  required: false as const,
});

// ------------------------------------------------------------
// ---------------------- define schema  ----------------------
// ------------------------------------------------------------

const mySchema = nonNullable(
  objectType({
    id: nonNullable(stringType()),
    name: stringType(),
  }),
);

const mySchemaRaw = {
  type: 'object' as const,
  properties: {
    key1: {
      type: 'number' as const,
      required: true as const,
    },
    key2: {
      type: 'string' as const,
      required: false as const,
    },
  },
  required: false as const,
};

type SchemaType1 = InferSchemaType<typeof mySchema>;
type SchemaType2 = InferSchemaType<typeof mySchemaRaw>;
