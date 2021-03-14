import { EngagementActionType } from "./Type";
import { getRequest, getRequestWithAuthorization, makeCancellationTokenAndSource } from "../../essentials-tools/connector/Requester";
import { ApplicationListResponse } from "../../essentials-tools/type/Response-type";
import { initialListResponse } from "../../essentials-tools/initial-response/InitialResponse";
import { checkListResponse } from "../../essentials-tools/check-response/CheckResponse";
import { hostName } from "../../../service/constants/defaultValues";

export function onListResponse(
  response: ApplicationListResponse
): EngagementActionType {
  return { type: "ENGAGEMENT", response };
}

function onResponse(response: any, dispatch: any) {
  dispatch(onListResponse(checkListResponse(response)));
}

export function getEngagement(accessCode: string, taxId: string) {
  return function request(dispatch: any) {
    const url: string = `${hostName}/api/blob/engagement/${accessCode}/${taxId}`;
    getRequestWithAuthorization(url, onResponse, initialListResponse, dispatch , makeCancellationTokenAndSource());
  };
}
