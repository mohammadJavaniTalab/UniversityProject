import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";

export type AppointmentTypeModel =
  | "FaceTime Video Call"
  | "FaceTime Audio Call"
  | "Skype"
  | "Regular Phone Call";

interface AppointmentModel {
  date: string;
  title: string;
  description: string;
  type: string;
}

export interface AppointmentEditModel extends AppointmentModel {
  representativeId: string;
  approved: boolean;
  id: string;
}
export interface AppointmentAddModel extends AppointmentModel {
  duration: number;
  userId: string;
}

export interface AppointmentListModel {
  user: UserModel;
  representative: string;
  creationDate: string;
  date: string;
  title: string;
  duration : number
  description: string;
  approved: boolean;
  id: string;
  type: string;
}

export interface AppointmentListResponse extends ApplicationListResponse {
  items: Array<AppointmentListModel>;
}

export interface AppointmentListType {
  type: "APPOINTMENT_LIST";
  response: ApplicationListResponse;
}

interface AppointmentAddClientType {
  type: "APPOINTMENT_ADD_CLIENT";
  response: ApplicationListResponse;
}
interface AppointmentAddManagementType {
  type: "APPOINTMENT_ADD_MANAGEMENT";
  response: ApplicationListResponse;
}
export interface AppointmentEditType {
  type: "APPOINTMENT_EDIT";
  response: ApplicationListResponse;
}

export interface AppointmentDeleteType {
  type: "APPOINTMENT_DELETE";
  response: ApplicationListResponse;
}

export interface AppointmentSelectLoadingType {
  type: "APPOINTMENT_SELECT_LOADING";
}

export type AppointmentActionType =
  | AppointmentListType
  | AppointmentAddClientType
  | AppointmentAddManagementType
  | AppointmentEditType
  | AppointmentDeleteType
  | AppointmentSelectLoadingType;
