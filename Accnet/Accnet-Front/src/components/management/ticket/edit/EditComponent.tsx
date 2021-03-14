// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import { UploadFile } from "antd/lib/upload/interface";

// ======================================= component
import { ticketEdit } from "../../../../redux-logic/ticket/Action";
import { UserModel } from "../../../../redux-logic/user/Type";
import { blobUpload } from "../../../../service/constants/defaultValues";
import { getNotification } from "../../../../service/notification";
import { getIdFromUploadFile } from "../../../../service/public";
import {
  TicketEditModel,
  TicketPriorityType,
  TicketListModel
} from "../../../../redux-logic/ticket/Type";
import SelectPriorityTicket from "../../../generals/select/ticket/SelectPriorityTicket";

// ======================================================

const initialize: TicketEditModel = {
  title: "",
  text: "",
  priority: 1,
  blobId: "",
  id: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  ticketEdit: Function;
  editValue: TicketListModel;
}

class AddComponent extends Component<PropType> {
  requestBody: TicketEditModel = { ...initialize };
  uploadFile: Array<UploadFile> = [];

  componentDidUpdate = () => {
    const { visible, editValue } = this.props;
    if (visible) {
      if (this.requestBody.id !== editValue.id) {
        this.requestBody.title = editValue.title;
        this.requestBody.text = editValue.text;
        this.requestBody.priority = editValue.priority;
        this.requestBody.id = editValue.id;
        this.requestBody.blobId = editValue.blobId;
        this.forceUpdate();
      }
    }
  };

  handleSubmit = () => {
    if (this.requestBody.title === "") {
      getNotification("Please enter title.");
      return;
    }
    this.requestBody.blobId =
      getIdFromUploadFile(this.uploadFile).length === 0
        ? ""
        : getIdFromUploadFile(this.uploadFile)[0];

    this.props.ticketEdit(this.requestBody);
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
        title="Edit ticket"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Edit
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <div className="container">
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
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}

const mapDispatchToProps = { ticketEdit };
export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
