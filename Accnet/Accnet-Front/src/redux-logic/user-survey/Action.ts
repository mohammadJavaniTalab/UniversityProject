import {
  UserSurveyListActionType,
  UserSurveyQuestionActionType,
  UserSurveyAnswerResponse,
  UserSurveyAnswerQuestion,
  DeleteSurvey,
  SurveyDeleteResponse,
  ExceptionQuestionsListResponse,
  GetExceptionQuestions,
  ExceptionQuestionsAnswerResponse,
  ExceptionAnswersRequestBody,
  SendExceptionAnswers,
} from "./Type";
import {
  checkListResponse,
  checkDataResponse,
} from "../essentials-tools/check-response/CheckResponse";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource,
} from "../essentials-tools/connector/Requester";
import {
  initialListResponse,
  initialDataResponse,
} from "../essentials-tools/initial-response/InitialResponse";
import { hostName } from "../../service/constants/defaultValues";
import { PaginationRequestBody } from "../essentials-tools/type/Request-type";
import { IdModel } from "../essentials-tools/type/Basic-Object-type";
import { initialUserModel } from "../auth/profile/InitialResponse";

let axiosSource: Cancellation;
let typeOfResponse:
  | "list"
  | "delete"
  | "answer-question"
  | "next-previous-question"
  | "get-exceptions"
  | "set-exceptions-answers"
  | "dd" = "list";

export function onListResponse(response: any): UserSurveyListActionType {
  return { type: "USER_SURVEY_LIST", response };
}

export function onAddResponse(response: any): UserSurveyQuestionActionType {
  return { type: "USER_SURVEY_ANSWER_QUESTION", response };
}
export function onNextPreviousResponse(
  response: any
): UserSurveyQuestionActionType {
  return { type: "USER_SURVEY_NEXT_PREVIOUS_QUESTION", response };
}

function onDeleteResponse(response: any): DeleteSurvey {
  return { type: "DELETE_SURVEY", response: response };
}

export function onLoading(): UserSurveyQuestionActionType {
  return { type: "USER_SURVEY_LOADING" };
}

export function onGetExceptionResponse(
  response: ExceptionQuestionsListResponse
): GetExceptionQuestions {
  return { type: "GET_EXCEPTION_QUESTIONS", response: response };
}

export function onSendExceptionAnswersResponse(
  response: ExceptionQuestionsAnswerResponse
): SendExceptionAnswers {
  return { type: "SET_EXCEPTION_AMSWERS", response: response };
}

function onResponse(response: any, dispatch: any) {
  switch (typeOfResponse) {
    case "list":
      dispatch(onListResponse(checkListResponse(response)));
      break;
    case "answer-question":
      dispatch(onAddResponse(checkDataResponse(response)));
      break;
    case "next-previous-question":
      dispatch(onNextPreviousResponse(checkDataResponse(response)));
      break;
    case "delete":
      dispatch(onDeleteResponse(response));
      break;
    case "get-exceptions":
      dispatch(onGetExceptionResponse(response));
      break;
    case "set-exceptions-answers":
      dispatch(onSendExceptionAnswersResponse(response))
    default:
      break;
  }
}

let initialExceptionResponse: ExceptionQuestionsListResponse = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
  fetchingData: true,
};

const initialExceptionQuestionResponse: ExceptionQuestionsAnswerResponse = {
  data: {
    answerText: "",
    answerType: 1,
    isFinished: false,
    isStarted: true,
    makeAnAppointment: false,
    question: {
      answers: [],
      mustAnsweredNumber: [],
      number: 0,
      text: "",
      id: "",
    },
    questionCount: 0,
    surveyDescription: "",
    surveyId: "",
    surveyName: "",
    user: {
      ...initialUserModel,
    },
    userAnswerId: [],
    userCartUpdated: false,
    userAnswerText: "",
  },
  error: {
    code: 0,
    data: [],
  },

  loading: false,
  message: "",
  success: false,
};

export function sendExceptionAnswers(
  exceptionsAnswer: ExceptionAnswersRequestBody
) {
  typeOfResponse = "set-exceptions-answers"
  return function implementSetExceptionAnswers(dispatch : any) {
    axiosSource = makeCancellationTokenAndSource()
    const connect : Connect = {
      headers: [],
      requestBody: exceptionsAnswer,
      url: `${hostName}/api/user-survey/specific-answers`,
      sourceToken: axiosSource,
    } 
    sendRequest(connect, onResponse, initialExceptionQuestionResponse, dispatch);
  }
}

export function getExceptionQuestions(surveyId: string) {
  typeOfResponse = "get-exceptions";
  return function implementGetExceptionQuestions(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: {},
      url: `${hostName}/api/user-survey/specific-questions?surveyId=${surveyId}`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialExceptionResponse, dispatch);
  };
}

export function userSurveyList(requestBody: PaginationRequestBody) {
  typeOfResponse = "list";
  return function userSurveyListRequest(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user-survey/list`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

let initial_delete_response: SurveyDeleteResponse = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  success: false,
  loading: true,
  message: "",
};

export function deleteUserSurveyByAdmin(surveyId: string, userId: string) {
  typeOfResponse = "delete";
  return function request(dispatch: any) {
    dispatch(onLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody: {},
      url: `${hostName}/api/user-survey/delete?surveyId=${surveyId}&userId=${userId}`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initial_delete_response, dispatch);
  };
}

export function userSurveySetAnswerQuestion(
  response: UserSurveyAnswerResponse
): UserSurveyQuestionActionType {
  return { type: "USER_SURVEY_SET_QUESTION", response };
}

export function userSurveyAnswerQuestion(
  requestBody: UserSurveyAnswerQuestion
) {
  typeOfResponse = "answer-question";
  return function request(dispatch: any) {
    dispatch(onLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user-survey/answer-question`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}

export function userSurveyPreviousQuestion(requestBody: IdModel) {
  typeOfResponse = "next-previous-question";
  return function request(dispatch: any) {
    dispatch(onLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user-survey/previous-question`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}

export function userSurveyNextQuestion(requestBody: IdModel) {
  typeOfResponse = "next-previous-question";
  return function request(dispatch: any) {
    dispatch(onLoading());
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/user-survey/next-question`,
      sourceToken: axiosSource,
    };
    sendRequest(connect, onResponse, initialDataResponse, dispatch);
  };
}
