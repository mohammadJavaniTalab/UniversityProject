// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import { UploadFile } from "antd/lib/upload/interface";

// ======================================= component
import { ticketAdd } from "../../../../redux-logic/ticket/Action";
import { UserModel } from "../../../../redux-logic/user/Type";
import { blobUpload } from "../../../../service/constants/defaultValues";
import { getNotification } from "../../../../service/notification";
import {
  getIdFromUploadFile,
  checkFieldIsOk
} from "../../../../service/public";
import {
  TicketAddModel,
  TicketPriorityType
} from "../../../../redux-logic/ticket/Type";
import SelectPriorityTicket from "../../../generals/select/ticket/SelectPriorityTicket";
import SelectUser from "../../../generals/select/user/SelectUser";

// ======================================================

const initialize: TicketAddModel = {
  title: "",
  text: "",
  priority: 1,
  blobId: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  ticketAdd: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: TicketAddModel = { ...initialize };
  uploadFile: Array<UploadFile> = [];
  userName: string = "";

  handleSubmit = () => {
    if (!checkFieldIsOk(this.requestBody.userId)) {
      getNotification("Please enter user.");
      return;
    }
    if (!checkFieldIsOk(this.requestBody.title)) {
      getNotification("Please enter title.");
      return;
    }
    if (!checkFieldIsOk(this.requestBody.text)) {
      getNotification("Please enter text.");
      return;
    }
    this.requestBody.blobId =
      getIdFromUploadFile(this.uploadFile).length === 0
        ? ""
        : getIdFromUploadFile(this.uploadFile)[0];

    this.props.ticketAdd(this.requestBody);
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
        title="Send ticket to user"
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

          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Title</label>
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
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Text</label>
                <input
                  value={this.requestBody.text}
                  onChange={e => {
                    this.requestBody.text = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter ticket text"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Ticket File</label>
                <Upload
                  name="file"
                  fileList={this.uploadFile}
                  action={`${blobUpload}`}
                  onChange={(info: any) => {
                    this.uploadFile = info.fileList;
                    this.forceUpdate();
                  }}
                >
                  {this.uploadFile.length === 0 ? (
                    <Button>
                      <span className="glyph-icon simple-icon-cloud-upload mr-2" /> 
                      <span>Click to Upload</span>
                    </Button>
                  ) : null}
                </Upload>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group"></div>
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
