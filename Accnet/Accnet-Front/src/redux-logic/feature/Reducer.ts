import { FeatureActionType } from "./Type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";

let currentStateValue: ApplicationListResponse = {
  ...initialListResponse,
  loading: true
};

export const featureReducer = (
  state = {},
  action: FeatureActionType
): ApplicationListResponse => {
  switch (action.type) {
    case "FEATURE_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;

    case "FEATURE_ADD":
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

    case "FEATURE_EDIT":
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

    case "FEATURE_SELECT_LOADING":
      currentStateValue = {
        ...currentStateValue,
        updateList: false,
        selectLoading: true
      };
      return currentStateValue;

      break;

    default:
      return currentStateValue;
  }
};
