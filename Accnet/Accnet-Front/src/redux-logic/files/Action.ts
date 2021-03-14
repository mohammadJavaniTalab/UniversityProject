import {
  FileListResponse,
  FetchFiles,
  fileAllActionTypes,
  FileRequestBody,
  MedicalList,
  ChildCareList,
  FetchMedicalFiles,
  FetchChildCareFiles,
  SelfEmployeeList,
  FetchSelfEmployeeFiles,
} from "./Type";
import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";
import {
  Cancellation,
  makeCancellationTokenAndSource,
  Connect,
  sendRequest,
  download,
} from "../essentials-tools/connector/Requester";
import { hostName } from "../../service/constants/defaultValues";

function onFetchAllResponse(response: FileListResponse): FetchFiles {
  return { type: "FETCH_ALL_FILES", response: response };
}

function onAddReciepts(response: ApplicationDataResponse): fileAllActionTypes {
  return { type: "ADD_RECIEPTS", response: response };
}

function onAddAssessment(
  response: ApplicationDataResponse
): fileAllActionTypes {
  return { type: "ADD_ASSESSMENTS", response: response };
}

function onAddExtraFiles(
  response: ApplicationDataResponse
): fileAllActionTypes {
  return { type: "ADD_EXTRA_FILES", response: response };
}

function onAddChildCareFiles(
  response: ApplicationDataResponse
): fileAllActionTypes {
  return { type: "ADD_CHILD_CARE_FILES", response: response };
}

function onAddMedicalFiles(
  response: ApplicationDataResponse
): fileAllActionTypes {
  return { type: "ADD_MEDICAL_FILES", response: response };
}

function onAddSelfEmployeeFiles(
  response: ApplicationDataResponse
): fileAllActionTypes {
  return { type: "ADD_SELF_EMPLOYEE", response: response };
}

function onFetchSelfEmployeeFiles(
  response: SelfEmployeeList
): FetchSelfEmployeeFiles {
  return { type: "FETCH_SELF_EMPLOYEE_LIST", response: response };
}

function onFetchMedicalFiles(response: MedicalList): FetchMedicalFiles {
  return { type: "FETCH_MEDICAL_LIST", response: response };
}

function onFetchChildCareFiles(response: ChildCareList): FetchChildCareFiles {
  return { type: "FETCH_CHILD_CARE_LIST", response: response };
}

let axiosToken: Cancellation;
let actionType: string = "LIST";

let initialSelfList: SelfEmployeeList = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let initialMedicalList: MedicalList = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let initialChildCareList: ChildCareList = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let initialListResponse: FileListResponse = {
  data: {
    assessments: [],
    extraFile: [],
    reciepts: [],
  },
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let initialApplicationDataResponse: ApplicationDataResponse = {
  data: {},
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

function onResponse(response: any, dispatch: any) {
  switch (actionType) {
    case "LIST":
      dispatch(onFetchAllResponse(response));
      break;
    case "Reciepts":
      dispatch(onAddReciepts(response));
      break;
    case "Assessments":
      dispatch(onAddAssessment(response));
      break;
    case "ExtraFiles":
      dispatch(onAddExtraFiles(response));
    case "MedicalFiles":
      dispatch(onAddMedicalFiles(response));
      break;
    case "ChildCareFiles":
      dispatch(onAddChildCareFiles(response));
      break;
    case "MedicalFilesList":
      dispatch(onFetchMedicalFiles(response));
      break;
    case "ChildCareFilesList":
      dispatch(onFetchChildCareFiles(response));
      break;
    case "SelfFilesList":
      dispatch(onFetchSelfEmployeeFiles(response));
      break;
    case "AddSelfFiles":
      dispatch(onAddSelfEmployeeFiles(response));
      break;
  }
}


export function fetchSelfFiles(surveyId: string, userId: string) {
  actionType = "SelfFilesList";
  let url = `${hostName}/api/survey-file/selfemployed-extrafiles/list-by-user?surveyId=${surveyId}`;
  if (userId !== undefined && userId !== null && userId !== "") {
    url.concat(`&userId=${userId}`);
  }
  return function implementAllFilesFetch(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: {},
      sourceToken: axiosToken,
      url: url,
    };

    sendRequest(connect, onResponse, initialSelfList, dispatch);
  };
}


export function fetchMedicalFiles(surveyId: string, userId: string) {
  actionType = "MedicalFilesList";
  let url = `${hostName}/api/survey-file/medical-extrafiles/list-by-user?surveyId=${surveyId}`;
  if (userId !== undefined && userId !== null && userId !== "") {
    url.concat(`&userId=${userId}`);
  }
  return function implementAllFilesFetch(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: {},
      sourceToken: axiosToken,
      url: url,
    };

    sendRequest(connect, onResponse, initialMedicalList, dispatch);
  };
}

