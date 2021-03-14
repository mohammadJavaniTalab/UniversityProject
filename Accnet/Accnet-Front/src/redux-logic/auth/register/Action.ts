import {
  RegisterActionType,
  RegisterResponse,
  AdvancedRegisterRequestBodyModel,
  AdvanceRegisterResponse
} from "./Type";
import { checkDataResponse } from "../../essentials-tools/check-response/CheckResponse";

import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource
} from "../../essentials-tools/connector/Requester";
import { hostName } from "../../../service/constants/defaultValues";
import { initialDataResponse } from "../../essentials-tools/initial-response/InitialResponse";

let requestType: "register" | "advance-register" = "register";
let axiosSource: Cancellation;

export function onRegister(response: RegisterResponse): RegisterActionType {
  return { type: "REGISTER", response };
}

export function onAdvanceRegister(response: AdvanceRegisterResponse): RegisterActionType {
  return { type: "ADVANCE_REGISTER", response };
}

export function RegisterLoading() {
  return { type: "REGISTER_LOADING" };
}

export function RegisterReset() {
  return { type: "REGISTER_RESET" };
}

function onResponse(response: any, dispatch: any) {
  switch (requestType) {
    case "register":
      dispatch(onRegister(checkDataResponse(response)));
      break;
    case "advance-register":
      dispatch(onAdvanceRegister(checkDataResponse(response)));
      break;
    default:
      break;
  }
}

export function register(requestBody: any) {
  requestType = "register";
  return function request(dispatch: any) {
    dispatch(RegisterLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/auth/register`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}

export function advancedRegister(
  requestBody: AdvancedRegisterRequestBodyModel
) {
  requestType = "advance-register";
  return function request(dispatch: any) {
    dispatch(RegisterLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/auth/advanced-register`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}
