import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { TicketListResponse, TicketActionType } from "./Type";
import { getNotification } from "../../service/notification";

let currentStateValue: TicketListResponse = {
  ...initialListResponse,
  loading: true
};

export const ticketReducer = (
  state = {},
  action: TicketActionType
): TicketListResponse => {
  switch (action.type) {
    case "TICKET_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;

    case "TICKET_EDIT":
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

    case "TICKET_ADD":
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

    case "TICKET_SELECT_LOADING":
      currentStateValue = {
        ...currentStateValue,
        selectLoading: true,
        updateList: false
      };
      return currentStateValue;
    case "COMMENT_ADD":
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

    case "COMMENT_EDIT":
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
