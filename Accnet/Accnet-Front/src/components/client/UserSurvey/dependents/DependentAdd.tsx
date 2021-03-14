import React, { Component } from "react";
import { Modal, Button, DatePicker, Checkbox, Empty } from "antd";
import { AppState } from "../../../../redux-logic/Store";
import { connect } from "react-redux";
import {
  Dependent,
  Dependent_Add_Delete_Response,
} from "../../../../redux-logic/dependent/Type";
import {
  addDependentByModel,
  onDoingAdd,
  resetAdd,
} from "../../../../redux-logic/dependent/Action";

import { BasicGenderModel } from "../../../../redux-logic/essentials-tools/type/Response-type";
import { initialUserModel } from "../../../../redux-logic/auth/profile/InitialResponse";

import moment from "moment";
import SelectRelationShip from "../../../generals/select/relation-ship/SelectRelationShip";
import SelectGender from "../../../generals/select/gender/SelectGender";
import { UserModel } from "../../../../redux-logic/user/Type";
import SinNumberInput from "../../../generals/select/sin-number/SinNumberInput";
import SelectProvince from "../../../generals/select/province/SelectProvince";
import AllImages from "../../../../assets/images/images";
import UserUpload from "../documents/UserUpload";
import {
  AllFilesResponse,
  FileResponse,
} from "../../../../redux-logic/files/Type";

interface DependentAddPropTypes {
  surveyId: string;
  onCancel: any;
  reloadList: any;
  addDependentByModel: any;
  resetAdd: any;
  onDoingAdd: any;
  add_delete_dependent_response: Dependent_Add_Delete_Response;
  dependentAddModalVisibility: boolean;
}
const emptyUser: UserModel = initialUserModel;
class DependentAdd extends Component<DependentAddPropTypes> {
  step: number = 0;
  lastStep: boolean = false;
  setTuitionFee: boolean = false;
  addressFillMethod: string = "automatic";
  hasPOBox: boolean = false;
  holdDocuments: AllFilesResponse = {
    assessments: [],
    extraFile: [],
    reciepts: [],
  };

  dependent: Dependent = {
    relationType: "",
    surveyId: this.props.surveyId,
    user: {
      ...emptyUser,
    },
  };
  selectedPlaceId: string = "";

  initializeDependent = () => {
    this.dependent = {
      relationType: "",
      surveyId: this.props.surveyId,
      user: {
        ...emptyUser,
      },
    };
    this.forceUpdate();
  };

  isUploading: boolean = false;

