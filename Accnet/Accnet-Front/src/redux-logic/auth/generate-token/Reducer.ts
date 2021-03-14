import { LoginActionType, LoginResponse } from "./Type";
import { initialDataResponse } from "../../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../../service/notification";
import { navigate } from "gatsby";
import { setLocalStorage } from "../../../service/public";
import { loginLocalStorageName, pathProject } from "../../../service/constants/defaultValues";

let currentStateValue: LoginResponse = {
  data: {
    token: "",
    role: []
  },
  ...initialDataResponse
};

export const loginReducer = (
  state = {},
  action: LoginActionType
): LoginResponse => {
  switch (action.type) {
    case "LOGIN":
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

    case "LOGIN_LOADING":
      currentStateValue = {
        ...currentStateValue,
        loading: true
      };
      return currentStateValue;

    case "LOGOUT":
      localStorage.removeItem(loginLocalStorageName);
      navigate(pathProject.login);
      currentStateValue = {
        data: {
          token: "",
          role: []
        },
        ...initialDataResponse
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};
