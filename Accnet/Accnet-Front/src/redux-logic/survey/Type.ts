import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";

export const SurveyActionTypeObject = { 
  1: "Add To Cart",
  2: "Send Ticket",
  3: "Add Dependent Above 19",
  4: "Add Dependent Below 19", 
  5: "Add Assessment",
  6: "Create Consultation",
  7: "Add Receipts",
  8: "Add Spouse"
};
 
export const SurveyAnswerTypeObject = {
  1: "Static",
  2: "Calendar", 
  3: "Input",
  4 : "CheckBox"
};

export type SurveyActionTypeModel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SurveyAnswerTypeModel = 1 | 2 | 3 | 4;

export interface SurveyActionModel {
  type: SurveyActionTypeModel;
  value: number;
  id?: string; // deleted for add survey
}

export interface SurveyAnswerModel {
  number: number; // model question-number.answer-number
  type: SurveyAnswerTypeModel;
  text: string;
  actions: Array<SurveyActionModel>;
  id: string; // deleted for add survey
}

export interface SurveyQuestionsModel {
  number: number;
  text: string;
  answers: Array<SurveyAnswerModel>;
  mustAnsweredNumber: Array<number | string>;
  id?: string; // deleted for add survey
}

export interface SurveyModel { 
  createdBy?: UserModel; // deleted for add survey
  name: string;
  description: string;
  questions: Array<SurveyQuestionsModel>;
  enabled: boolean;
  id?: string; // deleted for add survey
}

export interface SurveyResponse extends ApplicationListResponse {
  items: Array<SurveyModel>;
}

export interface SurveyType {
  type: "SURVEY_LIST";
  response: any;
}

export interface SurveyAddType {
  type: "SURVEY_ADD";
  response: any;
}

export interface SurveyEditType {
  type: "SURVEY_EDIT";
  response: any;
}

export type SurveyActionType = SurveyType | SurveyAddType | SurveyEditType
