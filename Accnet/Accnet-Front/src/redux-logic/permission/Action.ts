import { PermissionActionType } from "./Type";
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
): PermissionActionType {
  return { type: "PERMISSION_LIST", response };
}


let axiosSource: Cancellation;

function onResponse(response: any, dispatch: any) {
  switch (typeOf) {
    case "list":
      dispatch(onListResponse(checkListResponse(response)));
      break;
    default:
      break;
  }
}

export function permissionList(requestBody: PaginationRequestBody) {
  typeOf = "list";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/permission/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
