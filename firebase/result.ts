export type Result<T> = Success<T> | Failure;

type Success<T> = {
  message: string;
  data: T;
  isSuccess: true;
};

type Failure = {
  message: string;
  data: undefined;
  isSuccess: false;
};
