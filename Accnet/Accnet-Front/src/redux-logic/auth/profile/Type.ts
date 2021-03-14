import {
  ApplicationDataResponse,
  BasicGenderModel,
} from "../../essentials-tools/type/Response-type";
import { UserModel } from "../../user/Type";

export interface EditProfileModel {
  firstname: string;
  lastname: string;
  avatarId: string;
  receipt: Array<string>;
  password: string | null;
  dateOfBirth: string;
  postalCode: string;
  address: string;
  province : string
  city : string
  unitNumber : string
  poBox : string
  latitude: number;
  longtitude: number;
  sinNumber: string;
  email: string;
  mobile: string;
  gender: BasicGenderModel;
  completedProfile : boolean
  id: string;
}

export interface ProfileResponse extends ApplicationDataResponse {
  data: UserModel;
}

export interface ProfileType {
  type: "PROFILE";
  response: any;
}

export interface ProfileLoadingType {
  type: "PROFILE_LOADING";
}

export interface ProfileUpdateType {
  type: "PROFILE_UPDATE";
  response: any;
}

export interface ProfileChangePasswordType {
  type: "PROFILE_CHANGE_PASSWORD";
  response: any;
}

export interface ProfileSmallType {
  type: "PROFILE_SMALL";
  response: any;
}

export type ProfileActionType =
  | ProfileType
  | ProfileLoadingType
  | ProfileUpdateType
  | ProfileChangePasswordType;
