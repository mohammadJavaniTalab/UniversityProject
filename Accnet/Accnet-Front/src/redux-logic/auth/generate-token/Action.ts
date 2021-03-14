import { LoginActionType, LoginResponse } from "./Type";
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

export function onLoginData(response: LoginResponse): LoginActionType {
  return { type: "LOGIN", response };
}
 
export function loading(): LoginActionType {
  return { type: "LOGIN_LOADING"};
}

export function logout(): LoginActionType {
  return { type: "LOGOUT"};
}
 

function onResponse(response: any, dispatch: any) {
  const updateResponse : LoginResponse = checkDataResponse(response);
  dispatch(onLoginData({
    ...updateResponse,
    data: {
      token: updateResponse.success ? updateResponse.data.token : "" ,
      role : updateResponse.success ? updateResponse.data.role : {name: '', feature: [], id: '' }
    }
  }))
}
 
export function login(requestBody: any) {
  return function request(dispatch: any) {
    dispatch(loading())
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/auth/generate-token`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}
