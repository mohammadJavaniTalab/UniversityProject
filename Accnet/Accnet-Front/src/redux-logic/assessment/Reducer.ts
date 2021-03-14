import {
  AssessmentListResponse,
  Assessment_Add_Delete_Response,
  FetchAssessmentsList,
  AssessmentAllActionType,
} from "./Type";

const initialListResponse: AssessmentListResponse = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
  success: false,
};

const initial_add_delete_response: Assessment_Add_Delete_Response = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
  success: false,
};

let currentListState: AssessmentListResponse = {
  ...initialListResponse,
};

let current_add_delete_state: Assessment_Add_Delete_Response = {
  ...initial_add_delete_response,
};

export function fetchAssessmentList(
  state = initialListResponse,
  action: FetchAssessmentsList
): AssessmentListResponse {
  switch (action.type) {
    case "FETCH_ASSESSMENT_LIST":
      currentListState = {
        ...action.response,
      };

      return currentListState;
    default:
      return currentListState;
  }
}

export function add_delete_assessment(
  state = initial_add_delete_response,
  action: AssessmentAllActionType
): Assessment_Add_Delete_Response {
  switch (action.type) {
    case "ADD_ASSESSMENT":
      current_add_delete_state = {
        ...action.response,
        loading: false,
      };

      return current_add_delete_state;
    case "DELETE_ASSESSMENT":
      current_add_delete_state = {
        ...action.response,
        loading: false,
      };
      return current_add_delete_state;

    default:
      return current_add_delete_state;
  }
}
