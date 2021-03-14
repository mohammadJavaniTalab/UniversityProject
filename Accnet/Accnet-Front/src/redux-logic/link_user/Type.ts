import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";

export const linkedUserStatusObject = {
  1: "Pending Link Accounts",
  2: "Admin Accepted",
  3: "User Accepted",
  4: "Cancelled"
};

export type LinkedUserStatusModel = 1 | 2 | 3 | 4;

export interface LinkedUserAddModel {
  firstUser: string;
  secondUser: string;
}

export interface LinkedUserEditModel {
  id: string;
  status: LinkedUserStatusModel;
}

export interface LinkedUserModel {
  firstUser: UserModel;
  secondUser: UserModel;
  status: LinkedUserStatusModel;
  relationType : string
  id: string;
}

export interface LinkedUserListResponse extends ApplicationListResponse {
  items: Array<LinkedUserModel>;
}

export interface LinkedUserListType {
  type: "LINK_USER-LIST";
  response: ApplicationListResponse;
}

export interface LinkedUserAddType {
  type: "LINK_USER-ADD";
  response: ApplicationListResponse;
}

export interface LinkedUserEditType {
  type: "LINK_USER-EDIT";
  response: ApplicationListResponse;
}

export interface LinkedUserJoinRequestType {
  type: "LINK_USER-JOIN_REQUEST";
  response: ApplicationListResponse;
}

export interface LinkedUserAcceptRequestType {
  type: "LINK_USER-ACCEPT_REQUEST";
  response: ApplicationListResponse;
}

export type LinkedUserActionType =
  | LinkedUserListType
  | LinkedUserAddType
  | LinkedUserEditType
  | LinkedUserAcceptRequestType
  | LinkedUserJoinRequestType;
