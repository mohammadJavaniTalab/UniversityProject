import { UpdateSurveyState, SurveyStateUpdateResponse } from "./Type";
import {
  Cancellation,
  makeCancellationTokenAndSource,
  Connect,
  sendRequest,
} from "../../essentials-tools/connector/Requester";
import { hostName } from "../../../service/constants/defaultValues";

function onUpdateSurveyStateResponse(
  response: SurveyStateUpdateResponse
): UpdateSurveyState {
  return { type: "UPDATE_SURVEY_STATE", response: response };
}

let axiosSource: Cancellation;
let initialStateResponse: SurveyStateUpdateResponse = {
  data: {},
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
  success: false,
};

function onResponse(response: any, dispatch: any) {
  dispatch(onUpdateSurveyStateResponse(response));
}

export function updateSurvey(surveyId: string) {
  return function implementSurveyUpdate(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: {},
      url: `${hostName}​/api/user-survey/pay-now?surveyId=${surveyId}`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialStateResponse, dispatch);
  };
}
