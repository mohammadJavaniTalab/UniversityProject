import { ApplicationDataResponse } from "../../essentials-tools/type/Response-type";

export interface SurveyStateUpdateResponse extends ApplicationDataResponse {
    data : any
}

export interface UpdateSurveyState {
    type: "UPDATE_SURVEY_STATE",
    response : SurveyStateUpdateResponse
}