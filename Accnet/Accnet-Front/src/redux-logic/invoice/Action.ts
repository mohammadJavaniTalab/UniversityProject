import {
  InvoiceListResponse,
  InvoiceActionType,
  InvoiceAddModel,
  InvoiceEditModel
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

export function onList(response: InvoiceListResponse): InvoiceActionType {
  return { type: "INVOICE_LIST", response };
}

export function onAdd(response: InvoiceListResponse): InvoiceActionType {
  return { type: "INVOICE_ADD", response };
}

export function onEdit(response: InvoiceListResponse): InvoiceActionType {
  return { type: "INVOICE_EDIT", response };
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

export function invoiceList(requestBody: PaginationRequestBody) {
  typeOfRequest = "list";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/invoice/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function invoiceAdd(requestBody: InvoiceAddModel) {
  typeOfRequest = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/invoice/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function invoiceEdit(requestBody: InvoiceEditModel) {
  typeOfRequest = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/invoice/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
