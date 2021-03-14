import { ProfileActionType, ProfileSmallType } from "./Type";
import { initialDataResponse } from "../../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../../service/notification";
import { initialUserModel } from "./InitialResponse";


let currentStateValue: any = {
  data: initialUserModel,
  ...initialDataResponse,
  loading: true,
};

let smallCurrentStateValue: any = {
  data: initialUserModel,
  ...initialDataResponse,
  loading: true,
};

export function smallProfileReducer(
  state = initialDataResponse,
  action: ProfileSmallType
): any {
  switch (action.type) {
    case "PROFILE_SMALL":
      smallCurrentStateValue = {
        ...action.response,
      };
      return smallCurrentStateValue;
    default:
      return smallCurrentStateValue;
  }
}

export const profileReducer = (state = {}, action: ProfileActionType): any => {
  switch (action.type) {
    case "PROFILE":
      currentStateValue = {
        ...action.response,
        loading: false,
      };
      return currentStateValue;
    case "PROFILE_UPDATE":
      if (action.response.success) {
        getNotification("Successfully saved info");
        currentStateValue = {
          ...action.response,
          loading: false,
        };
      } else {
        getNotification("Failed  edited");
      }
      return currentStateValue;
    case "PROFILE_CHANGE_PASSWORD":
      if (action.response.success) {
        getNotification("Successfully changed password");
        currentStateValue = {
          ...currentStateValue,
          loading: false,
        };
      } else {
        getNotification("Failure during password change");
      }
      return currentStateValue;

    case "PROFILE_LOADING":
      currentStateValue = {
        ...currentStateValue,
        loading: true,
        success : false
      };
      return currentStateValue;

    default:
      return currentStateValue;
  }
};
