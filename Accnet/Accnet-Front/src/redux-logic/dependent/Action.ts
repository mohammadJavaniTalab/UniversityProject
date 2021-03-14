import {
  Dependent_Add_Delete_Response,
  DependentsListResponse,
  FetchDependentsList,
  Dependent,
  DependentsAllActionTypes,
} from "./Type";
import {
  Cancellation,
  makeCancellationTokenAndSource,
  Connect,
  sendRequest,
} from "../essentials-tools/connector/Requester";
import { hostName } from "../../service/constants/defaultValues";

function onAddDependentResponse(
  response: Dependent_Add_Delete_Response
): DependentsAllActionTypes {
  return { type: "ADD_DEPENDENT", response: response };
}


export function onDoingAdd(): DependentsAllActionTypes {
  return { type: "DO_ADD_DEPENDENT" };
}

export function resetAdd(): DependentsAllActionTypes {
  return { type : "RESET_ADD" }
}

function onDeleteDependentResponse(
  response: Dependent_Add_Delete_Response
): DependentsAllActionTypes {
  return { type: "DELETE_DEPENDENT", response: response };
}

function onFetchListResponse(
  response: DependentsListResponse
): FetchDependentsList {
  return { type: "FETCH_DEPENDENTS_LIST", response: response };
}

let listInitialStateResponse: DependentsListResponse = {
  data: [],
  success: false,
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
};

let add_delete_initialStateResponse: Dependent_Add_Delete_Response = {
  data: "",
  success: false,
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
};

let axiosSource: Cancellation;
let actionType: string = "LIST";
function onResponse(response: any, dispatch: any) {
  switch (actionType) {
    case "LIST":
      dispatch(onFetchListResponse(response));
      break;
    case "ADD":
      dispatch(onAddDependentResponse(response));
      break;
    case "DELETE":
      dispatch(onDeleteDependentResponse(response));
      break;
  }
}

export function fetchDependentsListBySurveyId(surveyId: string) {
  actionType = "LIST";
  return function implementFetchListDependents(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: {},
      url: `${hostName}/api/user/survey-dependents/list-by-user?surveyId=${surveyId}`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, listInitialStateResponse, dispatch);
  };
}

export function addAlreadyAccNetUser(dependent : any){
  actionType = "ADD";
  let url = `${hostName}/api/user/survey-dependent/add`


  return function implementAddRelative(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: dependent,
      url: url,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, add_delete_initialStateResponse, dispatch);
  };
}

export function addDependentByModel(
  dependent: Dependent,
  placeId: string,
  surveyId: string,
) {
  actionType = "ADD";
  let url = `${hostName}/api/auth/advanced-register?`
  if (placeId !== undefined && placeId !== null && placeId !== ""){
    url += `placeid=${placeId}&`
  }
  url += `surveyId=${surveyId}`;

  return function implementAddRelative(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: dependent,
      url: url,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, add_delete_initialStateResponse, dispatch);
  };
}

export function deleteDependentById(dependentId: string, surveyId : string) {
  actionType = "DELETE";
  return function implementDeleteDependent(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: {},
      url: `${hostName}/api/user/survey-dependents/delete?surveyId=${surveyId}&linkedUserId=${dependentId}`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, add_delete_initialStateResponse, dispatch);
  };
}
