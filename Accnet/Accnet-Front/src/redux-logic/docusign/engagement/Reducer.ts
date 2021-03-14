import { EngagementResponse, FetchEngagement } from "./Action";

const initialStateResponse: EngagementResponse = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  success: false,
  message: "",
  loading: true,
};

let currentState: EngagementResponse = {
  ...initialStateResponse,
};

export function fetchEngagementFormReducer(
  state = initialStateResponse,
  action: FetchEngagement
): EngagementResponse {
  switch (action.type) {
    case "FETCH_ENGAGEMENT":
      currentState = {
        ...action.response,
        loading : false
      };
      return currentState;
    default:
      return currentState;
  }
}
