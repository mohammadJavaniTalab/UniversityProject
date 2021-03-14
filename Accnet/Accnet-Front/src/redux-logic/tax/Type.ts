import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";

export const taxStatusObject = {
  1: "Set Consultation",
  2: "Pending Consultation",
  3: "Payment Pending",
  4: "Process Pending",
  5: "Document Sign",
  6: "AccnetEFiling",
  7: "UserEFiling"
};

type TaxStatusType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ExtraTaxFile {
  blobId : string
  name : string
  setByAdmin : boolean
}

export interface TaxFile {
  engagementBlobId : string
  taxFormBlobId : string
  userSignedEngagementId : string
  userSignedTaxFormId : string 
  extraTaxFile : Array<ExtraTaxFile>
}

export interface BasicTaxModel {
  user : UserModel
  creationDate : string
  amount : number
  taxFile: TaxFile;
  title: string;
  description: string;
  enabled: boolean;
  status : number
  id : string
  relationType : string
}

export interface TaxModel {
  surveyName : string,
  status : number ,
  surveyId : string ,
  mainUser : UserModel,
  taxes : Array<BasicTaxModel>
}

export interface TaxResponse extends ApplicationListResponse {
  items: Array<TaxModel>;
}

export interface TaxListType {
  type: "TAX_LIST";
  response: TaxResponse;
}

export interface TaxAddType {
  type: "TAX_ADD";
  response: TaxResponse;
}
export interface TaxEditType {
  type: "TAX_EDIT";
  response: TaxResponse;
}

export type TaxActionType = TaxListType | TaxAddType | TaxEditType;
