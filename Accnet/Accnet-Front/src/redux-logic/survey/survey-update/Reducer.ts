import { SurveyStateUpdateResponse, UpdateSurveyState } from "./Type";

const initialStateResponse: SurveyStateUpdateResponse = {
  data: {},
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
  success: false,
};

let currentStateValue: SurveyStateUpdateResponse = {
  ...initialStateResponse,
};

export function surveyUpdateReducer(
  state = initialStateResponse,
  action: UpdateSurveyState
): SurveyStateUpdateResponse {
  switch (action.type) {
    case "UPDATE_SURVEY_STATE":
      currentStateValue = {
        ...action.response,
        loading: false
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
}
