import { FeatureActionType, FeatureModel } from "./Type";
import {
  Cancellation,
  Connect,
  makeCancellationTokenAndSource,
  sendRequest
} from "../essentials-tools/connector/Requester";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { checkListResponse } from "../essentials-tools/check-response/CheckResponse";
import { hostName } from "../../service/constants/defaultValues";

let typeOf: string = "list";

export function onListResponse(
  response: ApplicationListResponse
): FeatureActionType {
  return { type: "FEATURE_LIST", response };
}

export function onAddResponse(
  response: ApplicationListResponse
): FeatureActionType {
  return { type: "FEATURE_ADD", response };
}

export function onEditResponse(
  response: ApplicationListResponse
): FeatureActionType {
  return { type: "FEATURE_EDIT", response };
}

export function selectLoading(): FeatureActionType {
  return { type: "FEATURE_SELECT_LOADING" };
}

let axiosSource: Cancellation;

function onResponse(response: any, dispatch: any) {
  switch (typeOf) {
    case "list":
      dispatch(onListResponse(checkListResponse(response)));
      break;
    case "add":
      dispatch(onAddResponse(response)); 
      break;
    case "edit":
      dispatch(onEditResponse(response));
    default:
      break;
  }
}

export function featureList(requestBody: PaginationRequestBody) {
  
  
  typeOf = "list";
  return function request(dispatch: any) {
    dispatch(selectLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/feature/list`, 
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function featureAdd(requestBody: FeatureModel) {
  typeOf = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/feature/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function featureEdit(requestBody: FeatureModel) {
  typeOf = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/feature/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
