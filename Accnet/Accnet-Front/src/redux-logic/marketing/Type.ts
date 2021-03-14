import { ApplicationListResponse } from "../essentials-tools/type/Response-type";

export interface MarketingModel {
  username: string;
  taxes: Array<string>;
  invoices: Array<string>;
  appointments: Array<string>;
}



export interface MarketingListResponse extends ApplicationListResponse {
    items : Array<MarketingModel>
}


export interface FetchMarketingList {
    type : "FETCH_MARKETING_LIST",
    response : MarketingListResponse
}