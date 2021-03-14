import { ApplicationDataResponse } from "../../essentials-tools/type/Response-type";
import { initialDataResponse } from "../../essentials-tools/initial-response/InitialResponse";
import { EngagementActionType } from "./Type";

let currentStateValue: ApplicationDataResponse = {
  ...initialDataResponse
};

export const engagementReducer = (
  state = {},
  action: EngagementActionType
): ApplicationDataResponse => {
  switch (action.type) {
    case "ENGAGEMENT":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};
