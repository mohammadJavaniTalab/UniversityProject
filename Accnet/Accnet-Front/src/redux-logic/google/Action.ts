import {
  GoogleAutoCompleteActionType,
  GoogleAutoCompleteResponse,
} from "./Type";
import { getRequest, getRequestWithAuthorization, Cancellation, makeCancellationTokenAndSource } from "../essentials-tools/connector/Requester";
import { initialDataResponse } from "../essentials-tools/initial-response/InitialResponse";
import { hostName } from "../../service/constants/defaultValues";
import { checkDataResponse } from "../essentials-tools/check-response/CheckResponse";

let typeOfRequest: "LIST" = "LIST";

const initialStatus: GoogleAutoCompleteResponse = {
  ...initialDataResponse,
  data: [],
};

export function onList(
  response: GoogleAutoCompleteResponse
): GoogleAutoCompleteActionType {
  return { type: "GOOGLE_AUTO_COMPLETE", response };
}

function onResponse(response: any, dispatch: any) {
  switch (typeOfRequest) {
    case "LIST":
      dispatch(onList(checkDataResponse(response)));
      break;
    default:
      break;
  }
}

let axiosToken : Cancellation

export function reSendGoogleAutoCompleteRequest(param: string){
  if (axiosToken !== undefined && axiosToken !== null){
    axiosToken.source.cancel('by system')
  }
  return googleAutoComplete(param)
}

function googleAutoComplete(param: string) {
  return function request(dispatch: any) {
    const url: string = `${hostName}/api/google/places/address/${param}`;
    axiosToken = makeCancellationTokenAndSource()
    getRequestWithAuthorization(url, onResponse, initialStatus, dispatch , axiosToken);
  };
}
