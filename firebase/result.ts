export type Result<T> = {
  message: string;
  data: T | undefined;
  isSuccess: boolean;
};
