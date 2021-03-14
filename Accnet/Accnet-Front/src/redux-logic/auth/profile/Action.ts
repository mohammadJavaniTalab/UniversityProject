import { ProfileActionType, ProfileSmallType } from "./Type";
import { checkDataResponse } from "../../essentials-tools/check-response/CheckResponse";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource,
} from "../../essentials-tools/connector/Requester";
import { initialDataResponse } from "../../essentials-tools/initial-response/InitialResponse";
import { initialUserModel } from "./InitialResponse";
import { hostName } from "../../../service/constants/defaultValues";

let axiosSource: Cancellation;

export function onProfileData(response: any): ProfileActionType {
  return { type: "PROFILE", response };
}

export function resetProfile(): ProfileActionType {
  return { type: "PROFILE_LOADING" }
}

export function onSmallProfileData(response: any): ProfileSmallType {
  return { type: "PROFILE_SMALL", response: response };
}

function onResponse(response: any, dispatch: any) {
  dispatch(onProfileData(checkDataResponse(response)));
}

function smallOnResponseFunction(response: any, dispatch: any) {
  dispatch(onSmallProfileData(checkDataResponse(response)));
}

export function profile() {
  const requestBody = {};

  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/auth/profile`,
      sourceToken: axiosSource,
    };
    sendRequest(
      connect,
      onResponse,
      { data: initialUserModel, ...initialDataResponse },
      dispatch
    );
  };
}

export function halfProfile() {
  const requestBody = {};

  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/auth/setting`,
      sourceToken: axiosSource,
    };
    sendRequest(
      connect,
      smallOnResponseFunction,
      { data: initialUserModel, ...initialDataResponse },
      dispatch
    );
  };
}
