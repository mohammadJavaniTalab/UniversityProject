import {
  DependentsListResponse,
  Dependent_Add_Delete_Response,
  FetchDependentsList,
  DependentsAllActionTypes,
} from "./Type";

const initialListResponse: DependentsListResponse = {
  data: [],
  success: false,
  error: {
    code: 0,
    data: [],
  },
  message: "",
  loading: true,
};

const add_delete_initialStateResponse: Dependent_Add_Delete_Response = {
  data: "",
  success: false,
  error: {
    code: 0,
    data: [],
  },
  message: "",
  loading: false,
};

let currentListState: DependentsListResponse = {
  ...initialListResponse,
};

let add_Delete_currentState: Dependent_Add_Delete_Response = {
  ...add_delete_initialStateResponse,
};

export function dependentListReducer(
  state = initialListResponse,
  action: FetchDependentsList
): DependentsListResponse {
  switch (action.type) {
    case "FETCH_DEPENDENTS_LIST":
      currentListState = {
        ...action.response,
        loading: false,
      };
      return currentListState;
    default:
      return currentListState;
  }
}

export function dependent_add_delete_reducer(
  state = add_delete_initialStateResponse,
  action: DependentsAllActionTypes
): Dependent_Add_Delete_Response {
  switch (action.type) {
    case "ADD_DEPENDENT":
      add_Delete_currentState = {
        ...action.response,
        loading: false,
      };
      return add_Delete_currentState;
    case "DELETE_DEPENDENT":
      add_Delete_currentState = {
        ...action.response,
        loading: false,
      };
      return add_Delete_currentState;
    case "RESET_ADD":
      add_Delete_currentState = {
        ...add_delete_initialStateResponse,
        data: "",
        success: false,
        loading: false,
      };
      return add_Delete_currentState;

    case "DO_ADD_DEPENDENT":
      add_Delete_currentState = {
        ...add_Delete_currentState,
        loading: true,
      };
      return add_Delete_currentState;
    default:
      return add_Delete_currentState;
  }
}
