import {
  ApplicationDataResponse,
  BasicGenderModel,
  above19RelationsType
} from "../../essentials-tools/type/Response-type";
import { FeatureModel } from "../../feature/Type";

export interface RegisterModel {
  token: string;
  username: string;
  role: FeatureModel;
}

export interface RegisterRequestBodyModel {
  lastname: string;
  password: string;
  firstname: string;
  email: string;
  mobile: string;
  gender: BasicGenderModel;
}

export interface AdvancedRegisterRequestBodyModel {
  user: {
    avatarId: string;
    roleId: string;
    receipts: Array<string>;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    dateOfBirth: string;
    address: string;
    postalCode: string;
    sinNumber: string;
    province: string;
    city: string;
    latitude: number;
    longtitude: number;
    linkStatus: number;
    maritalStatus: number;
    gender: BasicGenderModel;
  };
  RelationType: above19RelationsType;
  surveyId: string
}

export interface RegisterResponse extends ApplicationDataResponse {
  data: RegisterModel;
}

export interface AdvanceRegisterResponse extends ApplicationDataResponse {
  data: string;
}

interface RegisterType {
  type: "REGISTER";
  response: RegisterResponse;
}

interface AdvanceRegisterType {
  type: "ADVANCE_REGISTER";
  response: AdvanceRegisterResponse;
}

interface RegisterLoadingType {
  type: "REGISTER_LOADING";
}
interface RegisterResetType {
  type: "REGISTER_RESET";
}

export type RegisterActionType =
  | RegisterType
  | AdvanceRegisterType
  | RegisterLoadingType
  | RegisterResetType;
