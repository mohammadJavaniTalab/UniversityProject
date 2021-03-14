import { LinkedUserModel } from "../link_user/Type";
import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";
import { UserModel } from "../user/Type";

export interface Dependent {
    user : UserModel,
    relationType : string
    surveyId : string
}

export interface DependentsListResponse extends ApplicationDataResponse {
    data : Array<LinkedUserModel>
}

export interface Dependent_Add_Delete_Response extends ApplicationDataResponse {
    data : string
}

export interface FetchDependentsList {
    type : "FETCH_DEPENDENTS_LIST",
    response : DependentsListResponse
}

 interface DeleteDependent {
    type : "DELETE_DEPENDENT",
    response : Dependent_Add_Delete_Response
}

 interface AddDependent {
    type : "ADD_DEPENDENT",
    response : Dependent_Add_Delete_Response
}

interface ResetAdd {
    type : "RESET_ADD"
}

interface DoAdd {
    type : "DO_ADD_DEPENDENT"
}

export type DependentsAllActionTypes = DeleteDependent | AddDependent | ResetAdd | DoAdd