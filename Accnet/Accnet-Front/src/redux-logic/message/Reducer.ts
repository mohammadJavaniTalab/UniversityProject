import { MessageActionType, MessageResponse } from "./Type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";

let currentStateValue: MessageResponse = {
  ...initialListResponse,
  loading: true
};

export const messageReducer = (
  state = {},
  action: MessageActionType
): MessageResponse => {
  switch (action.type) { 
    case "MESSAGE_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;
      
    case "MESSAGE_ADD":
      if (action.response.success) {
        getNotification("Successfully Added");
      } else {
        getNotification("Adding failed");
      }
      currentStateValue = {
        ...currentStateValue, 
        updateList: true
      };
      return currentStateValue;

    case "MESSAGE_EDIT":
      if (action.response.success) {
        getNotification("Successfully Edited");
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
