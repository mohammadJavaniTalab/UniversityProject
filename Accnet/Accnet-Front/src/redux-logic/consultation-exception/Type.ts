import {
  ApplicationListResponse,
  ApplicationDataResponse,
} from "../essentials-tools/type/Response-type";

export interface ConsultationExceptionAddEditModel {
  id?: string;
  fromDate: string;
  toDate: string;
}

export interface ConsultationExceptionModel {
  id: string;
  fromDate: string;
  toDate: string;
}

export interface ConsultationExceptionListResponse
  extends ApplicationListResponse {
  items: Array<ConsultationExceptionModel>;
}

export interface ConsultationExceptionListType {
  type: "CONSULTATION_EXCEPTION_LIST";
  response: ConsultationExceptionListResponse;
}

export interface ConsultationExceptionAddType {
  type: "CONSULTATION_EXCEPTION_ADD";
  response: ApplicationDataResponse;
}

export interface ConsultationExceptionEditType {
  type: "CONSULTATION_EXCEPTION_EDIT";
  response: ApplicationDataResponse;
}

export interface ConsultationExceptionDeleteType {
  type: "CONSULTATION_EXCEPTION_DELETE";
  response: ApplicationDataResponse;
}

export type ConsultationActionType =
  | ConsultationExceptionListType
  | ConsultationExceptionAddType
  | ConsultationExceptionEditType
  | ConsultationExceptionDeleteType
