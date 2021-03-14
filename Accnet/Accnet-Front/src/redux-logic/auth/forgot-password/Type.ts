import { ApplicationDataResponse } from "../../essentials-tools/type/Response-type";

export interface ForgotPasswordResponse extends ApplicationDataResponse {}

interface ForgotPasswordType {
  type: "FORGOT_PASSWORD";
  response: ForgotPasswordResponse;
}

interface ForgotPasswordLoadingType {
  type: "FORGOT_PASSWORD_LOADING";
}

export type ForgotPasswordActionType = ForgotPasswordType | ForgotPasswordLoadingType 
