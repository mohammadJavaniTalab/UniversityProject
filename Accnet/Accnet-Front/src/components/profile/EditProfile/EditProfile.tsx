// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Upload from "antd/lib/upload";
import DatePicker from "antd/lib/date-picker";
import Modal from "antd/lib/modal";
import moment from "moment";
import Radio from "antd/lib/radio";
import Checkbox from "antd/lib/checkbox";

// ======================================= component
import SelectGender from "../../generals/select/gender/SelectGender";
import GoogleAutoComplete from "../../generals/select/google-auto-complete/GoogleAutoComplete";
import SinNumberInput from "../../generals/select/sin-number/SinNumberInput";
import SelectProvince from "../../generals/select/province/SelectProvince";

// ======================================= redux
import { ProfileResponse } from "../../../redux-logic/auth/profile/Type";
import { AppState } from "../../../redux-logic/Store";
import {
  updateProfile,
  profileLoading,
} from "../../../redux-logic/auth/profile/update-profile/Action";
import { profile } from "../../../redux-logic/auth/profile/Action";

import { BasicGenderModel } from "../../../redux-logic/essentials-tools/type/Response-type";
import { GoogleAutoCompleteModel } from "../../../redux-logic/google/Type";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";

// ======================================= services
import { hostName } from "../../../service/constants/defaultValues";
import { getIdFromUploadFile, checkFieldIsOk } from "../../../service/public";
import { getNotification } from "../../../service/notification";

// ======================================= css
import "./style.scss";
import { UserModel } from "../../../redux-logic/user/Type";
import { initialUserModel } from "../../../redux-logic/auth/profile/InitialResponse";
import { Empty } from "antd";
import AllImages from "../../../assets/images/images";

const initialize: UserModel = {
  ...initialUserModel,
};

interface PropType {
  profileCrud: CrudObject;
  onChange: Function;
  profileLoading: any;
  onSave: any;
  profile: any;
  profileResponse: ProfileResponse;
  updateProfile: Function;
  closeAble: boolean;
}

class EditProfile extends Component<PropType> {
  requestBody: UserModel = { ...initialize };
  uploadAvatar: Array<any> = [];
  uploadReceipts: Array<any> = [];
  placeId: string = "";
  addressFillMethod: string = "automatic";
  hasPOBox: boolean = false;

  needsUpdate: boolean = false;
  componentDidUpdate = () => {
    const { profileResponse, profileCrud, onChange } = this.props;

    if (profileCrud.visible) {
      if (!this.needsUpdate) {
        this.props.profile();
        this.needsUpdate = true;
      }
      if (
        profileCrud.update &&
        profileResponse.data !== undefined &&
        profileResponse.data !== null &&
        profileResponse.data.email !== undefined &&
        profileResponse.data.email !== null
      ) {
        this.requestBody = {
          ...profileResponse.data,
        };

        const update: CrudObject = {
          ...profileCrud,
          update: false,
        };
        onChange(update);
        this.forceUpdate();
      }
    }
  };

  handleSubmit = () => {
    const avatarId = getIdFromUploadFile(this.uploadAvatar);
    this.requestBody.avatarId =
      avatarId.length === 1 ? avatarId[0] : this.requestBody.avatarId;
    let receipts = getIdFromUploadFile(this.uploadReceipts);
    this.requestBody.receipts.concat(receipts);

    if (!checkFieldIsOk(this.requestBody.gender)) {
      getNotification("Enter Title");
      return;
    }
    if (!checkFieldIsOk(this.requestBody.firstname)) {
      getNotification("Enter first name");
      return;
    }
    if (!checkFieldIsOk(this.requestBody.lastname)) {
      getNotification("Enter last name");
      return;
    }

    if (!checkFieldIsOk(this.requestBody.dateOfBirth)) {
      getNotification("Enter birthDate");
      return;
    }
    this.showLoading = true;
    this.forceUpdate();
    this.props.updateProfile(this.requestBody, this.placeId);
  };

