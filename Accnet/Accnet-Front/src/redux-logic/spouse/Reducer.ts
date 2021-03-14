import {
  SpouseResponse,
  SpouseAllActionTypes,
  FetchSpouseResponse,
  FetchSpouse
} from "./Type";
import { initialUserModel } from "../auth/profile/InitialResponse";

const initialStateFetch: FetchSpouseResponse = {
  data: {
    firstUser: {
      ...initialUserModel
    },
    secondUser: {
      ...initialUserModel
    },
    id: "",
    relationType: "",
    status: 1
  },
  error: {
    code: 0,
    data: []
  },
  loading: true,
  message: "",
  success: false
};

const initialStateResponse: SpouseResponse = {
  data: {},
  error: {
    code: 0,
    data: []
  },
  loading: false,
  message: "",
  success: false
};

let currentStateResponse: SpouseResponse = {
  ...initialStateResponse
};

let currentFetch: FetchSpouseResponse = {
  ...initialStateFetch
};

export function fetchSpouseReducer(
  state = initialStateFetch,
  action: FetchSpouse
): FetchSpouseResponse {
  switch (action.type) {
    case "FETCH_SPOUSE":
      currentFetch = {
        ...action.response,
        loading: false
      };
      return currentFetch;
    default:
      return currentFetch;
  }
}

export function spouseReducer(
  state = initialStateResponse,
  action: SpouseAllActionTypes
): SpouseResponse {
  switch (action.type) {
    case "ADD_SPOUSE":
      currentStateResponse = {
        ...action.response,
        loading: false
      };
      return currentStateResponse;
    case "RESET_ADD":
      currentStateResponse = {
        ...initialStateResponse,
        data: null,
        loading : false,
        success: false
      };
      return currentStateResponse;
    case "DO_ADD_SPOUSE":
      currentStateResponse = {
        ...currentStateResponse,
        loading: true
      };
      return currentStateResponse;
    default:
      return currentStateResponse;
  }
}
