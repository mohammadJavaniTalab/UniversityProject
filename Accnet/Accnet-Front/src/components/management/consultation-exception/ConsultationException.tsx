import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import TimePicker from "antd/lib/time-picker";
import DatePicker from "antd/lib/date-picker";

import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";
import { ConsultationExceptionAddEditModel } from "../../../redux-logic/consultation-exception/Type";
import {
  consultationExceptionAdd,
  consultationExceptionEdit,
} from "../../../redux-logic/consultation-exception/Action";

import moment from "moment";
import { getNotification } from "../../../service/notification";

const format = "HH:mm";

interface PropType {
  consultationDetails: CrudObject;
  onChange: Function;
  consultationExceptionAdd: Function;
  consultationExceptionEdit: Function;
}

class ConsultationException extends Component<PropType> {
  current_consultation = {
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
  };

  componentDidUpdate = () => {
    const { consultationDetails, onChange } = this.props;
    if (consultationDetails.visible) {
      if (consultationDetails.edit) {
        if (consultationDetails.update) {
          const from: Array<string> = consultationDetails.value.fromDate.split(
            "T"
          );
          const to: Array<string> = consultationDetails.value.toDate.split("T");
          this.current_consultation = {
            fromDate: from.length === 2 ? from[0] : "",
            fromTime: from.length === 2 ? from[1] : "",
            toDate: to.length === 2 ? to[0] : "",
            toTime: to.length === 2 ? to[1] : "",
          };
          const update: CrudObject = {
            ...consultationDetails,
            update: false,
          };
          onChange(update);
        }
      }
    }
  };

  handleSubmit = () => {
    const {
      consultationExceptionAdd,
      consultationDetails,
      consultationExceptionEdit,
    } = this.props;
    if (this.current_consultation.fromDate === "") {
      getNotification("Please enter from date");
      return;
    }

    if (this.current_consultation.fromTime === "") {
      getNotification("Please enter from time");
      return;
    }

    if (this.current_consultation.toDate === "") {
      getNotification("Please enter to date");
      return;
    }

    if (this.current_consultation.toTime === "") {
      getNotification("Please enter to time");
      return;
    }

    if (consultationDetails.edit) {
      const update: ConsultationExceptionAddEditModel = {
        fromDate: `${this.current_consultation.fromDate}T${this.current_consultation.fromTime}`,
        toDate: `${this.current_consultation.toDate}T${this.current_consultation.toTime}`,
        id: consultationDetails.value.id,
      };
      consultationExceptionEdit(update);
    } else {
      const update: ConsultationExceptionAddEditModel = {
        fromDate: `${this.current_consultation.fromDate}T${this.current_consultation.fromTime}`,
        toDate: `${this.current_consultation.toDate}T${this.current_consultation.toTime}`,
      };
      consultationExceptionAdd(update);
    }
    this.closeModal();
  };

  closeModal = () => {
    const { consultationDetails, onChange } = this.props;
    this.current_consultation.fromDate = "";
    this.current_consultation.fromTime = "";
    this.current_consultation.toDate = "";
    this.current_consultation.toTime = "";
    const update: CrudObject = {
      ...consultationDetails,
      visible: false,
    };
    onChange(update);
  };

  render() {
    const { consultationDetails } = this.props;
    return (
      <Modal
        title={
          consultationDetails.edit
            ? "Edit Consultation Exception"
            : "Add Consultation Exception"
        }
        visible={consultationDetails.visible}
        maskClosable={false}
        footer={
          <div className="text-center mt-3">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              {consultationDetails.edit ? "Edit" : "Add"}
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>From date</label>
                <div>
                  <DatePicker
                    value={
                      this.current_consultation.fromDate === ""
                        ? undefined
                        : moment(this.current_consultation.fromDate)
                    }
                    onChange={(date, dateString) => {
                      this.current_consultation.fromDate = dateString;
                      this.forceUpdate();
                    }}
                    
                    placeholder="Enter exception date"
                    allowClear={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>From time</label>
                <div>
                  <TimePicker
                    value={
                      this.current_consultation.fromTime === ""
                        ? undefined
                        : moment(this.current_consultation.fromTime, format)
                    }
                    onChange={(time, timeString) => {
                      this.current_consultation.fromTime = timeString;
                      this.forceUpdate();
                    }}
                    format={format}
                    defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                    minuteStep={15}
                    placeholder="Enter exception time"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>To date</label>
                <div>
                  <DatePicker
                    value={
                      this.current_consultation.toDate === ""
                        ? undefined
                        : moment(this.current_consultation.toDate)
                    }
                    onChange={(date, dateString) => {
                      this.current_consultation.toDate = dateString;
                      this.forceUpdate();
                    }}
                    
                    placeholder="Enter exception date"
                    allowClear={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>To Time</label>
                <div>
                  <TimePicker
                    value={
                      this.current_consultation.toTime === ""
                        ? undefined
                        : moment(this.current_consultation.toTime, format)
                    }
                    onChange={(time, timeString) => {
                      this.current_consultation.toTime = timeString;
                      this.forceUpdate();
                    }}
                    format={format}
                    minuteStep={15}
                    defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                    placeholder="Enter exception time"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}

const mapDispatchToProps = {
  consultationExceptionAdd,
  consultationExceptionEdit,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsultationException);
