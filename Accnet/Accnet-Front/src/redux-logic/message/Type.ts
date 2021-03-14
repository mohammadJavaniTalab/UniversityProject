import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";

export const messagePriorityObject = {
  1: "Low",
  2: "Medium",
  3: "High"
}

export type MessagePriorityType = 1 | 2 | 3

interface BasicMessageModel {
  title: string;
  body: string;
  priority: MessagePriorityType;
  enabled: boolean;
}

export interface MessageAddModel extends BasicMessageModel {
  toUser: string;

}

export interface MessageEditModel extends BasicMessageModel{
  id: string;
} 

export interface MessageModel extends BasicMessageModel{
  fromUser: UserModel;
  toUser: UserModel;
  creationDate: string;
  id: string;
}

export interface MessageResponse extends ApplicationListResponse {
  items: Array<MessageModel>;
}

export interface MessageListType {
  type: "MESSAGE_LIST";
  response: MessageResponse;
}

export interface MessageAddType {
  type: "MESSAGE_ADD";
  response: MessageResponse;
}

export interface MessageEditType {
  type: "MESSAGE_EDIT";
  response: MessageResponse;
}

export type MessageActionType =
  | MessageAddType
  | MessageListType
  | MessageEditType;
