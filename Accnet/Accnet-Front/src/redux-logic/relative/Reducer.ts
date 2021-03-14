import {
  RelativeListResponse,
  Relative_Add_Delete_Response,
  FetchRelatives,
  RelativeAllActionTypes
} from "./Type";

const initialListResponse: RelativeListResponse = {
  data: [],
  success: false,
  error: {
    code: 0,
    data: []
  },
  loading: true,
  message: ""
};

const initialActionsResponse: Relative_Add_Delete_Response = {
  data: "",
  success: false,
  error: {
    code: 0,
    data: []
  },
  loading: true,
  message: ""
};

let currentListResponse: RelativeListResponse = {
  ...initialListResponse
};

let currentActionResponse: Relative_Add_Delete_Response = {
  ...initialActionsResponse
};

export function relativeListReducer(
  state = initialListResponse,
  action: FetchRelatives
): RelativeListResponse {
  switch (action.type) {
    case "FETCH_RELATIVES":
      currentListResponse = {
        ...action.response,
        loading: false
      };
      return currentListResponse;
    default:
      return currentListResponse;
  }
}

export function relativeActionsReducer(
  state = initialActionsResponse,
  action: RelativeAllActionTypes
): Relative_Add_Delete_Response {
  switch (action.type) {
    case "ADD_RELATIVE":
      currentActionResponse = {
        ...action.response,
        loading: false
      };
      return currentActionResponse;
    case "DELETE_RELATIVE":
      currentActionResponse = {
        ...action.response,
        loading: false
      };
      return currentActionResponse;
    default:
      return currentActionResponse;
  }
}
