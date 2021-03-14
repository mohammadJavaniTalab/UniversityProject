import React, { Component } from "react";
import Modal from "antd/lib/modal";
import { connect } from "react-redux";
import { AppState } from "../../../redux-logic/Store";
import { getTimeAndDate, checkFieldIsOk } from "../../../service/public";
import {
  AppointmentListModel,
  AppointmentEditModel
} from "../../../redux-logic/appointment/Type";
import { appointmentEdit } from "../../../redux-logic/appointment/Action";

interface PropsType {
  appointment: AppointmentListModel;
  visible: boolean;
  onVisible: Function;
  appointmentEdit: Function;
}
class ConfirmAppointment extends Component<PropsType> {
  render() {
    const { appointment, visible, onVisible, appointmentEdit } = this.props;
    return (
      <Modal
        title={
          appointment.approved
            ? "Cancel Consultation Time"
            : "Confirm Consultation Time"
        }
        visible={visible}
        footer={null}
        onCancel={() => onVisible()}
      >
        <div className="px-2">
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>
                  <span>User name : </span>
                </label>
                <b className="mx-2">
                  {checkFieldIsOk(appointment.user)
                    ? appointment.user.username
                    : ""}
                </b>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>
                  <span>Consultation date and time : </span>
                  <b>{getTimeAndDate(appointment.date, "DATE")}</b>
                  <span> - </span>
                  <b>{getTimeAndDate(appointment.date, "TIME")}</b>
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>Title : </label>
                <b className="mx-2">{appointment.title}</b>
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Description</label>
                <div className="border p-2">
                  <span>{appointment.description}</span>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="text-center">
            <button
              onClick={() => {
                const updateAppointment: AppointmentEditModel = {
                  representativeId: appointment.representative,
                  approved: !appointment.approved,
                  id: appointment.id,
                  date: appointment.date,
                  title: appointment.title,
                  description: appointment.description,
                  type: appointment.type
                };
                appointmentEdit(updateAppointment);
                onVisible();
              }}
              className="btn btn-primary"
            >
              {appointment.approved
                ? "Cancel Consultation Time"
                : "Confirm Consultation Time"}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = { appointmentEdit };

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAppointment);
