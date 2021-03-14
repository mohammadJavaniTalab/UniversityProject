import { RoleActionType, RoleModel } from "./Type";
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

let typeOf: string = "list";

export function onListResponse(
  response: ApplicationListResponse
): RoleActionType {
  return { type: "ROLE_LIST", response };
}

export function onAddResponse(
  response: ApplicationListResponse
): RoleActionType {
  return { type: "ROLE_ADD", response }; 
}

export function onEditResponse(
  response: ApplicationListResponse
): RoleActionType {
  return { type: "ROLE_EDIT", response };
}

export function onSelectLoading(): RoleActionType {
  return { type: "ROLE_SELECT_LOADING" };
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
    default:
      break;
  }
}

export function roleList(requestBody: PaginationRequestBody) {
  typeOf = "list";
  return function request(dispatch: any) {
    dispatch(onSelectLoading())
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/role/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function roleAdd(requestBody: RoleModel) {
  typeOf = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/role/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function roleEdit(requestBody: RoleModel) {
  typeOf = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/role/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
