import {
  LinkedUserActionType,
  LinkedUserModel,
  LinkedUserEditModel
} from "./Type";
import {
  Cancellation,
  Connect,
  makeCancellationTokenAndSource,
  sendRequest
} from "../essentials-tools/connector/Requester";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { checkListResponse } from "../essentials-tools/check-response/CheckResponse";
import { hostName } from "../../service/constants/defaultValues";
import { IdModel } from "../essentials-tools/type/Basic-Object-type";

let typeOf: "join-request" | "list" | "add" | "edit" | "accept-request" =
  "list";

export function onListResponse(
  response: ApplicationListResponse
): LinkedUserActionType {
  return { type: "LINK_USER-LIST", response };
}

export function onAddResponse(
  response: ApplicationListResponse
): LinkedUserActionType {
  return { type: "LINK_USER-ADD", response };
}

export function onEditResponse(
  response: ApplicationListResponse
): LinkedUserActionType {
  return { type: "LINK_USER-EDIT", response };
}

export function onJoinRequestResponse(
  response: ApplicationListResponse
): LinkedUserActionType {
  return { type: "LINK_USER-JOIN_REQUEST", response };
}

export function onAcceptRequestResponse(
  response: ApplicationListResponse
): LinkedUserActionType {
  return { type: "LINK_USER-ACCEPT_REQUEST", response };
}

let axiosSource: Cancellation;

function onResponse(response: any, dispatch: any) {
  switch (typeOf) {
    case "list":
      dispatch(onListResponse(checkListResponse(response)));
      break;
    case "add":
      dispatch(onAddResponse(response));
      break;
    case "edit":
      dispatch(onEditResponse(response));
      break;
    case "join-request":
      dispatch(onJoinRequestResponse(response));
      break;
    case "accept-request":
      dispatch(onAcceptRequestResponse(response));
      break;
    default:
      break;
  }
}

export function linkUserList(requestBody: PaginationRequestBody) {
  typeOf = "list";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/linked-user/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function linkUserJoinRequest(requestBody: IdModel) {
  typeOf = "join-request";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/linked-user/join-request`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function linkUserAcceptRequest(requestBody: IdModel) {
  typeOf = "accept-request";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/linked-user/accept-request`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function linkUserAdd(requestBody: LinkedUserModel) {
  typeOf = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/linked-user/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function linkUserEdit(requestBody: LinkedUserEditModel) {
  typeOf = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/linked-user/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
