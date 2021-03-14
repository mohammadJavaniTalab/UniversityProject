import { ApplicationDataResponse, ApplicationListResponse } from "../essentials-tools/type/Response-type";

export interface AssessmentModel {
  surveyId: string;
  blobIds: Array<string>;
}


export interface Assessment_Add_Delete_Response extends ApplicationDataResponse { 
    data : string
}

export interface AssessmentListResponse extends ApplicationDataResponse {
    data : Array<string>
}

export interface FetchAssessmentsList {
    type : "FETCH_ASSESSMENT_LIST",
    response : AssessmentListResponse
}

interface AddAssessment {
    type : "ADD_ASSESSMENT",
    response : Assessment_Add_Delete_Response
}

interface DeleteAssessment {
    type : "DELETE_ASSESSMENT",
    response : Assessment_Add_Delete_Response
}


export type AssessmentAllActionType = AddAssessment | DeleteAssessment