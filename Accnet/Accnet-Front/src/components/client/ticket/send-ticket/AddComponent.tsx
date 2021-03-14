// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import { UploadFile } from "antd/lib/upload/interface";
// ======================================= component
import SelectUser from "../../../generals/select/user/SelectUser";

// ======================================= component
import { ticketAdd } from "../../../../redux-logic/ticket/Action";
import { UserModel } from "../../../../redux-logic/user/Type";
import { getNotification } from "../../../../service/notification";
import { getIdFromUploadFile } from "../../../../service/public";
import {
  TicketAddModel,
  TicketPriorityType
} from "../../../../redux-logic/ticket/Type";
import SelectPriorityTicket from "../../../generals/select/ticket/SelectPriorityTicket";
import BlobUpload from "../../../file/BlobUpload";

// ======================================================

const initialize: TicketAddModel = {
  title: "",
  text: "",
  priority: 1,
  blobId: "",
  userId: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  ticketAdd: Function;
  type: "MANAGER" | "USER";
}

class AddComponent extends Component<PropType> {
  requestBody: TicketAddModel = { ...initialize };
  uploadFile: Array<UploadFile> = [];
  userName: string = "";

  handleSubmit = () => {
    if (this.requestBody.title === "") {
      getNotification("Please enter title.");
      return;
    }
    if (this.props.type === "MANAGER") {
      if (this.requestBody.userId === "") {
        getNotification("Please enter user name.");
        return;
      }
    }
    this.requestBody.blobId =
      getIdFromUploadFile(this.uploadFile).length === 0
        ? ""
        : getIdFromUploadFile(this.uploadFile)[0];

    if (this.props.type === "USER") {
      delete this.requestBody.userId;
    }
    this.props.ticketAdd(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.uploadFile = [];
    this.userName = "";
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title={
          this.props.type === "MANAGER"
            ? "Send ticket to user"
            : "Send ticket to support"
        }
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center mt-3">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Send
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <div className="container">
          <div className="row">
            {this.props.type === "MANAGER" ? (
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>User</label>
                  <div>
                    <SelectUser
                      value={this.userName}
                      onChange={(event: UserModel) => {
                        this.requestBody.userId = event.id;
                        this.userName = event.username;
                        this.forceUpdate();
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Priority</label>
                <div>
                  <SelectPriorityTicket
                    value={this.requestBody.priority}
                    onChange={(event: TicketPriorityType) => {
                      this.requestBody.priority = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="form-group">
              <label>Subject</label>
              <input
                value={this.requestBody.title}
                onChange={e => {
                  this.requestBody.title = e.target.value;
                  this.forceUpdate();
                }}
                className="form-control"
                placeholder="Enter ticket title"
              />
            </div>
          </div>
          <div className="">
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={this.requestBody.text}
                onChange={e => {
                  this.requestBody.text = e.target.value;
                  this.forceUpdate();
                }}
                className="form-control"
                style={{ height: "120px", resize: "none" }}
                placeholder="Enter ticket text"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Attachments</label>
                <div>
                  <BlobUpload
                    fileList={this.uploadFile}
                    onChange={(event: Array<UploadFile>) => {
                      this.uploadFile = event;
                      this.forceUpdate();
                    }}
                    Limited={0}
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

const mapDispatchToProps = { ticketAdd };
export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
