import {
  AppointmentActionType,
  AppointmentEditModel,
  AppointmentAddModel,
  AppointmentListModel,
} from "./Type";
import {
  Cancellation,
  Connect,
  makeCancellationTokenAndSource,
  sendRequest,
} from "../essentials-tools/connector/Requester";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { checkListResponse } from "../essentials-tools/check-response/CheckResponse";
import { hostName } from "../../service/constants/defaultValues";

let typeOf: "list" | "add" | "edit" | "delete" = "list";
let addType: "APPOINTMENT_ADD_MANAGEMENT" | "APPOINTMENT_ADD_CLIENT" =
  "APPOINTMENT_ADD_CLIENT";
"APPOINTMENT_ADD_CLIENT";
export function onListResponse(
  response: ApplicationListResponse
): AppointmentActionType {
  return { type: "APPOINTMENT_LIST", response };
}

export function onAddResponse(
  response: ApplicationListResponse
): AppointmentActionType {
  return { type: addType, response };
}

export function onEditResponse(
  response: ApplicationListResponse
): AppointmentActionType {
  return { type: "APPOINTMENT_EDIT", response };
}

export function onDeleteResponse(
  response: ApplicationListResponse
): AppointmentActionType {
  return { type: "APPOINTMENT_DELETE", response };
}

export function onSelectLoading(): AppointmentActionType {
  return { type: "APPOINTMENT_SELECT_LOADING" };
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
    case "delete":
      dispatch(onDeleteResponse(response));
      break;
    default:
      break;
  }
}

export function appointmentList(requestBody: PaginationRequestBody) {
  typeOf = "list";
  return function request(dispatch: any) {
    dispatch(onSelectLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/appointment/list`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function appointmentAddClient(requestBody: AppointmentAddModel) {
  typeOf = "add";
  addType = "APPOINTMENT_ADD_CLIENT";
  return appointmentAdd(requestBody);
}

export function appointmentAddManagement(requestBody: AppointmentAddModel) {
  typeOf = "add";
  addType = "APPOINTMENT_ADD_MANAGEMENT";
  return appointmentAdd(requestBody);
}

function appointmentAdd(requestBody: AppointmentAddModel) {
  typeOf = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/appointment/add`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function appointmentEdit(requestBody: AppointmentListModel) {
  typeOf = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/appointment/edit`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function appointmentDelete(id: string) {
  typeOf = "delete";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: {
        Id: id,
      },
      url: `${hostName}/api/appointment/delete`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
