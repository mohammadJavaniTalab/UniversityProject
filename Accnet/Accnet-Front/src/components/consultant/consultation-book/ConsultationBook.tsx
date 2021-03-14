import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../redux-logic/Store";
import {
  AppointmentAddModel,
  AppointmentTypeModel,
  AppointmentListResponse,
} from "../../../redux-logic/appointment/Type";
import { getTimeAndDate } from "../../../service/public";
import {
  appointmentAddClient,
  appointmentAddManagement,
  onSelectLoading,
} from "../../../redux-logic/appointment/Action";
import SelectUser from "../../generals/select/user/SelectUser";
import { UserModel } from "../../../redux-logic/user/Type";
import SelectConsultationType from "../../generals/select/consultation/SelectConsultationType";
import { DatePicker, Empty, Button } from "antd";
import { TimePicker } from "antd";
import moment from "moment";
import AllImages from "../../../assets/images/images";
import { ConsultationExceptionListResponse } from "../../../redux-logic/consultation-exception/Type";
import { consultationExceptionList } from "../../../redux-logic/consultation-exception/Action";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";

interface PropsType {
  onPrevious: Function;
  appointmentAddClient: Function;
  appointmentAddManagement: Function;
  consultationExceptionResponse: ConsultationExceptionListResponse;
  onSelectLoading: any;
  appointmentResponse: AppointmentListResponse;
  onVisible: Function;
  date: string;
  duration: number;
  showMessage: boolean;
  type: "MANAGEMENT" | "CLIENT";
  consultationExceptionList: Function;
  isSurveyRelated: boolean;
}

interface TimeException {
  startDate: string;
  endDate: string;
  sameDate: boolean;
  startTime: string;
  endTime: string;
}

class ConsultationBook extends Component<PropsType> {
  requestBody: AppointmentAddModel = {
    date: "",
    title: "",
    description: "",
    duration: 15,
    userId: "",
    type: "Regular Phone Call",
  };

  communicationId: string = "";
  userName: string = "";
  showLoading: boolean = false;
  isDoneCalculatingExceptions: boolean = false;

