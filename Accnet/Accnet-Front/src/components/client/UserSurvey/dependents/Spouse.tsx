import React, { Component } from "react";
import { Modal, Button, DatePicker, Empty } from "antd";

import {
  SpouseResponse,
  SpouseModel,
  FetchSpouseResponse,
} from "../../../../redux-logic/spouse/Type";
import {
  addSpouse,
  fetchSpouse,
  onDoingAdd,
  resetAdd,
} from "../../../../redux-logic/spouse/Action";
import { AppState } from "../../../../redux-logic/Store";
import { connect } from "react-redux";
import SelectGender from "../../../generals/select/gender/SelectGender";
import { BasicGenderModel } from "../../../../redux-logic/essentials-tools/type/Response-type";
import SinNumberInput from "../../../generals/select/sin-number/SinNumberInput";
import moment from "moment";
import AllImages from "../../../../assets/images/images";
import { getIdFromUploadFile } from "../../../../service/public";
import UserUpload from "../documents/UserUpload";
import {
  AllFilesResponse,
  FileResponse,
  FileRequestBody,
} from "../../../../redux-logic/files/Type";

interface SpousePropTypes {
  spouseModalVisibility: boolean;
  onCancel: any;
  onSave: any;
  surveyId: string;
  spouseResponse: SpouseResponse;
  fetchSpouseResponse: FetchSpouseResponse;
  addSpouse: any;
  fetchSpouse: any;
  onDoingAdd: any;
  resetAdd: any;
}

class Spouse extends Component<SpousePropTypes> {
  step: number = 0;
  lastStep: boolean = false;

  holdDocuments : AllFilesResponse = {
    assessments : [],
    extraFile : [],
    reciepts : []
  }

  currentSpouseModel: SpouseModel = {
    dateOfBirth: "",
    email: "",
    firstname: "",
    assessments: [],
    receipts: [],
    extraFiles: [],
    gender: "",
    lastname: "",
    mobile: "",
    password: "",
    sinNumber: "",
    userId: "",
  };

  updateStep = (goingNext: boolean) => {
    if (!this.lastStep || !goingNext) {
      switch (this.step) {
        case 0:
          this.step++;

          break;

        case 1:
          if (goingNext) {
            this.step++;
          } else {
            this.step--;
          }
          break;
        case 2:
          if (goingNext) {
            this.step++;
          } else {
            this.step--;
          }
          break;

        case 3:
          this.props.resetAdd();
          this.step = 0;
          break;
      }

      if (this.step === 2) {
        this.lastStep = true;
      } else {
        this.lastStep = false;
      }
      this.forceUpdate();
    } else {
      this.lastStep = false;
      this.step = 3;
      this.props.onDoingAdd();
      this.props.addSpouse(this.currentSpouseModel, this.props.surveyId);
    }
  };

  checkSuccessfulAdd = () => {
    if (this.props.spouseResponse.success) {
      if (this.props.spouseResponse.data === null) {
        return true;
      }
    }
    return false;
  };

  makeArrayOfBlobIds = (items: Array<FileResponse>) => {
    let blobIds: Array<string> = [];
    for (let i = 0; i < items.length; i++) {
      blobIds.push(items[i].id);
    }
    return blobIds;
  };

