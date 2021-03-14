import {
  AssessmentListResponse,
  FetchAssessmentsList,
  Assessment_Add_Delete_Response,
  AssessmentAllActionType,
  AssessmentModel,
} from "./Type";
import { Cancellation, Connect, makeCancellationTokenAndSource, sendRequest } from "../essentials-tools/connector/Requester";
import { hostName } from "../../service/constants/defaultValues";

function onListResponse(
  response: AssessmentListResponse
): FetchAssessmentsList {
  return { type: "FETCH_ASSESSMENT_LIST", response: response };
}

function onAddResponse(
  response: Assessment_Add_Delete_Response
): AssessmentAllActionType {
  return { type: "ADD_ASSESSMENT", response: response };
}



let initialListResponse: AssessmentListResponse = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  success: false,
  message: "",
  loading: true,
};

let initial_add_delete_response: Assessment_Add_Delete_Response = {
  data: "",
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  success: false,
  message: "",
};

let actionType: string = "LIST";
function onResponse(response: any, dispatch: any) {
  switch (actionType) {
    case "LIST":
      dispatch(onListResponse(response));
      break;
    case "ADD":
      dispatch(onAddResponse(response));
      break;
    
  }
}


export function fetchAssessmentsList(surveyId : string){
    actionType = "LIST"
    return function implementFetchAssessmentList(dispatch : any){
        
        const connect : Connect = {
            url : `${hostName}/api/user/survey-assessment/list-by-user?surveyId=${surveyId}`,
            headers : [],
            requestBody : {},
            sourceToken : makeCancellationTokenAndSource()
        }

        sendRequest(connect , onResponse , initialListResponse , dispatch)
    }
}

export function addAssessment(assessmentModel : AssessmentModel){
    actionType = "ADD"
    return function implementAddAssessment(dispatch : any){
        const connect : Connect = {
            url : `${hostName}/api/user/survey-assessment/create`,
            headers : [],
            requestBody : assessmentModel,
            sourceToken : makeCancellationTokenAndSource()
        }

        sendRequest(connect , onResponse , initial_add_delete_response , dispatch)
    }
}
