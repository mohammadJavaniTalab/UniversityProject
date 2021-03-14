import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";

export const invoiceStatusObject = {
  0: "---",
  1: "Pending",
  2: "Paid",
  3: "Cancelled"
}

export type InvoiceStatusType = 0 | 1 | 2 | 3 ;

interface BasicInvoiceModel {
  title: string;
  description: string;
  amount: number;
  status: InvoiceStatusType; 
  enabled: boolean; 
}

export interface InvoiceAddModel extends BasicInvoiceModel{
  userId: string;
}

export interface InvoiceEditModel extends BasicInvoiceModel{
  id: string
}

export interface InvoiceListModel extends BasicInvoiceModel{
  user: UserModel;
  creationDate: string;
  id: string;
}

export interface InvoiceListResponse extends ApplicationListResponse {
  items: Array<InvoiceListModel>;
}

export interface InvoiceListType {
  type: "INVOICE_LIST";
  response: InvoiceListResponse;
}

export interface InvoiceSelectLoadingType {
  type: "INVOICE_SELECT_LOADING";
}

export interface InvoiceAddType {
  type: "INVOICE_ADD";
  response: InvoiceListResponse;
}

export interface InvoiceEditType {
  type: "INVOICE_EDIT";
  response: InvoiceListResponse;
}

export type InvoiceActionType =
  | InvoiceListType
  | InvoiceAddType
  | InvoiceEditType
  | InvoiceSelectLoadingType;
