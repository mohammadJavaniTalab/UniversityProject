import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";

export interface Relative {
    id : string
    firstname : string 
    lastname : string
    dateOfBirth : string
    relationType : string
    sinNumber : string
}


export interface RelativeListResponse extends ApplicationDataResponse {
    data : Array<Relative>
}

export interface Relative_Add_Delete_Response extends ApplicationDataResponse {
    data : string
}

interface AddRelative {
    type : "ADD_RELATIVE",
    response : Relative_Add_Delete_Response
}

interface DeleteRelative {
    type : "DELETE_RELATIVE",
    response : Relative_Add_Delete_Response
}

export interface FetchRelatives {
    type : "FETCH_RELATIVES",
    response : RelativeListResponse
}



export type RelativeAllActionTypes = AddRelative | DeleteRelative 