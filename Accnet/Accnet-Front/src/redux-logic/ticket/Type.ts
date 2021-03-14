import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";
import { CommentDataResponse } from "../comment/Type";

export const ticketPriorityObject = {
  1: "Low",
  2: "Medium",
  3: "High"
};

export type TicketPriorityType = 1 | 2 | 3;

interface BasicTicketModel {
  title: string;
  text: string;
  priority: TicketPriorityType;
  blobId: string;
}

export interface CommentModel {
  blobId: string;
  user: UserModel;
  creationDate: string;
  text: string;
  id: string;
}

export interface TicketAddModel extends BasicTicketModel {
  userId?: string;
  representativeId?: string;
}

export interface TicketEditModel extends BasicTicketModel {
  id: string;
}

export interface TicketListModel extends BasicTicketModel {
  user: UserModel;
  representative: string;
  creationDate: string;
  active: boolean;
  comment: Array<CommentModel>;
  id: string;
}

export interface TicketListResponse extends ApplicationListResponse {
  items: Array<TicketListModel>;
}

export interface TicketListType {
  type: "TICKET_LIST";
  response: TicketListResponse;
}

export interface TicketSelectLoadingType {
  type: "TICKET_SELECT_LOADING";
}

export interface TicketAddType {
  type: "TICKET_ADD";
  response: TicketListResponse;
}

export interface TicketEditType {
  type: "TICKET_EDIT";
  response: TicketListResponse;
}

export interface CommentAddType {
  type: "COMMENT_ADD";
  response: CommentDataResponse;
}
export interface CommentEditType {
  type: "COMMENT_EDIT";
  response: CommentDataResponse;
}
export type TicketActionType =
  | TicketListType
  | TicketAddType
  | TicketEditType
  | TicketSelectLoadingType
  | CommentAddType
  | CommentEditType;
