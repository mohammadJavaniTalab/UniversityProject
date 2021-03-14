import { UserActionType, UserAddEditModel, UserSearchResponse } from "./Type";
import {
  Cancellation,
  Connect,
  makeCancellationTokenAndSource,
  sendRequest
} from "../essentials-tools/connector/Requester";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import {
  initialListResponse,
  initialDataResponse
} from "../essentials-tools/initial-response/InitialResponse";
import { checkListResponse } from "../essentials-tools/check-response/CheckResponse";
import { hostName } from "../../service/constants/defaultValues";
import { IdModel } from "../essentials-tools/type/Basic-Object-type";

let typeOfRequest: "list" | "add" | "edit" | "delete" | "search-user" = "list";

export function onListResponse(
  response: ApplicationListResponse
): UserActionType {
  return { type: "USER_LIST", response };
}

export function onSearchResponse(response: UserSearchResponse): UserActionType {
  return { type: "USER_SEARCH", response };
}

export function onAddResponse(
  response: ApplicationListResponse
): UserActionType {
  return { type: "USER_ADD", response };
}

export function onDeleteResponse(
  response: ApplicationListResponse
): UserActionType {
  return { type: "USER_DELETE", response };
}

export function onEditResponse(
  response: ApplicationListResponse
): UserActionType {
  return { type: "USER_EDIT", response };
}

export function selectLoading(): UserActionType {
  return { type: "USER_SELECT_LOADING" };
}

let axiosSource: Cancellation;

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
    case "search-user":
      dispatch(onSearchResponse(response));
      break;
    case "delete":
      dispatch(onDeleteResponse(response));
      break;
    default:
      break;
  }
}

export function userList(requestBody: PaginationRequestBody) {
  typeOfRequest = "list";
  return function request(dispatch: any) {
    dispatch(selectLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function userSearch(requestBody: PaginationRequestBody) {
  if (axiosSource !== undefined && axiosSource !== null) {
    axiosSource.source.cancel("Canceled By System");
  }
  return userSearchRequest(requestBody);
}

function userSearchRequest(requestBody: PaginationRequestBody) {
  typeOfRequest = "search-user";
  return function request(dispatch: any) {
    dispatch(selectLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user/search`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}

export function userAdd(requestBody: UserAddEditModel, placeid: string) {
  typeOfRequest = "add";
  return function request(dispatch: any) {
    dispatch(selectLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user/add?placeid=${placeid}`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function userEdit(requestBody: UserAddEditModel, placeid: string) {
  typeOfRequest = "edit";
  return function request(dispatch: any) {
    dispatch(selectLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user/edit?placeid=${placeid}`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function userDelete(requestBody: IdModel) {
  typeOfRequest = "delete";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user/delete`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
