import { SpouseResponse, SpouseAllActionTypes, SpouseModel, FetchSpouse, FetchSpouseResponse } from "./Type";
import {
  Connect,
  makeCancellationTokenAndSource,
  sendRequest,
} from "../essentials-tools/connector/Requester";
import { hostName } from "../../service/constants/defaultValues";
import { initialUserModel } from "../auth/profile/InitialResponse";
import { linkedUserStatusObject } from "../link_user/Type";

function onAddSpouseResponse(response: SpouseResponse): SpouseAllActionTypes {
  return { type: "ADD_SPOUSE", response: response };
}

export function onDoingAdd(): SpouseAllActionTypes {
  return { type: "DO_ADD_SPOUSE" };
}

export function resetAdd(): SpouseAllActionTypes {
  return { type : "RESET_ADD" }
}

function onFetchSpouseResponse(response: FetchSpouseResponse): FetchSpouse {
  return { type: "FETCH_SPOUSE", response: response };
}

let initialStateResponse: SpouseResponse = {
  data: {},
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
  success: false,
};

let initialStateFetch : FetchSpouseResponse = {
  data : {
    firstUser : {
      ...initialUserModel
    },
    secondUser : {
      ...initialUserModel
    },
    id : "",
    relationType : "",
    status : 1
  },
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
  success: false,
}

let actionType: string = "FETCH";
function onResponse(response: any, dispatch: any) {
  switch (actionType) {
    case "FETCH":
      dispatch(onFetchSpouseResponse(response));
      break;
    case "ADD":
      dispatch(onAddSpouseResponse(response));
      break;
  }
}

export function fetchSpouse(surveyId: string) {
  actionType = "FETCH";
  return function implementFetchSpouse(dispatch: any) {
    const connect: Connect = {
      headers: [],
      requestBody: {},
      sourceToken: makeCancellationTokenAndSource(),
      url: `${hostName}​/api/user/survey-dependents/get-spouse?surveyId=${surveyId}`,
    };
    sendRequest(connect, onResponse, initialStateFetch, dispatch);
  };
}

export function addSpouse(spouseModel: SpouseModel, surveyId: string) {
  actionType = "ADD";
  return function implementAddResponse(dispatch: any) {
    const connect: Connect = {
      headers: [],
      requestBody: spouseModel,
      sourceToken: makeCancellationTokenAndSource(),
      url: `${hostName}/api/user/survey-dependents/add-spouse?surveyId=${surveyId}`,
    };
    sendRequest(connect, onResponse, initialStateResponse, dispatch);
  };
}
