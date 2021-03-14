import { SurveyActionType } from "./Type";
import {
  checkListResponse,
  checkDataResponse
} from "../essentials-tools/check-response/CheckResponse";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource
} from "../essentials-tools/connector/Requester";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { hostName } from "../../service/constants/defaultValues";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";

let axiosSource: Cancellation;
let typeOfResponse: string = "list";

export function onListResponse(response: any): SurveyActionType {
  return { type: "SURVEY_LIST", response };
}

export function onAddResponse(response: any): SurveyActionType {
  return { type: "SURVEY_ADD", response };
}

export function onEditResponse(response: any): SurveyActionType {
  return { type: "SURVEY_EDIT", response };
}

function onResponse(response: any, dispatch: any) {
  switch (typeOfResponse) {
    case "list":
      dispatch(onListResponse(checkListResponse(response)));
      break;
    case "add":
      dispatch(onAddResponse(checkDataResponse(response)));
      break;
    case "edit":
      dispatch(onEditResponse(checkDataResponse(response)));
      break;
    default:
      break;
  }
}

export function surveyList(requestBody: PaginationRequestBody) {
  typeOfResponse = "list";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/survey/list`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function surveyAdd(requestBody: PaginationRequestBody) {
  typeOfResponse = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/survey/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function surveyEdit(requestBody: PaginationRequestBody) {
  typeOfResponse = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/survey/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
