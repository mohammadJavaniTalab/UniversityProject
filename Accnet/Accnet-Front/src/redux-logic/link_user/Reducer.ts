import { LinkedUserActionType } from "./Type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";

let currentStateValue: ApplicationListResponse = {
  ...initialListResponse,
  loading: true
};

export const organizationReducer = (
  state = {},
  action: LinkedUserActionType
): ApplicationListResponse => {
  switch (action.type) {
    case "LINK_USER-LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;

    case "LINK_USER-ADD":
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

    case "LINK_USER-JOIN_REQUEST":
      if (action.response.success) {
        getNotification("Successfully joined");
      } else {
        getNotification("Joining failed");
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true
      };
      return currentStateValue;
    case "LINK_USER-ACCEPT_REQUEST":
      if (action.response.success) {
        getNotification("Successfully accepted");
      } else {
        getNotification("Accepting failed");
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true
      };
      return currentStateValue;

    case "LINK_USER-EDIT":
      if (action.response.success) {
        getNotification("Successfully change");
      } else {
        getNotification("Changing failed");
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
