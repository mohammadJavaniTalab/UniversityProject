import React, { Component } from "react";
import {
  ConsultationActionType,
  ConsultationExceptionListResponse,
} from "./Type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";

let currentStateValue: ApplicationListResponse = {
  ...initialListResponse,
  loading: true,
};

export const consultationExceptionReducer = (
  state = {},
  action: ConsultationActionType
): ConsultationExceptionListResponse => {
  switch (action.type) {
    case "CONSULTATION_EXCEPTION_LIST":
      currentStateValue = {
        ...action.response,
      };
      return currentStateValue;
    case "CONSULTATION_EXCEPTION_ADD":
      if (action.response.success) {
        getNotification("Successfully added");
      } else {
        getNotification("Adding failed");
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true,
      };
      return currentStateValue;
    case "CONSULTATION_EXCEPTION_EDIT":
      if (action.response.success) {
        getNotification("Successfully edited");
      } else {
        getNotification("Editing failed");
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true,
      };
      return currentStateValue;
    case "CONSULTATION_EXCEPTION_DELETE":
      if (action.response.success) {
        getNotification("Successfully deleted");
      } else {
        getNotification("deleting failed");
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true,
      };
      return currentStateValue;
    default:
      return currentStateValue;
  }
};

// case "APPOINTMENT_ADD_CLIENT":
//       if (action.response.success) {
//         Modal.success({
//           title:
//             "Your consultation request has been sent for our support team please be patient we will inform you as soon as possible.",
//           content: null,
//           onOk() {}
//         });
//       } else {
//         Modal.error({
//           title:
//             "Setting your Consultation can not be possible at the moment please try again after a time.",
//           content: null,
//           onOk() {}
//         });
//       }
//       currentStateValue = {
//         ...currentStateValue,
//         updateList: true
//       };
//       return currentStateValue;
