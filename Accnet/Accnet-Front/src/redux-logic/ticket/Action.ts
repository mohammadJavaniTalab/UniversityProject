import {
  TicketListResponse,
  TicketActionType,
  TicketAddModel,
  TicketEditModel
} from "./Type";
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
let typeOfRequest: string = "list";

export function onList(response: TicketListResponse): TicketActionType {
  return { type: "TICKET_LIST", response };
}

export function onAdd(response: TicketListResponse): TicketActionType {
  return { type: "TICKET_ADD", response };
}

export function onEdit(response: TicketListResponse): TicketActionType {
  return { type: "TICKET_EDIT", response };
}

function onResponse(response: any, dispatch: any) {
  switch (typeOfRequest) {
    case "list":
      dispatch(onList(checkListResponse(response)));
      break;
    case "add":
      dispatch(onAdd(response));
      break;
    case "edit":
      dispatch(onEdit(response));
      break;

    default:
      break;
  }
}

export function ticketList(requestBody: PaginationRequestBody) {
  typeOfRequest = "list";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource(); 
    const connect: Connect = { 
      headers: [],
      requestBody,
      url: `${hostName}/api/ticket/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function ticketAdd(requestBody: TicketAddModel) {
  typeOfRequest = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/ticket/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function ticketEdit(requestBody: TicketEditModel) {
  typeOfRequest = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/ticket/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
