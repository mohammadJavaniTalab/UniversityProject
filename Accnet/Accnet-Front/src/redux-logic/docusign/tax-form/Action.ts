import { ApplicationDataResponse } from "../../essentials-tools/type/Response-type";
import { getRequest, getRequestWithAuthorization, makeCancellationTokenAndSource } from "../../essentials-tools/connector/Requester";
import { getLocalStorage, getWindowAfterSSR } from "../../../service/public";
import { hostName } from "../../../service/constants/defaultValues";

export interface TaxFormResponse extends ApplicationDataResponse {
  data: string;
}

export interface FetchTaxForm {
  type: "FETCH_TAX_FORM";
  response: TaxFormResponse;
}

function onGetTaxFormResponse(
  response: TaxFormResponse
): FetchTaxForm {
  return { type: "FETCH_TAX_FORM", response: response };
}

let initialStateResponse: TaxFormResponse = {
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
  dispatch(onGetTaxFormResponse(response));
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

export function getTaxFormRedirectUrl(taxId: string) {
    let code = getDocuSignCode()
    removeCode()
    let url : string = `${hostName}/api/blob/personalTax/${code}/${taxId}`
    return function implementFetchTaxFormRedirectUrl(dispatch : any){
        getRequestWithAuthorization(url , onResponse, initialStateResponse , dispatch , makeCancellationTokenAndSource())
    }
}
