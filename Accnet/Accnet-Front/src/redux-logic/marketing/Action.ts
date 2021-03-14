import { MarketingListResponse, FetchMarketingList } from "./Type";
import {
  Cancellation,
  makeCancellationTokenAndSource,
  Connect,
  sendRequest,
} from "../essentials-tools/connector/Requester";
import { hostName } from "../../service/constants/defaultValues";

export interface BasePaginationWithFilter {
  pageNumber: number;
  pageSize: number;
  userId?: string;
}

function onListResponse(response: MarketingListResponse): FetchMarketingList {
  return { type: "FETCH_MARKETING_LIST", response: response };
}

let axiosToken: Cancellation;

let initialStateResponse: MarketingListResponse = {
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

function onResponse(response: any, dispatch: any) {
    dispatch(onListResponse(response))
}

export function fetchMarketingListByPagination(
  basePagiantion: BasePaginationWithFilter
) {
  return function implementFetchList(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    let connect: Connect = {
      headers: [],
      requestBody: basePagiantion,
      sourceToken: axiosToken,
      url: `${hostName}/api/marketing/list`,
    };

    sendRequest(connect, onResponse, initialStateResponse, dispatch);
  };
}
