export interface Error {
  code: number;
  data: Array<any>;
}

export type BasicGenderModel = "Mr" | "Mrs" | "Ms" | "Miss" | "Unknown";

export type under19RelationsTypes = 
 "Daughter"
| "Son"
| "Grand Child"
| "Aunt"
| "Brother"
| "Child"
| "Nephew"
| "Niece"
| "Sister"
| "Uncle";

export type above19RelationsType = 
| "Daughter"
  | "Son"
  | "Grand Parent"
  | "Grand Child"
  | "Aunt"
  | "Brother"
  | "Child"
  | "Nephew"
  | "Niece"
  | "Parent"
  | "Sister"
  | "Uncle";

export interface ApplicationListResponse {
  items: Array<any>;
  data: any;
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  success: boolean;
  error: Error;
  message: string;
  selectLoading: boolean;
  loading: boolean;
  updateList: boolean;
}

export interface ApplicationDataResponse {
  data: any;
  success: boolean;
  error: Error;
  message: string;
  loading: boolean;
}
