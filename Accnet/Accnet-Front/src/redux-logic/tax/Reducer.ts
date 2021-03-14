import { TaxActionType, TaxResponse } from "./Type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";

let currentStateValue: TaxResponse = {
  ...initialListResponse,
  loading: true
};

export const taxReducer = (state = {}, action: TaxActionType): any => {
  switch (action.type) {
    case "TAX_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;

    case "TAX_ADD":
      if (action.response.success) {
        getNotification("Successfully edited");
      } else {
        getNotification("Editing failed");
      }
      currentStateValue={
        ...currentStateValue ,
        updateList : true
      }
      return currentStateValue;

    case "TAX_EDIT":
      if (action.response.success) {
        getNotification("Successfully edited",);
      } else {
        getNotification("Editing failed");
      }
      currentStateValue={
        ...currentStateValue , 
        updateList : true
      }
      return currentStateValue;
    default:
      return currentStateValue;
  }
};
