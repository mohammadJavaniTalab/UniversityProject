import { RoleActionType } from "./Type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";

let currentStateValue: ApplicationListResponse = {
  ...initialListResponse,
  loading: true
};

export const roleReducer = (
  state = {},
  action: RoleActionType
): ApplicationListResponse => {
  switch (action.type) {
    case "ROLE_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;

    case "ROLE_ADD":
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

    case "ROLE_EDIT":
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

    case "ROLE_SELECT_LOADING":
      currentStateValue = {
        ...currentStateValue,
        selectLoading: true,
        updateList: false
      };
      return currentStateValue;

    default:
      return currentStateValue;
  }
};
