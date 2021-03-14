import {
  UserSurveyListActionType,
  UserSurveyListResponse,
  UserSurveyQuestionActionType,
  UserSurveyAnswerResponse,
  DeleteSurvey,
  SurveyDeleteResponse,
  ExceptionQuestionsListResponse,
  GetExceptionQuestions,
  ExceptionQuestionsAnswerResponse,
  SendExceptionAnswers,
} from "./Type";
import {
  initialListResponse,
  initialDataResponse,
} from "../essentials-tools/initial-response/InitialResponse";
import { initialUserModel } from "../auth/profile/InitialResponse";

const initialExceptionResponse: ExceptionQuestionsListResponse = {
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

let currentExceptionResponse: ExceptionQuestionsListResponse = {
  ...initialExceptionResponse,
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

let currentExceptionQuestionResponse: ExceptionQuestionsAnswerResponse = {
  ...initialExceptionQuestionResponse,
};

export function sendExceptionsReducer(
  state = initialExceptionQuestionResponse,
  action: SendExceptionAnswers
): ExceptionQuestionsAnswerResponse {
  switch (action.type) {
    case "SET_EXCEPTION_AMSWERS":
      currentExceptionQuestionResponse = {
        ...action.response,
      };
      return currentExceptionQuestionResponse;
    default:
      return currentExceptionQuestionResponse;
  }
}

export function getExceptionsReducer(
  state = initialExceptionResponse,
  action: GetExceptionQuestions
): ExceptionQuestionsListResponse {
  switch (action.type) {
    case "GET_EXCEPTION_QUESTIONS":
      currentExceptionResponse = {
        ...action.response,
        fetchingData: false,
      };

      return currentExceptionResponse;
    default:
      return currentExceptionResponse;
  }
}

let currentStateValue: UserSurveyListResponse = {
  ...initialListResponse,
  loading: true,
};

export const userSurveyListReducer = (
  state = {},
  action: UserSurveyListActionType
): UserSurveyListResponse => {
  switch (action.type) {
    case "USER_SURVEY_LIST":
      currentStateValue = {
        ...action.response,
        loading: false,
      };
      return currentStateValue;
    case "USER_SURVEY_LOADING":
      currentStateValue = {
        ...currentStateValue,
        loading: true,
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};

let currentState: SurveyDeleteResponse = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
  success: false,
};
export function deleteSurveyReducer(
  state = {},
  action: DeleteSurvey
): SurveyDeleteResponse {
  switch (action.type) {
    case "DELETE_SURVEY":
      currentState = {
        ...action.response,
        loading: false,
      };
      return currentState;
    default:
      return currentState;
  }
}

let currentQuestionValue: UserSurveyAnswerResponse = {
  ...initialDataResponse,
  loading: false,
};

export const userSurveyQuestionReducer = (
  state = {},
  action: UserSurveyQuestionActionType
): UserSurveyAnswerResponse => {
  switch (action.type) {
    case "USER_SURVEY_LOADING":
      currentQuestionValue = {
        ...currentQuestionValue,
        loading: true,
      };
      return currentQuestionValue;
    case "USER_SURVEY_SET_QUESTION":
      currentQuestionValue = {
        ...action.response,
        loading: false,
      };
      return currentQuestionValue;

    case "USER_SURVEY_NEXT_PREVIOUS_QUESTION":
      if (action.response.success) {
        currentQuestionValue = {
          ...currentQuestionValue,
          data: {
            ...currentQuestionValue.data,
            nextQuestion: action.response.data.question,
            userAnswerId: action.response.data.userAnswerId,
            userAnswerText: action.response.data.userAnswerText,
            answerType: action.response.data.answerType,
            answerText: action.response.data.answerText,
          },
          loading: false,
        };
      } else {
        currentQuestionValue = { ...currentQuestionValue, loading: false };
      }

      return currentQuestionValue;

    case "USER_SURVEY_ANSWER_QUESTION":
      if (action.response.success) {
        currentQuestionValue = {
          ...action.response,
          loading: false,
        };
      } else {
        currentQuestionValue = {
          ...currentQuestionValue,
          loading: false,
        };
      }

      return currentQuestionValue;
    default:
      return currentQuestionValue;
  }
};
