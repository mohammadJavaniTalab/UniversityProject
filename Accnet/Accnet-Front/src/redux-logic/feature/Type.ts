import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { NameIdModel } from "../essentials-tools/type/Basic-Object-type";
import { PermissionModel } from "../permission/Type";

export interface FeatureAddEditModel {
  name: string;
  permissions: Array<number>;
  id?: string;
}

export interface FeatureModel {
  name: string;
  permissions: Array<PermissionModel>;
  id: string;
}

export interface FeatureListType {
  type: "FEATURE_LIST";
  response: ApplicationListResponse;
}

export interface FeatureSelectLoadingType {
  type: "FEATURE_SELECT_LOADING"
}

export interface FeatureAddType {
  type: "FEATURE_ADD";
  response: ApplicationListResponse;
}

export interface FeatureEditType {
  type: "FEATURE_EDIT";
  response: ApplicationListResponse;
}

export type FeatureActionType =
  | FeatureListType
  | FeatureAddType
  | FeatureEditType
  | FeatureSelectLoadingType
