import {
  ConsultationActionType,
  ConsultationExceptionListResponse,
  ConsultationExceptionAddEditModel
} from "./Type";
import {
  Cancellation,
  Connect,
  makeCancellationTokenAndSource,
  sendRequest
} from "../essentials-tools/connector/Requester";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";
import {
  initialListResponse,
  initialDataResponse
} from "../essentials-tools/initial-response/InitialResponse";
import {
  checkListResponse,
  checkDataResponse
} from "../essentials-tools/check-response/CheckResponse";
import { hostName } from "../../service/constants/defaultValues";
import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";

let axiosSource: Cancellation;
let typeOf: "list" | "add" | "edit" | "delete" = "list";

export function onListResponse(
  response: ConsultationExceptionListResponse
): ConsultationActionType {
  return { type: "CONSULTATION_EXCEPTION_LIST", response };
}

export function onAddResponse(
  response: ApplicationDataResponse
): ConsultationActionType {
  return { type: "CONSULTATION_EXCEPTION_ADD", response };
}

export function onEditResponse(
  response: ApplicationDataResponse
): ConsultationActionType {
  return { type: "CONSULTATION_EXCEPTION_EDIT", response };
}

export function onDeleteResponse(
  response: ApplicationDataResponse
): ConsultationActionType {
  return { type: "CONSULTATION_EXCEPTION_DELETE", response };
}


function onResponse(response: any, dispatch: any) {
  switch (typeOf) {
    case "list":
      dispatch(onListResponse(checkListResponse(response)));
      break;
    case "add":
      dispatch(onAddResponse(checkDataResponse(response)));
      break;
    case "edit":
      dispatch(onEditResponse(checkDataResponse(response)));
      case "delete":
    dispatch(onDeleteResponse(checkDataResponse(response)))
    default:
      break;
  }
}

export function consultationExceptionList(requestBody: PaginationRequestBody) {
  typeOf = "list";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/appointment-exception/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function consultationExceptionAdd(
  requestBody: ConsultationExceptionAddEditModel
) {
  typeOf = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/appointment-exception/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}

export function consultationExceptionEdit(requestBody: any) {
  typeOf = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/appointment-exception/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}

export function consultationExceptionDelete(id : string) {
  typeOf = "delete";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody : {
        Id : id
      },
      url: `${hostName}/api/appointment-exception/delete`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}