  closeModal = () => {
    const { profileCrud, onChange } = this.props;
    this.placeId = "";
    this.uploadAvatar = [];
    this.uploadReceipts = [];
    const update: CrudObject = {
      ...profileCrud,
      visible: false,
      update: false,
    };
    onChange(update);
  };

  showLoading: boolean = false;
  render() {
    const { profileCrud } = this.props;

    if (this.showLoading && this.props.profileResponse.success) {
      this.props.onSave();
      this.closeModal();
    }
    if (!profileCrud.visible) {
      this.showLoading = false;
      this.needsUpdate = false;
    }

    return (
      <Modal
        title="Edit Profile"
        visible={profileCrud.visible}
        footer={
          this.showLoading ? null : (
            <div className="text-center mt-3">
              <button
                onClick={this.handleSubmit}
                className="mb-2 btn btn-outline-success"
              >
                Save
              </button>
            </div>
          )
        }
        maskClosable={false}
        destroyOnClose
        closable={this.props.closeAble}
        onCancel={() => this.closeModal()}
      >
        {this.showLoading ? (
          <div className="text-center">
            <Empty
              description={<span>Please wait ...</span>}
              image={AllImages.loading}
            />
          </div>
        ) : (
          <div className="container">
            <div className="row pb-2">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <div>
                    <SelectGender
                      value={this.requestBody.gender}
                      onChange={(event: BasicGenderModel) => {
                        this.requestBody.gender = event;
                        this.forceUpdate();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <Upload
                  action={`${hostName}/api/blob/upload`}
                  listType="picture-card"
                  fileList={this.uploadAvatar}
                  onPreview={() => {}}
                  onChange={({ fileList }) => {
                    this.uploadAvatar = fileList;
                    this.forceUpdate();
                  }}
                >
                  {this.uploadAvatar.length >= 1 ? null : (
                    <div>
                      <div className="ant-upload-text">Upload avatar</div>
                    </div>
                  )}
                </Upload>
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
                    value={this.requestBody.firstname}
                    onChange={(event) => {
                      this.requestBody.firstname = event.target.value;
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
                    value={this.requestBody.lastname}
                    onChange={(event) => {
                      this.requestBody.lastname = event.target.value;
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
                    value={this.requestBody.mobile}
                    onChange={(event) => {
                      this.requestBody.mobile = event.target.value;
                      this.forceUpdate();
                    }}
                    className="form-control"
                    placeholder="Enter phone number"
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
                    value={this.requestBody.email}
                    onChange={(event) => {
                      this.requestBody.email = event.target.value;
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
                        this.requestBody.dateOfBirth === "" ||
                        this.requestBody.dateOfBirth === null
                          ? undefined
                          : moment(this.requestBody.dateOfBirth)
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
                      onChange={(date, dateString) => {
                        this.requestBody.dateOfBirth = dateString;
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
                    value={this.requestBody.sinNumber}
                    onChange={(event: string) => {
                      this.requestBody.sinNumber = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>

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
                          value={this.requestBody.unitNumber}
                          onChange={(event) => {
                            this.requestBody.unitNumber = event.target.value;
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
                          value={this.requestBody.poBox}
                          onChange={(event) => {
                            this.requestBody.poBox = event.target.value;
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
                              value={this.requestBody.address}
                              onChange={(event) => {
                                this.requestBody.address = event.target.value;
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
                              value={this.requestBody.city}
                              onChange={(event) => {
                                this.requestBody.city = event.target.value;
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
                                value={this.requestBody.province}
                                onChange={(event: string) => {
                                  this.requestBody.province = event;
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
                              value={this.requestBody.address}
                              onChange={(event) => {
                                this.requestBody.address = event.target.value;
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
                          value={this.requestBody.postalCode}
                          onChange={(event) => {
                            this.requestBody.postalCode = event.target.value;
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
        )}
      </Modal>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    profileResponse: state.profileReducer,
  };
}
const mapDispatchToProps = { updateProfile, profile, profileLoading };
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
