import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";

export interface FileRequestBody {
  surveyId: string;
  blobIds: Array<string>;
}

export interface FileResponse {
  id: string;
  name: string;
}

export interface AllFilesResponse {
  reciepts: Array<FileResponse>;
  assessments: Array<FileResponse>;
  extraFile: Array<FileResponse>;
}

export interface FileListResponse extends ApplicationDataResponse {
  data: AllFilesResponse;
}

export interface ChildCareList extends ApplicationDataResponse {
  data : Array<FileResponse>
}

export interface MedicalList extends ApplicationDataResponse { 
  data : Array<FileResponse>
}

export interface SelfEmployeeList extends ApplicationDataResponse { 
  data : Array<FileResponse>
}

export interface FetchSelfEmployeeFiles {
  type : "FETCH_SELF_EMPLOYEE_LIST",
  response : SelfEmployeeList
}

export interface FetchChildCareFiles {
  type : "FETCH_CHILD_CARE_LIST",
  response : ChildCareList
}

export interface FetchMedicalFiles {
  type : "FETCH_MEDICAL_LIST",
  response : MedicalList
}

export interface FetchFiles {
  type: "FETCH_ALL_FILES";
  response: FileListResponse;
}

interface AddReciepts {
  type: "ADD_RECIEPTS";
  response: ApplicationDataResponse;
}

interface AddAssessments {
  type: "ADD_ASSESSMENTS";
  response: ApplicationDataResponse;
}

interface AddExtraFiles {
  type: "ADD_EXTRA_FILES";
  response: ApplicationDataResponse;
}

interface AddMedicalFiles {
  type: "ADD_MEDICAL_FILES";
  response: ApplicationDataResponse;
}

interface AddChildCareFiles {
  type: "ADD_CHILD_CARE_FILES";
  response: ApplicationDataResponse;
}

interface AddSelfEmployeeFiles {
  type: "ADD_SELF_EMPLOYEE";
  response: ApplicationDataResponse;
}



export type fileAllActionTypes = AddReciepts | AddAssessments | AddExtraFiles | AddChildCareFiles | AddMedicalFiles | AddSelfEmployeeFiles;
