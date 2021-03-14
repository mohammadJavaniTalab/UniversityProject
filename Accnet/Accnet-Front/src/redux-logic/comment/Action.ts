import {CommentAddModel,CommentEditModel  } from "./Type";
import {
  Cancellation,
  sendRequest,
  Connect,
  makeCancellationTokenAndSource
} from "../essentials-tools/connector/Requester";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { hostName } from "../../service/constants/defaultValues";
import { TicketActionType } from "../ticket/Type";

let axiosSource: Cancellation;
let typeOfRequest: string = "list";



export function onAddResponse(response: any): TicketActionType {
  return { type: "COMMENT_ADD", response };
}

export function onEditResponse(response: any): TicketActionType {
  return { type: "COMMENT_EDIT", response };
}
  
function onResponse(response: any, dispatch: any) {
  switch (typeOfRequest) {
    case "add":
      dispatch(onAddResponse(response));
      break;

    case "edit":
      dispatch(onEditResponse(response));
      break;
      
    default:
      break;
  }
}


export function commentAdd(requestBody: CommentAddModel) {
  typeOfRequest = "add";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/comment/add`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function commentEdit(requestBody: CommentEditModel) {
  typeOfRequest = "edit";
  return function request(dispatch: any) {
    axiosSource = makeCancellationTokenAndSource();
    const connect: Connect = {
      headers: [],
      requestBody,
      url: `${hostName}/api/comment/edit`,
      sourceToken: axiosSource
    };
    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}