export function fetchChildCareFiles(surveyId: string, userId: string) {
  actionType = "ChildCareFilesList";
  let url = `${hostName}/api/survey-file/child-extrafiles/list-by-user?surveyId=${surveyId}`;
  if (userId !== undefined && userId !== null && userId !== "") {
    url.concat(`&userId=${userId}`);
  }
  return function implementAllFilesFetch(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: {},
      sourceToken: axiosToken,
      url: url,
    };

    sendRequest(connect, onResponse, initialChildCareList, dispatch);
  };
}

export function fetchAllFiles(surveyId: string, userId: string) {
  actionType = "LIST";
  let url = `${hostName}/api/survey-file/files/list-by-user?surveyId=${surveyId}`;
  if (userId !== undefined && userId !== null && userId !== "") {
    url.concat(`&userId=${userId}`);
  }
  return function implementAllFilesFetch(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: {},
      sourceToken: axiosToken,
      url: url,
    };

    sendRequest(connect, onResponse, initialListResponse, dispatch);
  };
}

export function addReciepts(requestBody: FileRequestBody) {
  actionType = "Reciepts";

  return function implementAdd(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: requestBody,
      sourceToken: axiosToken,
      url: `${hostName}/api/survey-file/reciepts/add`,
    };

    sendRequest(connect, onResponse, initialApplicationDataResponse, dispatch);
  };
}

export function addAssessments(requestBody: FileRequestBody) {
  actionType = "Assessments";

  return function implementAdd(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: requestBody,
      sourceToken: axiosToken,
      url: `${hostName}/api/survey-file/assessment/create`,
    };

    sendRequest(connect, onResponse, initialApplicationDataResponse, dispatch);
  };
}

export function addMedicalFiles(requestBody: FileRequestBody) {
  actionType = "MedicalFiles";

  return function implementAdd(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: requestBody,
      sourceToken: axiosToken,
      url: `${hostName}/api/survey-file/medical-extrafiles/add`,
    };

    sendRequest(connect, onResponse, initialApplicationDataResponse, dispatch);
  };
}

export function addChildCareFiles(requestBody: FileRequestBody) {
  actionType = "ChildCareFiles";

  return function implementAdd(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: requestBody,
      sourceToken: axiosToken,
      url: `${hostName}/api/survey-file/child-extrafiles/add`,
    };

    sendRequest(connect, onResponse, initialApplicationDataResponse, dispatch);
  };
}

export function addSelfFiles(requestBody: FileRequestBody) {
  actionType = "AddSelfFiles";

  return function implementAdd(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: requestBody,
      sourceToken: axiosToken,
      url: `${hostName}/api/survey-file/selfemployed-extrafiles/add`
    };

    sendRequest(connect, onResponse, initialApplicationDataResponse, dispatch);
  };
}

export function addExtraFiles(requestBody: FileRequestBody) {
  actionType = "ExraFiles";

  return function implementAdd(dispatch: any) {
    axiosToken = makeCancellationTokenAndSource();

    const connect: Connect = {
      headers: [],
      requestBody: requestBody,
      sourceToken: axiosToken,
      url: `${hostName}/api/survey-file/extrafiles/add`,
    };

    sendRequest(connect, onResponse, initialApplicationDataResponse, dispatch);
  };
}


export function downloadFile(blobId: string , fileName: string) {
  return function implementGetSurveyDetails(dispatch : any){
    download(blobId, fileName )
  }
}