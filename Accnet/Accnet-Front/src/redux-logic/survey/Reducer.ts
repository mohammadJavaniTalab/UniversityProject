import { SurveyActionType, SurveyResponse } from "./Type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";

let currentStateValue: SurveyResponse = {
  ...initialListResponse,
  loading: true
};

export const surveyReducer = (
  state = {},
  action: SurveyActionType
): SurveyResponse => {
  switch (action.type) {
    case "SURVEY_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;
    case "SURVEY_ADD":
      if (action.response.success) {
        getNotification("Successfully added");
      } else {
        getNotification("Adding failed");
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true
      };
      return currentStateValue;
    case "SURVEY_EDIT":
      if (action.response.success) {
        getNotification("Successfully edited");
      } else {
        getNotification("Editing failed");
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};
