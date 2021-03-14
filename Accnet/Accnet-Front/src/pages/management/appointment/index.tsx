// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";

// ======================================= component
import LayoutManagement from "../../../components/management/layout/LayoutManagement";
import ConfirmAppointment from "../../../components/management/confirm-appointment/ConfirmAppointment";
import Consultant from "../../../components/consultant/Consultant";

// ======================================= redux
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { AppState } from "../../../redux-logic/Store";
import {
  appointmentList,
  appointmentEdit,
  appointmentDelete,
} from "../../../redux-logic/appointment/Action";
import {
  AppointmentListResponse,
  AppointmentListModel,
} from "../../../redux-logic/appointment/Type";

// ======================================= services
import { checkFieldIsOk, getTimeAndDate } from "../../../service/public";
import AllImages from "../../../assets/images/images";
import { Pagination, Button, Modal, Input, DatePicker, TimePicker } from "antd";
import { pathProject } from "../../../service/constants/defaultValues";
import { initialUserModel } from "../../../redux-logic/auth/profile/InitialResponse";
import moment from "moment";
import "./style.scss";

// =====================================================

interface PropsType {
  appointmentList: Function;
  appointmentResponse: AppointmentListResponse;
  appointmentEdit: Function;
  appointmentDelete: Function;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
  };
  current_appointment: any = {};
  visible: boolean = false;
  consultantVisible: boolean = false;

  selectedConsultation: AppointmentListModel = {
    approved: false,
    creationDate: "",
    date: "",
    description: "",
    id: "",
    duration: 0,
    representative: "",
    title: "",
    type: "",
    user: {
      ...initialUserModel,
    },
  };

  comminucationId: string = "";
  componentDidMount = () => {
    this.props.appointmentList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { appointmentResponse } = this.props;
    if (appointmentResponse.updateList) {
      this.showLoading = false;
      this.props.appointmentList(this.requestBody);
    }
  };

  consultantVisibleOnChange = () => {
    this.consultantVisible = !this.consultantVisible;
    this.forceUpdate();
  };

  onVisible = () => {
    this.visible = !this.visible;
    this.forceUpdate();
  };

  showLoading: boolean = false;

  renderResult = () => {
    const { appointmentResponse } = this.props;
    return (
      <tbody>
        {appointmentResponse.items.map((appointment: AppointmentListModel) => (
          <tr
            key={JSON.stringify(appointment)}
            className={
              appointment.duration === 15
                ? "comp-color-accent"
                : "green-color-accent"
            }
          >
            <td>
              {appointment.duration !== 15 ? (
                <span className="fa fa-star" />
              ) : null}
            </td>
            <td>
              {checkFieldIsOk(appointment.user.username)
                ? appointment.user.username
                : ""}
            </td>
            <td>
              {checkFieldIsOk(appointment.user.firstname)
                ? appointment.user.firstname
                : ""}
            </td>
            <td>
              {checkFieldIsOk(appointment.user.lastname)
                ? appointment.user.lastname
                : ""}
            </td>
            <td>
              <span>{getTimeAndDate(appointment.creationDate, "DATE")}</span>
              <span> - </span>
              <span>{getTimeAndDate(appointment.creationDate, "TIME")}</span>
            </td>
            <td>
              <span>{getTimeAndDate(appointment.date, "DATE")}</span>
              <span> - </span>
              <span>{getTimeAndDate(appointment.date, "TIME")}</span>
            </td>
            <td>
              <Button
                type="link"
                onClick={() => {
                  this.showConsultationDetail = true;
                  this.selectedConsultation = {
                    ...appointment,
                  };
                  this.forceUpdate();
                }}
                style={{ color: "white" }}
              >
                View Details
              </Button>
            </td>
            <td>
              <Button
                type="link"
                onClick={() => {
                  this.showLoading = true;
                  this.props.appointmentDelete(appointment.id);
                }}
                style={{ color: "white" }}
              >
                Delete
              </Button>
            </td>
            <td>
              <Button
                type="link"
                onClick={() => {
                  this.showConsultationDetail = true;
                  this.editConsultation = true;
                  this.selectedConsultation = {
                    ...appointment,
                  };
                  this.forceUpdate();
                }}
                style={{ color: "white" }}
              >
                Edit
              </Button>
            </td>
            {/* <td>
              {appointment.approved ? (
                <span className="glyph-icon simple-icon-check h4 text-success" />
              ) : (
                <span className="glyph-icon simple-icon-close h4 text-danger" />
              )}
            </td>
            <td>
              <button
                className="btn-icon glyph-icon iconsminds-calendar-4"
                onClick={() => {
                  this.current_appointment = appointment;
                  this.onVisible();
                }}
              />
            </td> */}
            <Modal
              visible={this.showLoading}
              closable={false}
              maskClosable={false}
              footer={null}
            >
              <div className="text-center py-3">
                <Empty
                  description={<span>Please wait ...</span>}
                  image={AllImages.loading}
                />
              </div>
            </Modal>
          </tr>
        ))}
      </tbody>
    );
  };

  editConsultation: boolean = false;
  showConsultationDetail: boolean = false;
  settedComminucation: boolean = false;
  render() {
    if (
      !this.settedComminucation &&
      this.selectedConsultation.type.split("@#@") !== [""] &&
      this.selectedConsultation.type.split("@#@")[1] !== undefined
    ) {
      this.comminucationId = this.selectedConsultation.type.split("@#@")[1];
      this.settedComminucation = true;
    }
    const { appointmentResponse } = this.props;
    return (
      <LayoutManagement pagePath={pathProject.management.appointment}>
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-6 text-left">
              <h3 className="mt-2 grid-title">Consultation Management</h3>
            </div>
            <div className="col-sm-12 col-md-3 align-right f-right mb-3"></div>
            <div className="col-sm-12 col-md-3 text-md-right">
              <button
                className="btn btn-outline-primary mb-3 add-item-btn"
                onClick={() => this.consultantVisibleOnChange()}
              >
                <span className="glyph-icon simple-icon-plus mr-1"></span>
                <span>Add consultation</span>
              </button>
            </div>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">VIP</th>
                    <th scope="col">USER</th>
                    <th scope="col">First NAME</th>
                    <th scope="col">LAST NAME</th>
                    <th scope="col">CREATION DATE</th>
                    <th scope="col">CONSULTATION DATE</th>
                    <th scope="col">DETAILS</th>
                    <th scope="col">DELETE</th>
                    <th scope="col">EDIT</th>
                  </tr>
                </thead>
                {this.renderResult()}
              </table>
              {!appointmentResponse.loading &&
              appointmentResponse.items.length === 0 ? (
                <div className="text-center">
                  <Empty
                    description={<span>No Consultation Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}

              {appointmentResponse.loading ? (
                <div className="text-center py-3">
                  <Empty
                    description={<span>Please wait ...</span>}
                    image={AllImages.loading}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="text-center mt-2">
            <Pagination
              current={this.requestBody.PageNumber + 1}
              onChange={(event: number) => {
                this.requestBody.PageNumber = event - 1;
                this.forceUpdate();
                this.props.appointmentList(this.requestBody);
              }}
              total={appointmentResponse.totalCount}
            />
          </div>
          <ConfirmAppointment
            appointment={this.current_appointment}
            visible={this.visible}
            onVisible={() => this.onVisible()}
          />
          <Consultant
            isSurveyRelated={false}
            showMessageBox={true}
            visible={this.consultantVisible}
            onVisible={this.consultantVisibleOnChange}
            closeAble={true}
            type="MANAGEMENT"
            current_step={null}
          />
          <Modal
            visible={this.showConsultationDetail}
            closable={true}
            maskClosable={false}
            destroyOnClose={true}
            onCancel={() => {
              this.editConsultation = false;
              this.settedComminucation = false
              this.showConsultationDetail = false;
              this.selectedConsultation = {
                approved : false,
                creationDate : "",
                date : "",
                description : "",
                duration : 15,
                id : "",
                representative : "",
                title : "",
                type : "",
                user : {
                  ...initialUserModel
                }
              }
              this.forceUpdate();
            }}
            closeIcon={<span className="fa fa-times" />}
            footer={
              this.editConsultation
                ? [
                    <Button
                      type="primary"
                      onClick={() => {
                        this.selectedConsultation.type = `${this.selectedConsultation.type}@#@${this.comminucationId}`;
                        this.props.appointmentEdit(this.selectedConsultation);
                      }}
                    >
                      Edit
                    </Button>,
                  ]
                : null
            }
            title={"Consultation Details"}
          >
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>
                    <span>Consultation Date: </span>
                  </label>
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={
                      this.selectedConsultation.date !== undefined &&
                      this.selectedConsultation.date !== null &&
                      this.selectedConsultation.date !== ""
                        ? moment(
                            this.selectedConsultation.date.includes("T")
                              ? getTimeAndDate(
                                  this.selectedConsultation.date,
                                  "DATE"
                                )
                              : this.selectedConsultation.date
                          )
                        : undefined
                    }
                    disabled={!this.editConsultation}
                    onChange={(date, dateString) => {
                      this.selectedConsultation.date = `${dateString}T09:00:00`;
                    }}
                    className="from-control"
                    showTime={false}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>
                    <span>Consultation Time: </span>
                  </label>
                  <TimePicker
                    className="from-control"
                    disabledMinutes={() => {
                      if (this.selectedConsultation.duration === 15) {
                        return [];
                      } else {
                        let disabledMinutes: Array<number> = [];
                        for (let i = 1; i < 60; i++) {
                          disabledMinutes.push(i);
                        }
                        return disabledMinutes;
                      }
                    }}
                    disabled={!this.editConsultation}
                    value={
                      this.selectedConsultation.date !== undefined &&
                      this.selectedConsultation.date !== null &&
                      this.selectedConsultation.date !== ""
                        ? moment(
                            getTimeAndDate(
                              this.selectedConsultation.date,
                              "TIME"
                            ),
                            "HH:mm"
                          )
                        : moment("09:00:00", "HH:mm")
                    }
                    minuteStep={
                      this.selectedConsultation.duration === 15 ? 15 : 1
                    }
                    onChange={(date, dateString) => {
                      let selectedDate = this.selectedConsultation.date.includes(
                        "T"
                      )
                        ? getTimeAndDate(this.selectedConsultation.date, "DATE")
                        : this.selectedConsultation.date !== ""
                        ? this.selectedConsultation.date
                        : getTimeAndDate(moment().format(), "DATE");
                      let time = "";
                      if (this.selectedConsultation.duration === 15) {
                        time = `${dateString}:00`;
                      } else {
                        time = `${dateString}:00:00`;
                      }

                      this.selectedConsultation.date = selectedDate.concat(
                        `T${time}`
                      );
                      this.forceUpdate();
                    }}
                    format={"HH:mm"}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>
                    <span>Message: </span>
                  </label>
                  <textarea
                    disabled={!this.editConsultation}
                    className="form-control"
                    style={{ height: "120px", resize: "none" }}
                    onChange={(event: any) => {
                      this.selectedConsultation.description =
                        event.target.value;
                      this.forceUpdate();
                    }}
                    value={
                      this.selectedConsultation.description !== undefined &&
                      this.selectedConsultation.description !== null &&
                      this.selectedConsultation.description !== ""
                        ? this.selectedConsultation.description
                        : "No Description"
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>
                    <span>Communication Type: </span>
                  </label>
                  <input
                    disabled={!this.editConsultation}
                    className="form-control"
                    value={
                      this.selectedConsultation.type !== undefined &&
                      this.selectedConsultation.type !== null &&
                      this.selectedConsultation.type !== ""
                        ? this.selectedConsultation.type.includes("@#@")
                          ? this.selectedConsultation.type.split("@#@")[0]
                          : this.selectedConsultation.type
                        : "Regular Phone Call"
                    }
                    onChange={(event: any) => {
                      this.selectedConsultation.type = event.target.value;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>
                    <span>Communication ID / NO: </span>
                  </label>
                  <input
                    disabled={!this.editConsultation}
                    className="form-control"
                    value={this.comminucationId}
                    onChange={(event: any) => {
                      this.comminucationId = event.target.value;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </Fragment>
      </LayoutManagement>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    appointmentResponse: state.appointmentReducer,
  };
}

const mapDispatchToProps = {
  appointmentList,
  appointmentEdit,
  appointmentDelete,
};

export default connect(mapStateToProps, mapDispatchToProps)(index);
