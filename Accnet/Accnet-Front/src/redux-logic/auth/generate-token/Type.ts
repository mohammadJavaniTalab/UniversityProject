import { ApplicationDataResponse } from "../../essentials-tools/type/Response-type";
import { FeatureModel } from "../../feature/Type";
import { RoleModel } from "../../role/Type";

export interface LoginRequestModel {
  username: string
  password: string
}

export interface LoginDataModel{
  token: string;
  role: RoleModel
}

export interface LoginResponse extends ApplicationDataResponse {
  data: LoginDataModel;
}

export interface LoginType {
  type: "LOGIN";
  response: LoginResponse;
}

export interface LogoutType {
  type: "LOGOUT"
}

export interface LoginLoadingType {
  type: "LOGIN_LOADING";
}

export type LoginActionType = LoginType | LoginLoadingType | LogoutType
