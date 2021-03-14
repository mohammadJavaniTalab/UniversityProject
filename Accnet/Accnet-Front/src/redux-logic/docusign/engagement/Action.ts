import { ApplicationDataResponse } from "../../essentials-tools/type/Response-type";
import { getRequest, getRequestWithAuthorization, makeCancellationTokenAndSource } from "../../essentials-tools/connector/Requester";
import { getLocalStorage, getWindowAfterSSR } from "../../../service/public";
import { hostName } from "../../../service/constants/defaultValues";

export interface EngagementResponse extends ApplicationDataResponse {
  data: string;
}

export interface FetchEngagement {
  type: "FETCH_ENGAGEMENT";
  response: EngagementResponse;
}

function onGetEngagementResponse(
  response: EngagementResponse
): FetchEngagement {
  return { type: "FETCH_ENGAGEMENT", response: response };
}

let initialStateResponse: EngagementResponse = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  success: false,
  loading: true,
  message: "",
};

function onResponse(response: any, dispatch: any) {
  dispatch(onGetEngagementResponse(response));
}

function getDocuSignCode() {
  let docuSignCode = getLocalStorage("DocuSignCode", "");
  if (docuSignCode !== undefined && docuSignCode !== null && docuSignCode !== ""){
      return docuSignCode
  }
  return ""
}

function removeCode(){
  if (getWindowAfterSSR()){
    localStorage.removeItem("DocuSignCode")
  }
}

export function getEngagementRedirectUrl(taxId: string) {
    let code = getDocuSignCode()
    removeCode()
    let url : string = `${hostName}/api/blob/engagement/${code}/${taxId}`
    return function implementFetchEngagementRedirectUrl(dispatch : any){
        getRequestWithAuthorization(url , onResponse, initialStateResponse , dispatch , makeCancellationTokenAndSource())
    }
}
