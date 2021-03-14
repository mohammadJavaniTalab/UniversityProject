import {
  ApplicationListResponse,
  ApplicationDataResponse,
} from "../type/Response-type";
import { publicCheckArray, checkFieldIsOk } from "../../../service/public";
import { getNotification } from "../../../service/notification";
import { Error } from "../type/Response-type";
import { navigate } from "gatsby";
import { pathProject } from "../../../service/constants/defaultValues";

const initialError: Error = {
  code: 0,
  data: [],
};

export function checkListResponse(
  response: ApplicationListResponse
): ApplicationListResponse {
  return {
    items: publicCheckArray(response.items) ? response.items : [],
    data: response.data,
    totalCount: response.totalCount,
    pageSize: response.pageSize,
    pageNumber: response.pageNumber,
    success: response.success,
    error: response.error,
    message: response.message,
    loading: false,
    selectLoading: false,
    updateList: false,
  };
}

export function checkDataResponse(response: any) {
  return {
    data: checkFieldIsOk(response.data) ? response.data : [],
    success: response.success,
    error: checkError(response),
    message: response.message,
    loading: false,
  };
}

function checkError(response: ApplicationDataResponse) {
  if (!response.success) {
    if (response.error.code === 1000000) {
      getNotification("Connection To Server is not possible at the moment");
      navigate(pathProject.login);
    }
    if (response.error.code === 40111) {
      getNotification(
        "Your Credentials Does Not Exist Or Your Password Wrong, Check And Try Again"
      );
    }
    if (publicCheckArray(response.error.data)) {
      if (response.error.data.length !== 0) {
        getNotification(
          `${response.error.data.map((message: string) => message)}`
        );
      }
    }
  }

  return response.error;
}

// message: ``,

// const errorCodes = {
//   1000000: "Connection To Server is not possible at the moment , please turn off vpn if you have any and try again",
//   40111:
// }
