import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import { ProfileResponse } from "../../../redux-logic/auth/profile/Type";
import { AppState } from "../../../redux-logic/Store";
import { changePassword } from "../../../redux-logic/auth/profile/update-profile/Action";
import { checkFieldIsOk } from "../../../service/public";
import { getNotification } from "../../../service/notification";

import "./style.scss";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";
import { ProfileChangePasswordModel } from "../../../redux-logic/auth/profile/update-profile/Type";
import { Input, Tooltip } from "antd";

interface PropType {
  password: CrudObject;
  onChange: Function;
  profileResponse: ProfileResponse;
  changePassword: Function;
}

class ChangePassword extends Component<PropType> {
  requestBody: ProfileChangePasswordModel = {
    newPassword: "",
  };
  confirm_password: string = "";

  handleSubmit = () => {
    if (!checkFieldIsOk(this.requestBody.newPassword)) {
      getNotification("Please enter new password");
      return;
    }
    this.props.changePassword(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    const { password, onChange } = this.props;
    this.requestBody.newPassword = "";
    this.confirm_password = "";
    const update: CrudObject = {
      ...password,
      visible: false,
    };
    onChange(update);
  };

  render() {
    const { password } = this.props;
    return (
      <Modal
        title="Change password"
        visible={password.visible}
        footer={null}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.closeModal()}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <Tooltip
                  trigger={"focus"}
                  title={"Password must contains (A-Z , a-z , 0-9)"}
                  placement="topLeft"
                  overlayClassName="numeric-input"
                >
                  <Input.Password
                    value={
                      this.requestBody.newPassword === null
                        ? ""
                        : this.requestBody.newPassword
                    }
                    onChange={(event) => {
                      this.requestBody.newPassword = event.target.value;
                      this.forceUpdate();
                    }}
                    className="form-control"
                    maxLength={15}
                    style={{
                      borderColor:
                        this.confirm_password === this.requestBody.newPassword
                          ? ""
                          : "red",
                    }}
                    placeholder="Enter new password"
                    type="password"
                  />
                </Tooltip>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                
                  <Input.Password
                    value={
                      this.confirm_password === null
                        ? ""
                        : this.confirm_password
                    }
                    onChange={(event) => {
                      this.confirm_password = event.target.value;
                      this.forceUpdate();
                    }}
                    maxLength={15}
                    className="form-control"
                    style={{
                      borderColor:
                        this.confirm_password === this.requestBody.newPassword
                          ? ""
                          : "red",
                    }}
                    placeholder="Confirm your password"
                    type="password"
                  />
                
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={this.handleSubmit}
              disabled={this.confirm_password !== this.requestBody.newPassword}
              className="mb-2 btn btn-outline-success"
            >
              Change
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    profileResponse: state.profileReducer,
  };
}
const mapDispatchToProps = { changePassword };
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
