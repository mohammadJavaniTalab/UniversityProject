import { TaxActionType, BasicTaxModel } from "./Type";
import { checkListResponse } from "../essentials-tools/check-response/CheckResponse";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource,
  getRequestWithAuthorization,
  authorizedDownload
} from "../essentials-tools/connector/Requester";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { hostName, surveyBlobDownload } from "../../service/constants/defaultValues";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";

let axiosSource: Cancellation;
let typeOfRequest: string = "list";

export function onListResponse(response: any): TaxActionType {
  return { type: "TAX_LIST", response };
}

export function onAddResponse(response: any): TaxActionType {
  return { type: "TAX_ADD", response };
}

export function onEditResponse(response: any): TaxActionType {
  return { type: "TAX_EDIT", response };
}
  
function onResponse(response: any, dispatch: any) {
  switch (typeOfRequest) {
    case "list":
      dispatch(onListResponse(checkListResponse(response)));
      break;

    case "add":
      dispatch(onAddResponse(response));
      break;

    case "edit":
      dispatch(onEditResponse(response));
      break;
      
    default:
      break;
  }
}

export function taxList(requestBody: PaginationRequestBody) {
  typeOfRequest = "list";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/tax/list`,
      sourceToken: axiosSource 
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function taxAdd(requestBody: BasicTaxModel) {
  typeOfRequest = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/tax/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function taxEdit(requestBody: BasicTaxModel) {
  typeOfRequest = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/tax/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}


export function getSurveyDetails(surveyId : string , userId : string , mainUserName : string) {
  return function implementGetSurveyDetails(dispatch : any){
    authorizedDownload(`${surveyBlobDownload}${userId}/${surveyId}`, mainUserName )
  }
}