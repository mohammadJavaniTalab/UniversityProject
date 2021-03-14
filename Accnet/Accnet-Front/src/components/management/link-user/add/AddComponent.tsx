import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";
import { getNotification } from "../../../../service/notification";
import { LinkedUserAddModel } from "../../../../redux-logic/link_user/Type";
import SelectUser from "../../../generals/select/user/SelectUser";
import { UserModel } from "../../../../redux-logic/user/Type";
import { linkUserAdd } from "../../../../redux-logic/link_user/Action";

const initialize: LinkedUserAddModel = {
  firstUser: "",
  secondUser: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  linkUserAdd: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: LinkedUserAddModel = { ...initialize };
  firstUserName: string = "";
  secondUserName: string = "";

  handleSubmit = () => {
    if (this.requestBody.firstUser === "") {
      getNotification("Please enter first user.");
      return;
    }
    if (this.requestBody.secondUser === "") {
      getNotification("Please enter second user.");
      return;
    }
    this.props.linkUserAdd(this.requestBody)
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title="Link two user"
        visible={this.props.visible}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Link
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>First user</label>
                <div>
                  <SelectUser
                    value={this.firstUserName}
                    onChange={(event: UserModel) => {
                      this.firstUserName = event.username;
                      this.requestBody.firstUser = event.id;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Second user</label>
                <SelectUser
                  value={this.secondUserName}
                  onChange={(event: UserModel) => {
                    this.secondUserName = event.username;
                    this.requestBody.secondUser = event.id;
                    this.forceUpdate();
                  }}
                />
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

const mapDispatchToProps = { linkUserAdd };

export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
