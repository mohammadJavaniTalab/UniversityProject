import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { FeatureModel } from "../feature/Type";

export interface RoleAddEditModel {
  name: string
  feature: Array<string> 
  id?: string //-------------->>>>>>> deleted for add 
}


export interface RoleModel {
  name: string
  feature: Array<FeatureModel>  
  id: string 
}

export interface  RoleListResponse extends ApplicationListResponse{
  items: Array<RoleModel>;
} 


export interface RoleListType {
  type: "ROLE_LIST"
  response: ApplicationListResponse
}

export interface RoleAddType {
  type: "ROLE_ADD"
  response: ApplicationListResponse
}

export interface RoleEditType {
  type: "ROLE_EDIT"
  response: ApplicationListResponse
}
export interface RoleSelectLoadingType {
  type: "ROLE_SELECT_LOADING"
}

export type RoleActionType = RoleListType | RoleAddType | RoleEditType | RoleSelectLoadingType
