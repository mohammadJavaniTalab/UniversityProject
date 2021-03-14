import { UserActionType, UserModel } from "./Type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";
import { checkFieldIsOk } from "../../service/public";

let currentStateValue: ApplicationListResponse = {
  ...initialListResponse,
  loading: true
};

export const userReducer = (
  state = {},
  action: UserActionType
): ApplicationListResponse => {
  switch (action.type) {
    case "USER_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;
    case "USER_SELECT_LOADING":
      currentStateValue = {
        ...currentStateValue,
        selectLoading: true,
        updateList: false
      };
      return currentStateValue;

    case "USER_ADD":
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
    case "USER_SEARCH":
      if (
        checkFieldIsOk(action.response.data) &&
        "username" in action.response.data
      ) {
        let items: Array<UserModel> = [];
        items.push(action.response.data);
        currentStateValue = {
          ...currentStateValue,
          items: items,
          selectLoading: false,
          updateList: false
        };
      } else {
        currentStateValue = {
          ...currentStateValue,
          selectLoading: false,
          updateList: false
        };
      }

      return currentStateValue;
    case "USER_EDIT":
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
    case "USER_DELETE":
      if (action.response.success) {
        getNotification("Successfully deleted");
      } else {
        getNotification("Deleting failed");
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
