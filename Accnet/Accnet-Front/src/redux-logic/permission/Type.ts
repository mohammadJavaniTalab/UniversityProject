import { ApplicationListResponse } from "../essentials-tools/type/Response-type";

export interface PermissionModel {
  name: string
  id: number
}

export interface  PermissionListResponse extends ApplicationListResponse{
  items: Array<PermissionModel>;
} 

export interface PermissionListType {
  type: "PERMISSION_LIST"
  response: ApplicationListResponse
}

export type PermissionActionType = PermissionListType 
