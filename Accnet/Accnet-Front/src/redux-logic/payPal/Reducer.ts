import {
  PayPalActionType,
  PayPalCreateOrderResponseModel,
  PayPalCaptureOrderResponseModel
} from "./Type";
import { initialDataResponse } from "../essentials-tools/initial-response/InitialResponse";

let currentCreateOrderValue: PayPalCreateOrderResponseModel = {
  ...initialDataResponse,
  data: ""
};

let currentCaptureOrderValue: PayPalCaptureOrderResponseModel = {
  ...initialDataResponse,
  loading: true
};

export const payPalCreateOrderReducer = (
  state = {},
  action: PayPalActionType
): PayPalCreateOrderResponseModel => {
  switch (action.type) {
    case "PAY_PAL_CREATE_ORDER":
      currentCreateOrderValue = {
        ...action.response,
        loading: false
      };
      return currentCreateOrderValue;
    case "PAY_PAL_LOADING":
      currentCreateOrderValue = {
        ...currentCreateOrderValue,
        loading: true
      };
      return currentCreateOrderValue;
    default:
      return currentCreateOrderValue;
  }
};

export const payPalCaptureOrderReducer = (
  state = {},
  action: PayPalActionType
): PayPalCreateOrderResponseModel => {
  switch (action.type) {
    case "PAY_PAL_CAPTURE_ORDER":
      currentCaptureOrderValue = {
        ...action.response
      };
      return currentCaptureOrderValue;
    default:
      return currentCaptureOrderValue;
  }
};
