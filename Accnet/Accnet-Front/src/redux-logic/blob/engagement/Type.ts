import { ApplicationDataResponse } from "../../essentials-tools/type/Response-type";

export interface EngagementType {
  type: "ENGAGEMENT"
  response: ApplicationDataResponse
}

export type EngagementActionType = EngagementType 
