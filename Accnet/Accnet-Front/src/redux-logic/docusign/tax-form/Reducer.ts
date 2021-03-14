import { TaxFormResponse , FetchTaxForm} from "./Action";

const initialStateResponse: TaxFormResponse = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  success: false,
  message: "",
  loading: true,
};

let currentState: TaxFormResponse = {
  ...initialStateResponse,
};

export function fetchTaxFormReducer(
  state = initialStateResponse,
  action: FetchTaxForm
): TaxFormResponse {
  switch (action.type) {
    case "FETCH_TAX_FORM":
      currentState = {
        ...action.response,
        loading : false
      };
      return currentState;
    default:
      return currentState;
  }
}
