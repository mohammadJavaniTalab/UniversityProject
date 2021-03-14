import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from "antd/lib/switch";
import DatePicker from "antd/lib/date-picker";
import Modal from "antd/lib/modal";
import Moment from "moment";
import { userAdd } from "../../../../redux-logic/user/Action";
import { UserAddEditModel } from "../../../../redux-logic/user/Type";
import SelectGender from "../../../generals/select/gender/SelectGender";
import { getNotification } from "../../../../service/notification";
import SelectRole from "../../../generals/select/role/SelectRole";
import { RoleModel } from "../../../../redux-logic/role/Type";
import { BasicGenderModel } from "../../../../redux-logic/essentials-tools/type/Response-type";
import SinNumberInput from "../../../generals/select/sin-number/SinNumberInput";
import GoogleAutoComplete from "../../../generals/select/google-auto-complete/GoogleAutoComplete";
import { GoogleAutoCompleteModel } from "../../../../redux-logic/google/Type";
import { checkFieldIsOk } from "../../../../service/public";

const initialize: UserAddEditModel = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  email: "",
  mobile: "",
  dateOfBirth: "",
  postalCode: "",
  address: "",
  latitude: 0,
  longtitude: 0,
  maritualStatus: 1,
  sinNumber: "",
  enabled: true,
  gender: "Mr",
  roleId: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  userAdd: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: UserAddEditModel = { ...initialize };
  roleName: string = "";
  confirm_password: string = "";
  placeId: string = "";

  handleSubmit = () => {
    if (this.requestBody.firstname === "") {
      getNotification("Please enter first name.");
      return;
    }
    if (this.requestBody.lastname === "") {
      getNotification("Please enter last name.");
      return;
    }
    if (this.requestBody.dateOfBirth === "") {
      getNotification("Please enter birthDate.");
      return;
    }
    if (this.requestBody.email === "") {
      getNotification("Please enter email.");
      return;
    }
    if (this.requestBody.mobile === "") {
      getNotification("Please enter mobile.");
      return;
    }
    if (this.requestBody.postalCode === "") {
      getNotification("Please enter postalCode.");
      return;
    }
    if (this.requestBody.address === "") {
      getNotification("Please enter address.");
      return;
    }
    if (this.requestBody.username === "") {
      getNotification("Please enter username.");
      return;
    }
    if (this.requestBody.password === "") {
      getNotification("Please enter password.");
      return;
    }
    if (this.requestBody.roleId === "") {
      getNotification("Please enter role.");
      return;
    }
    this.props.userAdd(this.requestBody, this.placeId);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.roleName = "";
    this.confirm_password = "";
    this.placeId = "";
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title="Add User"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center mt-3">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Add user
            </button>
          </div>
        }
        onCancel={() => this.props.onVisible()}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Title</label>
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
              <div className="form-group">
                <span>Role</span>
                <div>
                  <SelectRole
                    value={this.roleName}
                    onChange={(event: RoleModel) => {
                      this.roleName = event.name;
                      this.requestBody.roleId = event.id;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>First Name</label>
                <input
                  value={this.requestBody.firstname}
                  onChange={e => {
                    this.requestBody.firstname = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter first name"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Last Name</label>
                <input
                  value={this.requestBody.lastname}
                  onChange={e => {
                    this.requestBody.lastname = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Username</label>
                <input
                  value={this.requestBody.username}
                  onChange={e => {
                    this.requestBody.username = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter username"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>BirthDate</label>
                <div>
                  <DatePicker
                    placeholder="Select BirthDate"
                    className="w-100"
                    allowClear={false}
                    value={
                      this.requestBody.dateOfBirth === ""
                        ? undefined
                        : Moment(this.requestBody.dateOfBirth)
                    }
                    onChange={(date, dateString) => {
                      this.requestBody.dateOfBirth = dateString;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Email</label>
                <input
                  value={this.requestBody.email}
                  onChange={e => {
                    this.requestBody.email = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Phone No</label>
                <input
                  value={this.requestBody.mobile}
                  onChange={e => {
                    this.requestBody.mobile = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  type="text"
                  min="0"
                  pattern="[0-9]*"
                  maxLength={15}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Password</label>
                <input
                  value={this.requestBody.password}
                  name="current-password"
                  onChange={event => {
                    this.requestBody.password = event.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  style={{
                    borderColor:
                      this.confirm_password === this.requestBody.password
                        ? ""
                        : "red"
                  }}
                  placeholder="Enter new password"
                  type="password"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Confirm password</label>
                <input
                  value={this.confirm_password}
                  name="confirm-password"
                  onChange={event => {
                    this.confirm_password = event.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  style={{
                    borderColor:
                      this.confirm_password === this.requestBody.password
                        ? ""
                        : "red"
                  }}
                  placeholder="Confirm your password"
                  type="password"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  value={this.requestBody.postalCode}
                  onChange={e => {
                    this.requestBody.postalCode = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter postal code"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>SIN </label>
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
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Active user</label>
                <div>
                  <Switch
                    checked={this.requestBody.enabled}
                    className="mx-2"
                    onChange={event => {
                      this.requestBody.enabled = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label>Address</label>
              <GoogleAutoComplete
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
              />
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

const mapDispatchToProps = { userAdd };
export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
