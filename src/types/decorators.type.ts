declare type ClassDecoratorType = <TFunction extends Function>(
  target: TFunction,
) => TFunction | void;
declare type PropertyDecoratorType = (
  target: Function | Object,
  propertyKey: string,
) => void;
// declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
// declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
