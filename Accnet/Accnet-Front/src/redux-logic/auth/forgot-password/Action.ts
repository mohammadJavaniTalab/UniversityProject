import { ForgotPasswordActionType, ForgotPasswordResponse } from "./Type";
import { checkDataResponse } from "../../essentials-tools/check-response/CheckResponse";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource
} from "../../essentials-tools/connector/Requester";
import { initialDataResponse } from "../../essentials-tools/initial-response/InitialResponse";
import { hostName } from "../../../service/constants/defaultValues";

let axiosSource: Cancellation;

export function onForgotPassword(
  response: ForgotPasswordResponse
): ForgotPasswordActionType {
  return { type: "FORGOT_PASSWORD", response };
}

export function loading(): ForgotPasswordActionType {
  return { type: "FORGOT_PASSWORD_LOADING" };
}

function onResponse(response: any, dispatch: any) {
  dispatch(onForgotPassword(checkDataResponse(response)));
}

export function forgotPassword(requestBody: any) {
  return function request(dispatch: any) {
    dispatch(loading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/auth/forgot-password`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}
