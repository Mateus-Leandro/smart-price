export interface IDefaultPaginatorDataSource<T> {
  pageIndex: number;
  pageSize: number;
  records: {
    data: T[];
    count: number;
  };
}
