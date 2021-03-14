import {
  ApplicationDataResponse,
  BasicGenderModel,
} from "../../../essentials-tools/type/Response-type";
import { UserModel } from "../../../user/Type";

export interface EditProfileModel {
  avatarId: string; //
  receipts: Array<string>;
  password: string; //
  dateOfBirth: string;
  postalCode: string; //
  address: string; //
  latitude: number;
  longtitude: number;
  maritalStatus: number;
  sinNumber: string;
  gender: BasicGenderModel;
  id: string;
}

export interface ProfileChangePasswordModel {
  newPassword: string;
}

export interface ProfileResponse extends ApplicationDataResponse {
  data: UserModel;
}

export interface ProfileType {
  type: "PROFILE_UPDATE";
  response: any;
}

export interface ProfileLoadingType {
  type: "PROFILE_LOADING";
}

export interface ProfileChangePasswordType {
  type: "PROFILE_CHANGE_PASSWORD";
  response: any;
}

export type ProfileActionType =
  | ProfileType
  | ProfileLoadingType
  | ProfileChangePasswordType;
