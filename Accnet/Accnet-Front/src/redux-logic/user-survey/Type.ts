import {
  ApplicationListResponse,
  ApplicationDataResponse
} from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";
import { SurveyQuestionsModel, SurveyAnswerTypeModel } from "../survey/Type";

export type UserSelectSurvey = "LIST" | "QUESTIONS";

export interface UserSurveyAnswerQuestion {
  answerIds: Array<string>;
  userAnswer: string;
}

export interface ExceptionQuestionModel {
  question : SurveyQuestionsModel
  userAnswerId : string
}

export interface ExceptionAnswersRequestBody {
  surveyId : string
  answers : Array<string>
}

export interface ExceptionQuestionsAnswerResponse extends ApplicationDataResponse {
  data : ExceptionSurveyModel
  loading : boolean
}

export interface UserSurveyModel {
  user: UserModel;
  isFinished: boolean;
  isStarted: boolean;
  surveyId: string;
  surveyName: string;
  surveyDescription: string;
  makeAnAppointment: boolean;
  userCartUpdated: boolean;
  nextQuestion: SurveyQuestionsModel;
  questionCount: number
  userAnswerId: Array<string>;
  userAnswerText: string;
  answerType: SurveyAnswerTypeModel;
  answerText: string;
}

export interface ExceptionSurveyModel {
  user: UserModel;
  isFinished: boolean;
  isStarted: boolean;
  surveyId: string;
  surveyName: string;
  surveyDescription: string;
  makeAnAppointment: boolean;
  userCartUpdated: boolean;
  question: SurveyQuestionsModel;
  questionCount: number
  userAnswerId: Array<string>;
  userAnswerText: string;
  answerType: SurveyAnswerTypeModel;
  answerText: string;
}

export interface UserSurveyNext_previousModel {
  question: SurveyQuestionsModel;
  userAnswerId: Array<string>;
  userAnswerText: string;
  answerType: 3;
  answerText: string;
}


export interface ExceptionQuestionsListResponse extends ApplicationDataResponse {
  data : Array<ExceptionQuestionModel>
  fetchingData : boolean
}

export interface UserSurveyListResponse extends ApplicationListResponse {
  items: Array<UserSurveyModel>;
}

export interface UserSurveyAnswerResponse extends ApplicationDataResponse {
  data: UserSurveyModel;
}

export interface SurveyDeleteResponse extends ApplicationDataResponse {
  data : string
}

export interface UserSurveyNext_PreviousQuestionResponse
  extends ApplicationDataResponse {
  data: UserSurveyNext_previousModel;
}

export interface UserSurveyListType {
  type: "USER_SURVEY_LIST";
  response: UserSurveyListResponse;
}

export interface UserSurveySetQuestionType {
  type: "USER_SURVEY_SET_QUESTION";
  response: UserSurveyAnswerResponse;
}

export interface UserSurveyAnswerQuestionType {
  type: "USER_SURVEY_ANSWER_QUESTION";
  response: UserSurveyAnswerResponse;
}

export interface UserSurveyNext_PreviousQuestionType {
  type: "USER_SURVEY_NEXT_PREVIOUS_QUESTION";
  response: UserSurveyNext_PreviousQuestionResponse;
}

export interface UserSurveyLoadingType {
  type: "USER_SURVEY_LOADING";
}

export interface DeleteSurvey {
  type : "DELETE_SURVEY",
  response : SurveyDeleteResponse
}

export interface GetExceptionQuestions {
  type : "GET_EXCEPTION_QUESTIONS",
  response : ExceptionQuestionsListResponse
}

export interface SendExceptionAnswers {
  type : "SET_EXCEPTION_AMSWERS",
  response : ExceptionQuestionsAnswerResponse
}

export type UserSurveyListActionType =
  | UserSurveyListType
  | UserSurveyLoadingType
  

export type UserSurveyQuestionActionType =
  | UserSurveySetQuestionType
  | UserSurveyAnswerQuestionType
  | UserSurveyNext_PreviousQuestionType
  | UserSurveyLoadingType
  
