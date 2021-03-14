import { ApplicationDataResponse, ApplicationListResponse } from "../essentials-tools/type/Response-type";

export interface ReceiptsModel {
  surveyId: string;
  blobIds: Array<string>;
}


export interface Receipt_Add_Delete_Response extends ApplicationDataResponse { 
    data : string
}

export interface Receipt_List_Response extends ApplicationDataResponse {
  data : Array<string>
}

export interface AddReceipt {
    type : "ADD_RECEIPT",
    response : Receipt_Add_Delete_Response
}

export interface ListReceipt {
  type: "FETCH_RECEIPT",
  response : Receipt_List_Response
}