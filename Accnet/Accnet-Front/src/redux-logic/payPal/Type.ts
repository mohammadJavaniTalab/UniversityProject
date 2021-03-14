import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";

export interface PayPalCreateOrderModel {
  id: string;
}

export interface PayPalCreateOrderResponseModel
  extends ApplicationDataResponse {
  data: string;
}

export interface PayPalCaptureOrderModel {
  invoiceId: string;
  payerId: string;
  token: string;
}

export interface PayPalCaptureOrderResponseModel
  extends ApplicationDataResponse {
  data: PayPalCaptureOrderDataResponseModel | any;
}

export interface PayPalCaptureOrderDataResponseModel
  extends ApplicationDataResponse {
  user: UserModel;
  title: string;
  description: string;
  creationDate: string;
  amount: number;
  status: number;
  enabled: boolean;
  id: string;
}

export interface PayPalCreateOrderType {
  type: "PAY_PAL_CREATE_ORDER";
  response: PayPalCreateOrderResponseModel;
}

export interface PayPalLoadingType {
  type: "PAY_PAL_LOADING";
}

export interface PayPalCaptureOrderType {
  type: "PAY_PAL_CAPTURE_ORDER";
  response: PayPalCreateOrderResponseModel;
}

export type PayPalActionType =
  | PayPalCreateOrderType
  | PayPalCaptureOrderType
  | PayPalLoadingType;
