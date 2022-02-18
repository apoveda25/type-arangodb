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
