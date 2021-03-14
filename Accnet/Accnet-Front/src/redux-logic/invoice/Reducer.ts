import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { InvoiceListResponse, InvoiceActionType } from "./Type";
import { getNotification } from "../../service/notification";

let currentStateValue: InvoiceListResponse = {
  ...initialListResponse,
  loading: true
};

export const invoiceReducer = (
  state = {},
  action: InvoiceActionType
): InvoiceListResponse => {
  switch (action.type) {
    case "INVOICE_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;

    case "INVOICE_EDIT":
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

    case "INVOICE_ADD":
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

    case "INVOICE_SELECT_LOADING":
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
