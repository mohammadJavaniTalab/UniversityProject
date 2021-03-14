import { PermissionActionType } from "./Type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";

let currentStateValue: ApplicationListResponse = {
  ...initialListResponse,
  loading: true
};

export const permissionReducer = (
  state = {},
  action: PermissionActionType
): ApplicationListResponse => {
  switch (action.type) {
    case "PERMISSION_LIST":
      currentStateValue = {
        ...action.response
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};
