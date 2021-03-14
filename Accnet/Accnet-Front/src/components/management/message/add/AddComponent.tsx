// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Switch from "antd/lib/switch";

// ======================================= component
import SelectUser from "../../../generals/select/user/SelectUser";

// ======================================= redux
import { UserModel } from "../../../../redux-logic/user/Type";
import { messageAdd } from "../../../../redux-logic/message/Action";
import {
  MessageAddModel,
  MessagePriorityType
} from "../../../../redux-logic/message/Type";

// ======================================= services
import { getNotification } from "../../../../service/notification";
import SelectMessagePriority from "../../../generals/select/message/SelectMessagePriority";

// ======================================================

const initialize: MessageAddModel = {
  toUser: "",
  title: "",
  body: "",
  priority: 1,
  enabled: true
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  messageAdd: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: MessageAddModel = { ...initialize };
  userName: string = "";

  handleSubmit = () => {
    if (this.requestBody.toUser === "") {
      getNotification("Please select user for message");
      return;
    }
    if (this.requestBody.title === "") {
      getNotification("Please enter message title");
      return;
    }
    if (this.requestBody.body === "") {
      getNotification("Please enter message body");
      return;
    }
    this.props.messageAdd(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.userName = "";
    this.props.onVisible();
    this.forceUpdate();
  };

  render() {
    return (
      <Modal
        title="Send message"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Send Message
            </button>
          </div>
        }
        onCancel={this.closeModal}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>To User</label>
                <div>
                  <SelectUser
                    value={this.userName}
                    onChange={(event: UserModel) => {
                      this.requestBody.toUser = event.id;
                      this.userName = event.username;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Priority</label>
                <div>
                  <SelectMessagePriority
                    value={this.requestBody.priority}
                    onChange={(event: MessagePriorityType) => {
                      this.requestBody.priority = event;
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
                <label>Message title</label>
                <input
                  value={this.requestBody.title}
                  onChange={e => {
                    this.requestBody.title = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter message title"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Show to user</label>
                <div>
                  <Switch
                    checked={this.requestBody.enabled}
                    onChange={(event: boolean) => {
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
              <div className="form-group">
                <label>Message Body</label>
                <textarea
                  value={this.requestBody.body}
                  style={{ height: "120px", resize: "none" }}
                  onChange={e => {
                    this.requestBody.body = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter message body"
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

const mapDispatchToProps = { messageAdd };

export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
