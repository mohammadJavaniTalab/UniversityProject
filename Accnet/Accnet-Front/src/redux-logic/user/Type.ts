import { RoleModel } from "../role/Type";
import {
  ApplicationListResponse,
  BasicGenderModel,
  ApplicationDataResponse,
} from "../essentials-tools/type/Response-type";

export interface UserAddEditModel {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  postalCode: string;
  address: string;
  latitude: number;
  longtitude: number;
  maritualStatus: number;
  enabled: boolean;
  gender: BasicGenderModel;
  sinNumber: string;
  roleId: string;
  id?: string;
}

export interface UserPaginationRequestBody {
  PageNumber: number;
  PageSize: number;
  RoleId: string;
}

export interface OrganizationModel {
  name: string;
  tier: number;
  enabled: boolean;
  user: string;
  id: string;
}

export interface UserModel {
  tuitionFee : boolean
  creationDate: string;
  username: string;
  avatarId: string;
  unitNumber : string
  province : string
  city : string
  poBox : string
  password: string;
  receipts: Array<string>;
  extraFiles : Array<string>
  assessments : Array<string>
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  postalCode: string;
  address: string;
  latitude: number;
  longtitude: number;
  linkStatus: number;
  status: number;
  sinNumber: string;
  maritualStatus: number;
  enabled: boolean;
  gender: BasicGenderModel;
  completedProfile : boolean
  organization: OrganizationModel;
  role: RoleModel;
  hasDoneSurvey: boolean;
  unreadMessages: number;
  unpaidInvoices: number;
  uncheckedTaxes: number;
  uncheckedRequestLinks: number;
  maritalStatus: number;
  relationType : string
  id: string;
}

export interface UserListResponse extends ApplicationListResponse {
  items: Array<UserModel>;
}

export interface UserSearchResponse extends ApplicationDataResponse {
  data: UserModel;
}

export interface UserListType {
  type: "USER_LIST";
  response: UserListResponse;
}

export interface UserSearchType {
  type: "USER_SEARCH";
  response: UserSearchResponse;
}

export interface UserAddType {
  type: "USER_ADD";
  response: UserListResponse;
}

export interface UserEditType {
  type: "USER_EDIT";
  response: UserListResponse;
}

export interface UserDeleteType {
  type: "USER_DELETE";
  response: UserListResponse;
}

export interface UserSelectLoadingType {
  type: "USER_SELECT_LOADING";
}

export type UserActionType =
  | UserListType
  | UserAddType
  | UserEditType
  | UserDeleteType
  | UserSearchType
  | UserSelectLoadingType;
