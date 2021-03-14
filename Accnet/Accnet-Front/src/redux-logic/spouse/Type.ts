import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";
import { LinkedUserModel } from "../link_user/Type";

export interface SpouseModel {
    userId : string | any
    firstname : string
    lastname : string 
    email : string
    gender : string
    mobile : string
    sinNumber : string
    password : string
    dateOfBirth : string
    assessments : Array<string>
    receipts : Array<string>
    extraFiles : Array<string>
}


export interface SpouseResponse extends ApplicationDataResponse {
    data : any
}

export interface FetchSpouseResponse extends ApplicationDataResponse {
    data : LinkedUserModel
}


interface AddSpouse {
    type : "ADD_SPOUSE",
    response : SpouseResponse
}

interface ResetAdd {
    type : "RESET_ADD"
}

interface DoAdd {
    type : "DO_ADD_SPOUSE"
}

export interface FetchSpouse {
    type : "FETCH_SPOUSE",
    response : FetchSpouseResponse
}


export type SpouseAllActionTypes = AddSpouse | DoAdd | ResetAdd