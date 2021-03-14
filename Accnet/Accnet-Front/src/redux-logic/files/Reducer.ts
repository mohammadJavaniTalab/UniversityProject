import {
  FileListResponse,
  FetchFiles,
  fileAllActionTypes,
  FetchMedicalFiles,
  MedicalList,
  FetchChildCareFiles,
  ChildCareList,
  SelfEmployeeList,
  FetchSelfEmployeeFiles,
} from "./Type";
import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";

const initialListResponse: FileListResponse = {
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

const initialApplicationDataResponse: ApplicationDataResponse = {
  data: {},
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let currentListResponse: FileListResponse = {
  ...initialListResponse,
};

let currentAdd: ApplicationDataResponse = {
  ...initialApplicationDataResponse,
};











const initialSelfList: SelfEmployeeList = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let currentSelf: SelfEmployeeList = {
  ...initialSelfList,
};

export function fetchSelfFiles(
  state = initialMedicalList,
  action: FetchSelfEmployeeFiles
): SelfEmployeeList {
  switch (action.type) {
    case "FETCH_SELF_EMPLOYEE_LIST":
      currentSelf = {
        ...action.response,
      };
      return currentSelf;

    default:
      return currentSelf;
  }
}

const initialMedicalList: MedicalList = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let currentMedical: MedicalList = {
  ...initialMedicalList,
};

export function fetchMedicalFiles(
  state = initialMedicalList,
  action: FetchMedicalFiles
): MedicalList {
  switch (action.type) {
    case "FETCH_MEDICAL_LIST":
      currentMedical = {
        ...action.response,
      };
      return currentMedical;

    default:
      return currentMedical;
  }
}

const initialChildCareList: ChildCareList = {
  data: [],
  error: {
    code: 0,
    data: [],
  },
  loading: false,
  message: "",
  success: false,
};

let currentChildCare: ChildCareList = {
  ...initialChildCareList,
};

export function fetchChildCareFiles(
  state = initialChildCareList,
  action: FetchChildCareFiles
): ChildCareList {
  switch (action.type) {
    case "FETCH_CHILD_CARE_LIST":
      currentChildCare = {
        ...action.response,
      };
      return currentChildCare;

    default:
      return currentChildCare;
  }
}

export function fetchAllFiles(
  state = initialListResponse,
  action: FetchFiles
): FileListResponse {
  switch (action.type) {
    case "FETCH_ALL_FILES":
      currentListResponse = {
        ...action.response,
      };
      return currentListResponse;

    default:
      return currentListResponse;
  }
}

export function addAllFiles(
  state = initialApplicationDataResponse,
  action: fileAllActionTypes
): ApplicationDataResponse {
  switch (action.type) {
    case "ADD_ASSESSMENTS":
      currentAdd = {
        ...action.response,
      };
      return currentAdd;

    case "ADD_RECIEPTS":
      currentAdd = {
        ...action.response,
      };
      return currentAdd;
    case "ADD_EXTRA_FILES":
      currentAdd = {
        ...action.response,
      };
      return currentAdd;
    case "ADD_MEDICAL_FILES":
      currentAdd = {
        ...action.response,
      };
      return currentAdd;
    case "ADD_CHILD_CARE_FILES":
      currentAdd = {
        ...action.response,
      };
      return currentAdd;
    case "ADD_SELF_EMPLOYEE":
      currentAdd = {
        ...action.response,
      };
      return currentAdd;
    default:
      return currentAdd;
  }
}
