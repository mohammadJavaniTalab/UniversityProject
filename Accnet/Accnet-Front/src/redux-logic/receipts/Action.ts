import { Receipt_Add_Delete_Response, AddReceipt, ReceiptsModel } from "./Type";
import {
  Connect,
  makeCancellationTokenAndSource,
  sendRequest,
} from "../essentials-tools/connector/Requester";
import { hostName } from "../../service/constants/defaultValues";

function onAddResponse(response: Receipt_Add_Delete_Response): AddReceipt {
  return { type: "ADD_RECEIPT", response: response };
}

let initial_add_delete_response: Receipt_Add_Delete_Response = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  success: false,
  message: "",
  loading: false,
};

function onResponse(response: any, dispatch: any) {
  dispatch(onAddResponse(response))
}

export function addReceipts(receiptsModel: ReceiptsModel) {
  return function implementAddReceipts(dispatch: any) {
    const connect: Connect = {
      url: `${hostName}/api/user/survey-reciepts/add`,
      headers: [],
      requestBody: receiptsModel,
      sourceToken: makeCancellationTokenAndSource(),
    };
    sendRequest(connect, onResponse, initial_add_delete_response, dispatch);
  };
}

export function listReceipts(){
  return function implementAddReceipts(dispatch: any) {
    const connect: Connect = {
      url: `${hostName}/api/user/survey-reciepts/add`,
      headers: [],
      requestBody: {},
      sourceToken: makeCancellationTokenAndSource(),
    };
    sendRequest(connect, onResponse, initial_add_delete_response, dispatch);
  };
}