  updateStep = (goingNext: boolean) => {
    if (!this.lastStep) {
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
          if (goingNext) {
            this.step++;
          } else {
            this.step--;
          }
          break;
        case 4:
          this.step--;
          break;
      }

      if (this.step === 3) {
        this.lastStep = true;
      } else {
        this.lastStep = false;
      }
      this.forceUpdate();
    } else {
      this.lastStep = false;
      this.step = 4;
      this.props.onDoingAdd();
      this.props.addDependentByModel(
        this.dependent,
        this.selectedPlaceId,
        this.props.surveyId
      );
    }
  };

  checkSuccessfulAdd = () => {
    if (this.props.add_delete_dependent_response.success) {
      if (this.props.add_delete_dependent_response.data === null) {
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

  fixedLogic: boolean = false;
  render() {
    if (!this.fixedLogic && !this.props.dependentAddModalVisibility) {
      this.initializeDependent();
      this.lastStep = false;
      this.step = 0;
      this.props.resetAdd();
      this.fixedLogic = true;
    }
    return (
      <Modal
        visible={this.props.dependentAddModalVisibility}
        title={"Add Dependent"}
        onCancel={() => {
          this.fixedLogic = false;
          this.props.onCancel();
        }}
        closable={true}
        maskClosable={false}
        closeIcon={<span className="fa fa-times" />}
        footer={
          this.props.add_delete_dependent_response.loading ? null : this
              .step === 4 && !this.checkSuccessfulAdd() ? (
            [
              <Button
                type="primary"
                onClick={() => {
                  this.lastStep = false;
                  this.step = 0;
                  this.forceUpdate();
                }}
              >
                Retry
              </Button>,
            ]
          ) : this.step === 4 && this.checkSuccessfulAdd() ? (
            <Button
              type="primary"
              onClick={() => {
                this.fixedLogic = false;
                this.props.reloadList();
              }}
            >
              Go To List
            </Button>
          ) : (
            [
              !this.checkSuccessfulAdd() ? (
                <div style={{ display: "flow-root" }}>
                  {this.step !== 1 ? (
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
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    this.updateStep(true);
                  }}
                >
                  Next
                </Button>
              ),
            ]
          )
        }
      >
        {this.props.add_delete_dependent_response.loading ? (
          <div className="text-center py-3">
            <Empty
              description={<span>Please wait ...</span>}
              image={AllImages.loading}
            />
          </div>
        ) : null}
        {this.step === 4 &&
        this.checkSuccessfulAdd() &&
        (this.props.add_delete_dependent_response.loading === undefined ||
          this.props.add_delete_dependent_response.loading === null ||
          !this.props.add_delete_dependent_response.loading) ? (
          <div>Successfully saved your dependent details.</div>
        ) : this.step === 4 &&
          (this.props.add_delete_dependent_response.loading === undefined ||
            this.props.add_delete_dependent_response.loading === null ||
            !this.props.add_delete_dependent_response.loading) &&
          !this.props.add_delete_dependent_response.success &&
          this.props.add_delete_dependent_response.error.code !== 0 ? (
          this.props.add_delete_dependent_response.error.data[0]
        ) : null}

        {this.step === 0 ? (
          <div>
            <div className="container">
              <div className="row pb-2">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>Title</label>
                    <SelectGender
                      value={this.dependent.user.gender}
                      onChange={(event: BasicGenderModel) => {
                        this.dependent.user.gender = event;
                        this.forceUpdate();
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>Relation with you</label>
                    <SelectRelationShip
                      isAbove19={true}
                      value={this.dependent.relationType}
                      onChange={(event: string) => {
                        this.dependent.relationType = event;
                        this.forceUpdate();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>
                      <span className="mr-2 text-danger">*</span>
                      <span>First name</span>
                    </label>
                    <input
                      value={this.dependent.user.firstname}
                      onChange={(event) => {
                        this.dependent.user.firstname = event.target.value;
                        this.forceUpdate();
                      }}
                      className="form-control"
                      placeholder="Enter First name"
                      maxLength={32}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>
                      <span className="mr-2 text-danger">*</span>
                      <span>Last name</span>
                    </label>
                    <input
                      value={this.dependent.user.lastname}
                      onChange={(event) => {
                        this.dependent.user.lastname = event.target.value;
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
                    <label>
                      <span className="mr-2 text-danger">*</span>
                      <span>Phone No</span>
                    </label>
                    <input
                      value={this.dependent.user.mobile}
                      onChange={(event) => {
                        this.dependent.user.mobile = event.target.value;
                        this.forceUpdate();
                      }}
                      className="form-control"
                      placeholder="Enter phone number"
                      pattern="[0-9]*"
                      maxLength={15}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>
                      <span className="mr-2 text-danger">*</span>
                      <span>Email</span>
                    </label>
                    <input
                      value={this.dependent.user.email}
                      onChange={(event) => {
                        this.dependent.user.email = event.target.value;
                        this.forceUpdate();
                      }}
                      className="form-control"
                      placeholder="Enter email address"
                      maxLength={32}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>
                      <span className="mr-2 text-danger">*</span>
                      <span>BirthDate</span>
                    </label>
                    <div>
                      <DatePicker
                        value={
                          this.dependent.user.dateOfBirth === ""
                            ? undefined
                            : moment(this.dependent.user.dateOfBirth)
                        }
                        placeholder="Enter your birthDate"
                        allowClear={false}
                        disabledDate={(d: any) => {
                          return (
                            !d ||
                            d.isAfter(moment(new Date())) ||
                            d.isSameOrBefore("1910-01-01")
                          );
                        }}
                        onChange={(date: any, dateString: any) => {
                          this.dependent.user.dateOfBirth = dateString;
                          this.forceUpdate();
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>
                      <span>SIN (For Fastest Results)</span>
                    </label>
                    <SinNumberInput
                      value={this.dependent.user.sinNumber}
                      onChange={(event: string) => {
                        this.dependent.user.sinNumber = event;
                        this.forceUpdate();
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* <div className="row">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>
                      <span className="mr-2 text-danger">*</span>
                      <span>Postal Code</span>
                    </label>
                    <input
                      value={this.dependent.user.postalCode}
                      onChange={(event) => {
                        this.dependent.user.postalCode = event.target.value;
                        this.forceUpdate();
                      }}
                      className="form-control"
                      placeholder="Enter postal code"
                      maxLength={24}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label>
                      <span>Unit Number</span>
                    </label>
                    <input
                      value={this.dependent.user.unitNumber}
                      onChange={(event) => {
                        this.dependent.user.unitNumber = event.target.value;
                        this.forceUpdate();
                      }}
                      className="form-control"
                      placeholder="Enter unit number"
                      maxLength={12}
                    />
                  </div>
                </div>
              </div> */}

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    {/* <label>
                    <span className="mr-2 text-danger">*</span>
                    <span>Address Fill Method</span>
                  </label> */}
                    {/* 
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <Radio.Group
                          value={this.addressFillMethod}
                          onChange={(e: any) => {
                            this.addressFillMethod = e.target.value;
                            this.forceUpdate();
                          }}
                          style={{ marginBottom: 16 }}
                        >
                          <Radio.Button value="manual">
                            Manual Fill
                          </Radio.Button>
                          <Radio.Button value="automatic">
                            Auto Fill
                          </Radio.Button>
                        </Radio.Group>
                      </div>
                    </div>
                  </div> */}
                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <label>
                            <span>Unit Number</span>
                          </label>
                          <input
                            value={this.dependent.user.unitNumber}
                            onChange={(event) => {
                              this.dependent.user.unitNumber =
                                event.target.value;
                              this.forceUpdate();
                            }}
                            className="form-control"
                            placeholder="Enter unit number"
                            maxLength={12}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <Checkbox
                            checked={this.hasPOBox}
                            onChange={(check: any) => {
                              this.hasPOBox = check.target.checked;
                              this.forceUpdate();
                            }}
                          >
                            Do you have a PO Box?
                          </Checkbox>
                        </div>
                      </div>
                    </div>

                    {this.hasPOBox ? (
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <label>
                            <span className="mr-2 text-danger">*</span>
                            <span>PO Box</span>
                          </label>
                          <input
                            type="text"
                            value={this.dependent.user.poBox}
                            onChange={(event) => {
                              this.dependent.user.poBox = event.target.value;
                              this.forceUpdate();
                            }}
                            pattern="[0-9]*"
                            className="form-control"
                            placeholder="Enter PO Box"
                            maxLength={32}
                          />
                        </div>
                      </div>
                    ) : null}
                    {this.addressFillMethod === "automatic" ? (
                      <div className="form-group">
                        <label>
                          <span className="mr-2 text-danger">*</span>
                          <span>Street Address</span>
                        </label>
                        <div className="row">
                          <div className="col-12">
                            <div className="form-group">
                              {/* <GoogleAutoComplete
                              value={
                                checkFieldIsOk(this.requestBody.address)
                                  ? this.requestBody.address
                                  : ""
                              }
                              onChange={(event: GoogleAutoCompleteModel) => {
                                this.requestBody.address = event.description;
                                this.placeId = event.place_id;
                                this.forceUpdate();
                              }}
                            /> */}
                              <textarea
                                value={this.dependent.user.address}
                                onChange={(event) => {
                                  this.dependent.user.address =
                                    event.target.value;
                                  this.forceUpdate();
                                }}
                                rows={5}
                                cols={100}
                                style={{ resize: "none" }}
                                className="form-control w-100"
                                placeholder="Enter street address"
                                maxLength={128}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6">
                            <div className="form-group">
                              <label>
                                <span className="mr-2 text-danger">*</span>
                                <span>City</span>
                              </label>
                              <input
                                value={this.dependent.user.city}
                                onChange={(event) => {
                                  this.dependent.user.city = event.target.value;
                                  this.forceUpdate();
                                }}
                                className="form-control"
                                maxLength={32}
                                placeholder="Enter city name"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6">
                            <div className="form-group">
                              <label>
                                <span className="mr-2 text-danger">*</span>
                                <span>Province</span>
                              </label>
                              <div>
                                <SelectProvince
                                  value={this.dependent.user.province}
                                  onChange={(event: string) => {
                                    this.dependent.user.province = event;
                                    this.forceUpdate();
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="row">
                          <div className="col-12">
                            <div className="form-group">
                              <label>
                                <span className="mr-2 text-danger">*</span>
                                <span>Street Address</span>
                              </label>
                              <textarea
                                value={this.dependent.user.address}
                                onChange={(event) => {
                                  this.dependent.user.address =
                                    event.target.value;
                                  this.forceUpdate();
                                }}
                                rows={5}
                                cols={100}
                                style={{ resize: "none" }}
                                className="form-control w-100"
                                placeholder="Enter street address"
                                maxLength={128}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <label>
                            <span className="mr-2 text-danger">*</span>
                            <span>Postal Code</span>
                          </label>
                          <input
                            value={this.dependent.user.postalCode}
                            onChange={(event) => {
                              this.dependent.user.postalCode =
                                event.target.value;
                              this.forceUpdate();
                            }}
                            className="form-control"
                            placeholder="Enter postal code"
                            maxLength={24}
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <Checkbox
                          checked={this.hasPOBox}
                          onChange={(check: any) => {
                            this.hasPOBox = check.target.checked;
                            this.forceUpdate();
                          }}
                        >
                          Do you have a PO Box that we need to send mails to?
                        </Checkbox>
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {this.step === 1 ? (
          <UserUpload
            onSaveAnswer={(response: AllFilesResponse) => {
              this.dependent.user = {
                ...this.dependent.user,
                extraFiles: this.makeArrayOfBlobIds(response.extraFile),
                receipts: this.makeArrayOfBlobIds(response.reciepts),
                assessments: this.makeArrayOfBlobIds(response.assessments),
              };
              this.updateStep(true);
            }}
            surveyId={this.props.surveyId}
            typeOfUser="dependent"
            userId={""}
            providedResponses={this.holdDocuments}
          />
        ) : null}

        {this.step === 2 ? (
          <div>
            <h3 className="d-block text-center mb-50 t-color question">
              Does your 19 aged and over dependent have any tuition fees?
            </h3>
            <div className="text-center my-2">
              <Button
                type="primary"
                onClick={() => {
                  this.setTuitionFee = true;
                  this.dependent.user.tuitionFee = true;
                  this.updateStep(true);
                }}
              >
                YES
              </Button>
            </div>
            <div className="text-center my-2">
              <Button
                onClick={() => {
                  this.setTuitionFee = false;
                  this.dependent.user.tuitionFee = false;
                  this.updateStep(true);
                }}
              >
                NO
              </Button>
            </div>
          </div>
        ) : null}

        {this.lastStep ? (
          <div>
            <div className="container-fluid">
              <div className="text-center mb-5">
                <span className="h4 text-secondary">
                  <span>{this.dependent.user.gender}</span>
                  <span className="mx-2">{this.dependent.user.firstname}</span>
                  <span>{this.dependent.user.lastname}</span>
                </span>
              </div>
              <div className="profile-data h6 py-2">
                <span className="text-muted mr-2">BirthDate : </span>
                <b>{this.dependent.user.dateOfBirth}</b>
              </div>
              <div className="profile-data h6 py-2">
                <span className="text-muted mr-2">Email : </span>
                <b> {this.dependent.user.email}</b>
              </div>
              <div className="profile-data h6 py-2">
                <span className="text-muted mr-2">Phone NO : </span>
                <b> {this.dependent.user.mobile}</b>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    add_delete_dependent_response: state.dependent_add_delete_reducer,
  };
}

const mapDispatchToProps = { addDependentByModel, onDoingAdd, resetAdd };

export default connect(mapStateToProps, mapDispatchToProps)(DependentAdd);
