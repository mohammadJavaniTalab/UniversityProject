import { Receipt_Add_Delete_Response, AddReceipt, ListReceipt, Receipt_List_Response } from "./Type";

const initial_add_receipt_response: Receipt_Add_Delete_Response = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let currentState: Receipt_Add_Delete_Response = {
  ...initial_add_receipt_response,
};

export function addReceiptReducer(
  state = initial_add_receipt_response,
  action: AddReceipt
): Receipt_Add_Delete_Response {
  switch (action.type) {
    case "ADD_RECEIPT":
      currentState = {
        ...action.response,
      };
      return currentState;
    default:
      return currentState;
  }
}

const initialListResponse : Receipt_List_Response = {
  data : [],
  error: {
    code: 0,
    data: [],
  },
  loading: true,
  message: "",
  success: false,
}

let currentListState : Receipt_List_Response = {
  ...initialListResponse
}

export function listReceiptReducer(
  state = initial_add_receipt_response,
  action: ListReceipt
): Receipt_List_Response {
  switch (action.type) {
    case "FETCH_RECEIPT":
      currentListState = {
        ...action.response,
        loading : false
      };
      return currentListState;
    default:
      return currentListState;
  }
}
