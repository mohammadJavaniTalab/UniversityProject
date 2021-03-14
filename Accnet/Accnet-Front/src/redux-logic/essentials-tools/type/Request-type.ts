export interface PaginationRequestBody {
  Keyword?: string;
  Status?: number;
  Enabled?: boolean;
  Id?: string;
  PageNumber: number;
  PageSize: number;
  Sort?: string;
  SortDirection?: number;
  CreationDate?: string;
  UserId?: string;
}
