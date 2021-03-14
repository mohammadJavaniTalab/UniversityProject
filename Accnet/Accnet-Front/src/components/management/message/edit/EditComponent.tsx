// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Switch from "antd/lib/switch";

// ======================================= redux
import { messageEdit } from "../../../../redux-logic/message/Action";
import {
  MessageEditModel,
  MessageModel,
  MessagePriorityType
} from "../../../../redux-logic/message/Type";

// ======================================= services
import { getNotification } from "../../../../service/notification";
import SelectMessagePriority from "../../../generals/select/message/SelectMessagePriority";

// ======================================================

const initialize: MessageEditModel = {
  title: "",
  body: "",
  priority: 1,
  id: "",
  enabled: false
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  messageEdit: Function;
  editValue: MessageModel;
}

class EditComponent extends Component<PropType> {
  requestBody: MessageEditModel = { ...initialize };

  componentDidUpdate = () => {
    const { visible, editValue } = this.props;
    if (visible) {
      if (editValue.id !== this.requestBody.id) {
        this.requestBody.id = editValue.id;
        this.requestBody.title = editValue.title;
        this.requestBody.body = editValue.body;
        this.requestBody.priority = editValue.priority;
        this.requestBody.enabled = editValue.enabled;
        this.forceUpdate();
      }
    }
  };

  handleSubmit = () => {
    if (this.requestBody.title === "") {
      getNotification("Please enter message title");
      return;
    }
    if (this.requestBody.body === "") {
      getNotification("Please enter message body");
      return;
    }
    this.props.messageEdit(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.props.onVisible();
    this.forceUpdate();
  };

  render() {
    return (
      <Modal
        title="Edit message"
        destroyOnClose
        maskClosable={false}
        visible={this.props.visible}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Edit Message
            </button>
          </div>
        }
        onCancel={this.closeModal}
      >
        <div className="container">
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
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Enable</label>
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
            <div className="col-12 col-sm-6"></div>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}

const mapDispatchToProps = { messageEdit };

export default connect(mapStateToProps, mapDispatchToProps)(EditComponent);
