import {
  GoogleAutoCompleteActionType,
  GoogleAutoCompleteResponse
} from "./Type";
import { initialDataResponse } from "../essentials-tools/initial-response/InitialResponse";

let currentStateValue: GoogleAutoCompleteResponse = {
  ...initialDataResponse,
  data: []
};

export const googleAutoCompleteReducer = (
  state = {},
  action: GoogleAutoCompleteActionType
): GoogleAutoCompleteResponse => {
  switch (action.type) {
    case "GOOGLE_AUTO_COMPLETE":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};
