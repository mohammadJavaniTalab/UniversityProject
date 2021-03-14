import { ApplicationListResponse, ApplicationDataResponse } from "../type/Response-type";

export const initialListResponse: ApplicationListResponse = {
  items: [],
  data: {},
  totalCount: 0,
  pageSize: 0,
  pageNumber: 0,
  success: false,
  error: {
    code: 0,
    data: []
  },
  message: "" ,
  loading : false,
  selectLoading: false,
  updateList: false
};



export const initialDataResponse: ApplicationDataResponse = {
  data: {},
  success: false,
  error: {
    code: 0,
    data: []
  },
  message: "" ,
  loading : false
};
