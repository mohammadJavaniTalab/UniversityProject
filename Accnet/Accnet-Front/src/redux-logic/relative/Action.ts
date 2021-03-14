import {
  Relative_Add_Delete_Response,
  RelativeAllActionTypes,
  RelativeListResponse,
  Relative,
  FetchRelatives
} from "./Type";
import {
  Cancellation,
  makeCancellationTokenAndSource,
  Connect,
  sendRequest
} from "../essentials-tools/connector/Requester";
import { hostName } from "../../service/constants/defaultValues";

function addRelative(
  response: Relative_Add_Delete_Response
): RelativeAllActionTypes {
  return { type: "ADD_RELATIVE", response: response };
}

function deleteRelative(
  response: Relative_Add_Delete_Response
): RelativeAllActionTypes {
  return { type: "DELETE_RELATIVE", response: response };
}

function fetchRelatives(
  response: RelativeListResponse
): FetchRelatives {
  return { type: "FETCH_RELATIVES", response: response };
}

let initialListResponse: RelativeListResponse = {
  data: [],
  success: false,
  error: {
    code: 0,
    data: []
  },
  loading: true,
  message: ""
};

let initial_Add_Delete_Response: Relative_Add_Delete_Response = {
  data: "",
  success: false,
  error: {
    code: 0,
    data: []
  },
  loading: true,
  message: ""
};

let actionType: string = "LIST";
let axiosSource: Cancellation;

function onResponse(response: any, dispatch: any) {
  switch (actionType) {
    case "ADD":
      dispatch(addRelative(response));
      break;
    case "DELETE":
      dispatch(deleteRelative(response));
      break;
    case "LIST":
      dispatch(fetchRelatives(response));
  }
}

export function fetchRelativesByToken( surveyId : string) {
  actionType = "LIST";
  return function implementFetchRelatives(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: {},
      url: `${hostName}/api/relative/list-by-user?surveyId=${surveyId}`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function addRelativeByModel(relativeModel: Relative , surveyId : string) {
  actionType = "ADD";
  return function implementAddRelative(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: relativeModel,
      url: `${hostName}/api/relative/advance-create?surveyId=${surveyId}`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initial_Add_Delete_Response, dispatch);
  };
}

export function deleteRelativeById(relativeId: string) {
  actionType = "DELETE";
  return function implementDeleteRelative(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: {
        Id: relativeId
      },
      url: `${hostName}/api/relative/delete`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initial_Add_Delete_Response, dispatch);
  };
}
