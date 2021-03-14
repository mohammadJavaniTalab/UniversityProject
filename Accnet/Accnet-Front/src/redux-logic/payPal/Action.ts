import {
  PayPalActionType,
  PayPalCreateOrderResponseModel
} from "./Type";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource
} from "../essentials-tools/connector/Requester";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { hostName } from "../../service/constants/defaultValues";

let axiosSource: Cancellation;
let typeOfRequest: "create-order" | "capture-order" = "create-order";

function createOrderResponse(
  response: PayPalCreateOrderResponseModel
): PayPalActionType {
  return { type: "PAY_PAL_CREATE_ORDER", response };
}

function loading(): PayPalActionType {
  return { type: "PAY_PAL_LOADING" };
}

function captureOrderResponse(
  response: PayPalCreateOrderResponseModel
): PayPalActionType {
  return { type: "PAY_PAL_CAPTURE_ORDER", response };
}

function onResponse(response: any, dispatch: any) {
  switch (typeOfRequest) {
    case "create-order":
      dispatch(createOrderResponse(response));
      break;
    case "capture-order":
      dispatch(captureOrderResponse(response));
      break;
  }
} 

export function payPalCreateOrder(requestBody: PayPalCreateOrderResponseModel) {
  typeOfRequest = "create-order";
  return function request(dispatch: any) {
    dispatch(loading())
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/message/create-order`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function payPalCaptureOrder(
  requestBody: PayPalCreateOrderResponseModel
) {
  typeOfRequest = "capture-order";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/message/capture-order`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