  requestBodyException: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 100,
  };

  exceptions: Array<TimeException> = [];
  shouldCheckTime: boolean = false;
  disabledTimes: Array<number> = [];

  findDisabledDates = (date: string) => {
    for (let i = 0; i < this.exceptions.length; i++) {
      let exception = this.exceptions[i];
      if (exception.startDate === date || exception.endDate === date) {
        if (exception.sameDate) {
          this.shouldCheckTime = true;
        } else {
          return true;
        }
      } else if (
        moment(date).isBetween(exception.startDate, exception.endDate)
      ) {
        if (exception.sameDate) {
          this.shouldCheckTime = true;
        } else {
          return true;
        }
      }
    }
    return false;
  };

  findDisabledTimes = (date: string) => {
    let shouldReturnTrue: boolean = false;
    for (let i = 0; i < this.exceptions.length; i++) {
      let exception = this.exceptions[i];
      if (exception.sameDate && exception.startDate === date) {
        let startHour = exception.startTime.split(":")[0];
        let endHour = exception.endTime.split(":")[0];
        for (let j = Number(startHour); j < Number(endHour) + 1; j++) {
          this.disabledTimes.push(j);
        }
        shouldReturnTrue = true;
      }
    }
    return shouldReturnTrue;
  };

  calculateDisbaledDatesAndTimes = () => {
    if (this.props.consultationExceptionResponse.success) {
      if (
        this.props.consultationExceptionResponse.items !== undefined &&
        this.props.consultationExceptionResponse.items !== null &&
        this.props.consultationExceptionResponse.items !== [] &&
        this.props.consultationExceptionResponse.items.length > 0
      ) {
        let items = this.props.consultationExceptionResponse.items;

        for (let i = 0; i < items.length; i++) {
          let exception = items[i];
          let startDate = getTimeAndDate(exception.fromDate, "DATE");
          let endDate = getTimeAndDate(exception.toDate, "DATE");
          let temp: TimeException = {
            startDate: startDate,
            startTime: getTimeAndDate(exception.fromDate, "TIME"),
            endDate: endDate,
            endTime: getTimeAndDate(exception.toDate, "TIME"),
            sameDate: startDate === endDate ? true : false,
          };

          this.exceptions.push(temp);
          this.isDoneCalculatingExceptions = true;
        }
      } else {
        this.isDoneCalculatingExceptions = true;
      }
    } else if (this.props.consultationExceptionResponse.error.code !== 0) {
      this.isDoneCalculatingExceptions = true;
    }
  };

  componentDidMount() {
    this.props.consultationExceptionList(this.requestBodyException);
  }

  showDatePicker: boolean = false;
  showTimePicker: boolean = false;

  getSelectedDate = () => {
    return this.requestBody.date.includes("T")
      ? getTimeAndDate(this.requestBody.date, "DATE")
      : this.requestBody.date !== ""
      ? this.requestBody.date
      : getTimeAndDate(moment().format(), "DATE");
  };

  getFirstAvailableTime = () => {
    for (let i = 0; i < 25; i++) {
      if (i > 8 && i < 18) {
        if (this.disabledTimes.indexOf(i) === -1) {
          return i;
        }
      }
    }
    return -1;
  };

  render() {
    const {
      onPrevious,
      date,
      appointmentAddClient,
      appointmentAddManagement,
      onVisible,
      duration,
    } = this.props;

    if (!this.isDoneCalculatingExceptions) {
      this.calculateDisbaledDatesAndTimes();
    }

    if (
      this.showLoading &&
      (this.props.appointmentResponse.updateList ||
        this.isDoneCalculatingExceptions)
    ) {
      this.showLoading = false;
      this.props.onSelectLoading();
      onVisible();
    }
    return (
      <div>
        {this.showLoading ? (
          <div className="text-center">
            <Empty
              description={<span>Please wait ...</span>}
              image={AllImages.loading}
            />
          </div>
        ) : (
          <div>
            {" "}
            <div className="row px-5">
              <div className="form-group">
                <div className="col-12">
                  <label>
                    <span>
                      Select time for consultation: ({" "}
                      <strong style={{ color: "red" }}>
                        Pacific Standard Time
                      </strong>{" "}
                      ){" "}
                    </span>
                  </label>
                </div>
                <div className="row col-12">
                  <div className="col-6">
                    <DatePicker
                      format="YYYY-MM-DD"
                      open={this.showDatePicker}
                      onOpenChange={(status: boolean) => {
                        this.showDatePicker = status;
                        this.forceUpdate();
                      }}
                      value={
                        this.requestBody.date !== undefined &&
                        this.requestBody.date !== null &&
                        this.requestBody.date !== ""
                          ? moment(
                              this.requestBody.date.includes("T")
                                ? getTimeAndDate(this.requestBody.date, "DATE")
                                : this.requestBody.date
                            )
                          : undefined
                      }
                      disabledDate={(current: moment.Moment | null) => {
                        if (current !== null) {
                          let day = getTimeAndDate(current.format(), "DATE");
                          var date = new Date();

                          date.setDate(date.getDate() - 1);

                          return (
                            this.findDisabledDates(day) ||
                            current.isBefore(moment(date))
                          )
                        } else {
                          return false;
                        }
                      }}
                      onChange={(date, dateString) => {
                        this.requestBody.date = `${dateString}`;
                        let firstTime = this.getFirstAvailableTime();
                        if (firstTime !== -1) {
                          this.requestBody.date = this.getSelectedDate().concat(
                            `T${firstTime}:00:00`
                          );
                        }

                        this.showDatePicker = false;
                        this.showTimePicker = true;
                        this.disabledTimes = [];
                        this.forceUpdate();
                      }}
                      className="from-control"
                      showTime={false}
                    />
                  </div>
                  <div className="col-6">
                    <TimePicker
                      className="from-control"
                      onOpenChange={(status: boolean) => {
                        this.showTimePicker = status;
                        this.forceUpdate();
                      }}
                      open={this.showTimePicker}
                      disabledHours={() => {
                        let disbaledHours = [
                          0,
                          1,
                          2,
                          3,
                          4,
                          5,
                          6,
                          7,
                          8,
                          18,
                          19,
                          20,
                          21,
                          22,
                          23,
                          24,
                        ];
                        if (this.shouldCheckTime) {
                          let date = this.requestBody.date.includes("T")
                            ? getTimeAndDate(this.requestBody.date, "DATE")
                            : this.requestBody.date;

                          if (this.findDisabledTimes(date)) {
                            for (
                              let i = 0;
                              i < this.disabledTimes.length;
                              i++
                            ) {
                              disbaledHours.push(this.disabledTimes[i]);
                            }
                          }
                        }
                        return disbaledHours;
                      }}
                      disabledMinutes={(selectedHour: number) => {
                        if (duration === 15) {
                          if (this.shouldCheckTime) {
                            let disables: boolean = false;
                            for (
                              let i = 0;
                              i < this.disabledTimes.length;
                              i++
                            ) {
                              if (this.disabledTimes[i] === selectedHour) {
                                disables = true;
                              }
                            }
                            if (disables) {
                              return [0, 15, 30, 45];
                            }
                          }

                          return [];
                        } else {
                          let disabledMinutes: Array<number> = [];
                          for (let i = 1; i < 60; i++) {
                            disabledMinutes.push(i);
                          }
                          return disabledMinutes;
                        }
                      }}
                      value={
                        this.requestBody.date !== undefined &&
                        this.requestBody.date !== null &&
                        this.requestBody.date !== ""
                          ? this.requestBody.date.includes("T")
                            ? moment(
                                getTimeAndDate(this.requestBody.date, "TIME"),
                                "HH:mm"
                              )
                            : undefined
                          : undefined
                      }
                      minuteStep={duration === 15 ? 15 : 1}
                      onChange={(date, dateString) => {
                        let selectedDate = this.getSelectedDate();
                        if (duration !== 15) {
                          this.showTimePicker = false;
                        } else {
                          let selectedTime = this.requestBody.date.includes("T")
                            ? getTimeAndDate(this.requestBody.date, "TIME")
                            : "";
                          if (selectedTime !== "") {
                            this.showTimePicker = false;
                          }
                        }

                        let time = "";
                        if (duration === 15) {
                          time = `${dateString}`;
                        } else {
                          time = `${dateString.split(":")[0]}:00:00`;
                        }
                        this.requestBody.date = selectedDate.concat(`T${time}`);

                        this.forceUpdate();
                      }}
                      format={"HH:mm"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row px-5">
              <div className="col-12">
                <div className="form-group">
                  <label>
                    Please fill out the entries below so that we can deliver a
                    personalized and productive meeting.
                  </label>
                </div>
              </div>
            </div>
            <div className="row px-5">
              <div className="col-6">
                <div className="form-group">
                  <label>Select Consultation Type</label>
                  <SelectConsultationType
                    value={this.requestBody.type}
                    onChange={(event: AppointmentTypeModel) => {
                      this.requestBody.type = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
              {this.props.type === "MANAGEMENT" ? (
                <div className="col-6">
                  <div className="form-group">
                    <label>User</label>
                    <div>
                      <SelectUser
                        value={this.userName}
                        onChange={(event: UserModel) => {
                          this.userName = event.username;
                          this.requestBody.userId = event.id;
                          this.forceUpdate();
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="col-6">
                <div className="form-group">
                  <label>Phone number/Skype number</label>
                  <div>
                    <input
                      value={this.communicationId}
                      onChange={(e) => {
                        this.communicationId = e.target.value;
                        this.forceUpdate();
                      }}
                      className="form-control"
                      placeholder="Enter a Phone number/Skype number"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row px-5">
              {/* <div className="col-12">
            <div className="form-group">
              <label>Title</label>
              <input
                value={this.requestBody.title}
                onChange={e => {
                  this.requestBody.title = e.target.value;
                  this.forceUpdate();
                }}
                className="form-control"
                placeholder="Enter your title for consultation"
              />
            </div>
          </div> */}
              {this.props.showMessage ? (
                <div className="col-12">
                  <div className="form-group">
                    <label>What do you wish to discuss in our meeting?</label>
                    <textarea
                      style={{ height: "120px", resize: "none" }}
                      value={this.requestBody.description}
                      onChange={(e) => {
                        this.requestBody.description = e.target.value;
                        this.forceUpdate();
                      }}
                      className="form-control"
                      placeholder="Enter your discussion"
                      maxLength={250}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <hr />
            <div style={{ display: "flow-root" }}>
              <button
                disabled={
                  (this.props.type === "MANAGEMENT" &&
                    this.requestBody.userId === "") ||
                  this.communicationId === ""
                }
                onClick={() => {
                  let updateAppointment: any = {
                    ...this.requestBody,
                    duration,
                  };

                  updateAppointment.type = `${this.requestBody.type}@#@${this.communicationId}`;
                  this.showLoading = true;
                  this.forceUpdate();
                  if (this.props.type === "CLIENT") {
                    delete updateAppointment.userId;
                    updateAppointment = {
                      ...updateAppointment,
                      surveyRelated: this.props.isSurveyRelated,
                    };
                    appointmentAddClient(updateAppointment);
                  }
                  if (this.props.type === "MANAGEMENT") {
                    appointmentAddManagement(updateAppointment);
                  }
                  // onVisible();
                }}
                className="btn btn-primary float-right"
              >
                Set consultation time
              </button>
              <button
                onClick={() => onPrevious()}
                className="btn btn-outline-secondary float-left"
              >
                Previous
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    appointmentResponse: state.appointmentReducer,
    consultationExceptionResponse: state.consultationExceptionReducer,
  };
}

const mapDispatchToProps = {
  appointmentAddClient,
  appointmentAddManagement,
  onSelectLoading,
  consultationExceptionList,
};
export default connect(mapStateToProps, mapDispatchToProps)(ConsultationBook);
