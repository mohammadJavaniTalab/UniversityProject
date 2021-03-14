import React, { Component } from "react";
import { AppointmentActionType } from "./Type";
import { ApplicationListResponse } from "../essentials-tools/type/Response-type";
import { initialListResponse } from "../essentials-tools/initial-response/InitialResponse";
import { getNotification } from "../../service/notification";
import Modal from "antd/lib/modal";
import { navigate } from "gatsby";
import { pathProject } from "../../service/constants/defaultValues";

let currentStateValue: ApplicationListResponse = {
  ...initialListResponse,
  loading: true,
};

export const appointmentReducer = (
  state = {},
  action: AppointmentActionType
): ApplicationListResponse => {
  switch (action.type) {
    case "APPOINTMENT_LIST":
      currentStateValue = {
        ...action.response,
      };
      return currentStateValue;

    case "APPOINTMENT_ADD_CLIENT":
      if (action.response.success) {
        if (
          action.response.data.vip !== undefined &&
          action.response.data.vip !== null &&
          action.response.data.vip
        ) {
          Modal.success({
            title: action.response.data.message,
            content: null,
            onOk() {
              navigate(pathProject.client.invoice)
            },
          });
        } else {
          Modal.success({
            title: action.response.data.message,
            content: null,
            onOk() {
              navigate(pathProject.client.invoice)
            },
          });
        }
      } else {
        Modal.error({
          title:
            action.response.error.code !== 0
              ? action.response.error.data[0]
              : "Something went wrong, please try again later.",
          content: null,
          onOk() {},
        });
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true,
      };
      return currentStateValue;

    case "APPOINTMENT_ADD_MANAGEMENT":
      if (action.response.success) {
        Modal.success({
          title: "Requested Consultation Has Been Set",
          content: null,
          onOk() {},
        });
      } else {
        Modal.error({
          title: "Could Not Set Consultation",
          content: null,
          onOk() {},
        });
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true,
      };
      return currentStateValue;

    case "APPOINTMENT_EDIT":
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

    case "APPOINTMENT_DELETE":
      if (action.response.success) {
        getNotification("Successfully Deleted");
      } else {
        getNotification("Deleting failed");
      }
      currentStateValue = {
        ...currentStateValue,
        updateList: true,
      };
      return currentStateValue;

    case "APPOINTMENT_SELECT_LOADING":
      currentStateValue = {
        ...currentStateValue,
        selectLoading: true,
        updateList: false,
      };
      return currentStateValue;

    default:
      return currentStateValue;
  }
};
