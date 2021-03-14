import { MessageActionType, MessageAddModel, MessageResponse } from "./Type";
import { checkListResponse } from "../essentials-tools/check-response/CheckResponse";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource
} from "../essentials-tools/connector/Requester";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { hostName } from "../../service/constants/defaultValues";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";

let axiosSource: Cancellation; 
let typeOfRequest: string;

export function onListResponse(response: MessageResponse): MessageActionType {
  return { type: "MESSAGE_LIST", response };
}

export function onAddResponse(response: MessageResponse): MessageActionType {
  return { type: "MESSAGE_ADD", response };
}

export function onEditResponse(response: MessageResponse): MessageActionType {
  return { type: "MESSAGE_EDIT", response };
}

function onResponse(response: any, dispatch: any) {
  switch (typeOfRequest) {
    case "list":
      dispatch(onListResponse(checkListResponse(response)));
      break;
    case "add":
      dispatch(onAddResponse(response));
      break;
    case "edit":
      dispatch(onEditResponse(response));
      break;
    default:
      break;
  }
}

export function messageList(requestBody: PaginationRequestBody) {
  if (axiosSource !== undefined && axiosSource !== null) {
    axiosSource.source.cancel("Canceled By System")
  }
  return List(requestBody)
}
 
function List(requestBody: PaginationRequestBody) {
  typeOfRequest = "list";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/message/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function messageAdd(requestBody: MessageAddModel) {
  typeOfRequest = "add"; 
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/message/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function messageEdit(requestBody: MessageAddModel) {
  typeOfRequest = "edit"; 
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/message/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
