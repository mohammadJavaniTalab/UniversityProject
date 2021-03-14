import {
  RegisterActionType,
  RegisterResponse,
  AdvanceRegisterResponse
} from "./Type";
import { initialDataResponse } from "../../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../../service/notification";
import { setLocalStorage } from "../../../service/public";
import { loginLocalStorageName } from "../../../service/constants/defaultValues";

let currentStateValue: RegisterResponse = {
  data: "",
  ...initialDataResponse
};

let currentAdvanceRegisterValue: AdvanceRegisterResponse = {
  data: "",
  ...initialDataResponse
};

export const registerReducer = (
  state = {},
  action: RegisterActionType
): RegisterResponse => {
  switch (action.type) {
    case "REGISTER":
      if (action.response.success) {
        setLocalStorage(
          loginLocalStorageName,
          JSON.stringify(action.response.data)
        );
      }
      currentStateValue = {
        ...action.response,
        loading: false
      };
      return currentStateValue;

    case "REGISTER_LOADING":
      currentStateValue = {
        ...currentStateValue,
        loading: true
      };
      return currentStateValue;
    case "REGISTER_RESET":
      currentStateValue = {
        ...initialDataResponse,
        data: currentStateValue.data
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};

export const advanceRegisterReducer = (
  state = {},
  action: RegisterActionType
): AdvanceRegisterResponse => {
  switch (action.type) {
    case "REGISTER_RESET":
      currentAdvanceRegisterValue = {
        ...initialDataResponse,
        data: currentAdvanceRegisterValue.data
      };
      return currentAdvanceRegisterValue;
    case "ADVANCE_REGISTER":
      if (action.response.success) {
        currentAdvanceRegisterValue = {
          ...action.response,
          loading: false
        };
      } else {
        currentAdvanceRegisterValue = {
          ...currentAdvanceRegisterValue,
          loading: false
        };
      }
      return currentAdvanceRegisterValue;
    default:
      return currentAdvanceRegisterValue;
  }
};