  haveFetchedSpouse: boolean = false;
  addByAlreadyUser: boolean = false;
  isUploading: boolean = false;
  render() {
    return (
      <Modal
        visible={this.props.spouseModalVisibility}
        title={"Add Spouse"}
        onCancel={() => {
          this.props.onCancel();
        }}
        closable={true}
        maskClosable={false}
        closeIcon={<span className="fa fa-times" />}
        footer={
          !this.checkSuccessfulAdd() ? (
            <div style={{ display: "flow-root" }}>
              {this.step !== 1 && this.step !== 3 ? (
                <Button
                  type="primary"
                  className="float-right"
                  disabled={this.isUploading}
                  onClick={() => {
                    this.updateStep(true);
                  }}
                >
                  {this.lastStep ? "Save" : "Next"}
                </Button>
              ) : null}

              {this.step !== 0 || this.lastStep ? (
                <Button
                  className="float-left"
                  disabled={this.isUploading}
                  onClick={() => {
                    this.updateStep(false);
                  }}
                >
                  Previous
                </Button>
              ) : null}
            </div>
          ) : this.checkSuccessfulAdd() ? (
            <Button
              type="primary"
              onClick={() => {
                this.props.onSave();
              }}
            >
              Next Question
            </Button>
          ) : !this.props.spouseResponse.success &&
            this.props.spouseResponse.error.code !== 0 ? (
            <Button
              type="primary"
              onClick={() => {
                this.step = 0;
                this.forceUpdate();
              }}
            >
              {" "}
              Retry{" "}
            </Button>
          ) : null
        }
      >
        {this.props.spouseResponse.loading ? (
          <div className="text-center py-3">
            <Empty
              description={<span>Please wait ...</span>}
              image={AllImages.loading}
            />
          </div>
        ) : null}
        {this.checkSuccessfulAdd() ? (
          <div>Successfully saved your spouse details.</div>
        ) : !this.props.spouseResponse.success &&
          this.props.spouseResponse.error.code !== 0 ? (
          this.props.spouseResponse.error.data[0]
        ) : null}

        {this.step === 0 ? (
          <div className="container">
            <div className="row pb-2">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Title</label>
                  <SelectGender
                    value={this.currentSpouseModel.gender}
                    onChange={(event: BasicGenderModel) => {
                      this.currentSpouseModel.gender = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    value={this.currentSpouseModel.firstname}
                    onChange={(e) => {
                      this.currentSpouseModel.firstname = e.target.value;
                      this.forceUpdate();
                    }}
                    className="form-control"
                    placeholder="Enter first name"
                    maxLength={32}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    value={this.currentSpouseModel.lastname}
                    onChange={(e) => {
                      this.currentSpouseModel.lastname = e.target.value;
                      this.forceUpdate();
                    }}
                    className="form-control"
                    placeholder="Enter last name"
                    maxLength={32}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={this.currentSpouseModel.email}
                    onChange={(e) => {
                      this.currentSpouseModel.email = e.target.value;
                      this.forceUpdate();
                    }}
                    className="form-control"
                    placeholder="Enter email"
                    maxLength={32}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    value={this.currentSpouseModel.mobile}
                    onChange={(e) => {
                      this.currentSpouseModel.mobile = e.target.value;
                      this.forceUpdate();
                    }}
                    className="form-control"
                    placeholder="Enter mobile"
                    pattern="[0-9]*"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>BirthDate</label>
                  <div>
                    <DatePicker
                      placeholder="Select BirthDate"
                      className="w-100"
                      allowClear={false}
                      value={
                        this.currentSpouseModel.dateOfBirth === ""
                          ? undefined
                          : moment(this.currentSpouseModel.dateOfBirth)
                      }
                      disabledDate={(d: any) => {
                        return (
                          !d ||
                          d.isAfter(moment(new Date())) ||
                          d.isSameOrBefore("1910-01-01")
                        );
                      }}
                      onChange={(date: any, dateString: any) => {
                        this.currentSpouseModel.dateOfBirth = dateString;
                        this.forceUpdate();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>SIN (For Fastest Results)</label>
                  <SinNumberInput
                    value={this.currentSpouseModel.sinNumber}
                    onChange={(event: string) => {
                      this.currentSpouseModel.sinNumber = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {this.step === 1 ? (
          <UserUpload
          key="spouseBase"
            onSaveAnswer={(response: AllFilesResponse) => {
              this.holdDocuments = response
              this.currentSpouseModel = {
                ...this.currentSpouseModel,
                extraFiles: this.makeArrayOfBlobIds(response.extraFile),
                receipts: this.makeArrayOfBlobIds(response.reciepts),
                assessments: this.makeArrayOfBlobIds(response.assessments),
              };
              this.updateStep(true);
            }}
            surveyId={this.props.surveyId}
            typeOfUser="spouse"
            userId={
              this.props.spouseResponse.data !== undefined && 
              this.props.spouseResponse.data !== null && 
              this.props.spouseResponse.data.id !== undefined &&
              this.props.spouseResponse.data.id !== null &&
              this.props.spouseResponse.data.id !== ""
                ? this.props.spouseResponse.data.id
                : ""
            }
            providedResponses={this.holdDocuments}
          />
        ) : null}

        {this.lastStep ? (
          <div>
            <div className="container-fluid">
              <div className="text-center mb-5">
                <span className="h4 text-secondary">
                  <span>{this.currentSpouseModel.gender}</span>
                  <span className="mx-2">
                    {this.currentSpouseModel.firstname}
                  </span>
                  <span>{this.currentSpouseModel.lastname}</span>
                </span>
              </div>
              <div className="profile-data h6 py-2">
                <span className="text-muted mr-2">BirthDate : </span>
                <b>{this.currentSpouseModel.dateOfBirth}</b>
              </div>
              <div className="profile-data h6 py-2">
                <span className="text-muted mr-2">Email : </span>
                <b> {this.currentSpouseModel.email}</b>
              </div>
              <div className="profile-data h6 py-2">
                <span className="text-muted mr-2">Phone NO : </span>
                <b> {this.currentSpouseModel.mobile}</b>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    spouseResponse: state.spouseReducer,
    fetchSpouseResponse: state.fetchSpouseReducer,
  };
};

export default connect(mapStateToProps, {
  addSpouse,
  fetchSpouse,
  onDoingAdd,
  resetAdd,
})(Spouse);
