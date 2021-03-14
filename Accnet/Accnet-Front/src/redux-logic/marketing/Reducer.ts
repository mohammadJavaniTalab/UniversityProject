import { MarketingListResponse, FetchMarketingList } from "./Type";

const initialStateResponse: MarketingListResponse = {
  items: [],
  data: {},
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  pageNumber: 0,
  pageSize: 10,
  selectLoading: false,
  success: false,
  totalCount: 0,
  updateList: false,
};

let currentStateValue: MarketingListResponse = {
  ...initialStateResponse,
};

export function fetchMarketingList(
  state = initialStateResponse,
  action: FetchMarketingList
): MarketingListResponse {
  switch (action.type) {
    case "FETCH_MARKETING_LIST":
      currentStateValue = {
        ...action.response,
      };

      return currentStateValue;

    default:
      return currentStateValue;
  }
}
