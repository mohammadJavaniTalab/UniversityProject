import { ProfileActionType } from "./Type";
import { checkDataResponse } from "../../../essentials-tools/check-response/CheckResponse";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource,
} from "../../../essentials-tools/connector/Requester";
import { initialDataResponse } from "../../../essentials-tools/initial-response/InitialResponse";
import { hostName } from "../../../../service/constants/defaultValues";

let axiosSource: Cancellation;
let typeOf: "change-password" | "update-profile" = "update-profile";

export function onProfileData(response: any): ProfileActionType {
  return { type: "PROFILE_UPDATE", response };
}

export function onChangePassword(response: any): ProfileActionType {
  return { type: "PROFILE_CHANGE_PASSWORD", response };
}

export function profileLoading(): ProfileActionType {
  return { type: "PROFILE_LOADING" };
}

function onResponse(response: any, dispatch: any) {
  switch (typeOf) {
    case "update-profile":
      dispatch(onProfileData(checkDataResponse(response)));
      break;
    case "change-password":
      dispatch(onChangePassword(checkDataResponse(response)));
      break;
    default:
      break;
  }
}

export function updateProfile(requestBody: any, placeid: string) {
  typeOf = "update-profile";
  return function request(dispatch: any) {
    dispatch(profileLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/auth/update-profile?placeid=${placeid}`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}

export function changePassword(requestBody: any) {
  typeOf = "change-password";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/auth/change-password`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}
