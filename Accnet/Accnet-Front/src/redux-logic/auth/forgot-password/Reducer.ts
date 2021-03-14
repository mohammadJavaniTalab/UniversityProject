import { ForgotPasswordActionType, ForgotPasswordResponse } from "./Type";
import { initialDataResponse } from "../../essentials-tools/initial-response/InitialResponse";
import { setLocalStorage } from "../../../service/public";
import Modal from "antd/lib/modal";
import {
  loginLocalStorageName,
  pathProject
} from "../../../service/constants/defaultValues";
import { navigate } from "gatsby";

let currentStateValue: ForgotPasswordResponse = {
  data: {},
  ...initialDataResponse
};

export const forgotPasswordReducer = (
  state = {},
  action: ForgotPasswordActionType
): ForgotPasswordResponse => {
  switch (action.type) {
    case "FORGOT_PASSWORD":
      if (action.response.success) {
        Modal.info({
          title: "Your temporary password will be sent to the email address.",
          content: "",
          okText: "Okay",
          onOk() {
            navigate(pathProject.login);
          }
        });
      } else {
        Modal.info({
          title: "Please try again.",
          content: "",
          onOk() {}
        });
      }
      currentStateValue = {
        ...currentStateValue,
        loading: false
      };
      return currentStateValue;

    case "FORGOT_PASSWORD_LOADING":
      currentStateValue = {
        ...currentStateValue,
        loading: true
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};
