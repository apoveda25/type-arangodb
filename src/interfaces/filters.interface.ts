export interface IFilterConditionParser {
  equals?: string | number | boolean;
  not?: string | number | boolean;
  in?: string[] | number[] | boolean[];
  notIn?: string[] | number[] | boolean[];
  lt?: string | number | boolean;
  lte?: string | number | boolean;
  gt?: string | number | boolean;
  gte?: string | number | boolean;
  contains?: string;
  notContains?: string;
  startsWith?: string;
  endsWith?: string;
}

export interface IFilterOperatorParser extends IFilterConditionParser {
  AND?: IFilterConditionParser[];
  OR?: IFilterConditionParser[];
}

export type EqualsOperatorValue = string | number | boolean;
export type NotOperatorValue = string | number | boolean;
export type InOperatorValue = string[] | number[] | boolean[];
export type NotInOperatorValue = string[] | number[] | boolean[];
export type LtOperatorValue = string | number | boolean;
export type LteOperatorValue = string | number | boolean;
export type GtOperatorValue = string | number | boolean;
export type GteOperatorValue = string | number | boolean;
export type ContainsOperatorValue = string;
export type NotContainsOperatorValue = string;
export type StartsWithOperatorValue = string;
export type EndsWithOperatorValue = string;
export type AndOperatorValue = IFilterConditionParser[];
export type OrOperatorValue = IFilterConditionParser[];

export type EntriesFilterOperator =
  | ['equals', EqualsOperatorValue]
  | ['not', NotOperatorValue]
  | ['in', InOperatorValue]
  | ['notIn', NotInOperatorValue]
  | ['lt', LtOperatorValue]
  | ['lte', LteOperatorValue]
  | ['gt', GtOperatorValue]
  | ['gte', GteOperatorValue]
  | ['contains', ContainsOperatorValue]
  | ['notContains', NotContainsOperatorValue]
  | ['startsWith', StartsWithOperatorValue]
  | ['endsWith', EndsWithOperatorValue]
  | ['AND', AndOperatorValue]
  | ['OR', OrOperatorValue];

export type ValueFilterOperator =
  | EqualsOperatorValue
  | NotOperatorValue
  | InOperatorValue
  | NotInOperatorValue
  | LtOperatorValue
  | LteOperatorValue
  | GtOperatorValue
  | GteOperatorValue
  | ContainsOperatorValue
  | NotContainsOperatorValue
  | StartsWithOperatorValue
  | EndsWithOperatorValue
  | AndOperatorValue
  | OrOperatorValue;
