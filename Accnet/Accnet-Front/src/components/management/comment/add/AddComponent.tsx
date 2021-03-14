import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";
import { getNotification } from "../../../../service/notification";
import { CommentAddModel } from "../../../../redux-logic/comment/Type";
import BlobUpload from "../../../file/BlobUpload";
import { UploadFile } from "antd/lib/upload/interface";
import { getIdFromUploadFile } from "../../../../service/public";
import { commentAdd } from "../../../../redux-logic/comment/Action"

const initialize: CommentAddModel = {
  text: "",
  ticketId: "",
  blobId: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  commentAdd: Function;
  ticketId: string
}

class AddComponent extends Component<PropType> {
  requestBody: CommentAddModel = { ...initialize };
  filetList: Array<UploadFile> = [];

  handleSubmit = () => {
    const { ticketId } = this.props
    if (this.requestBody.text === "") {
      getNotification("Please enter text");
      return;
    }
    this.requestBody.blobId = getIdFromUploadFile(this.filetList).length === 0 ? "" : getIdFromUploadFile(this.filetList)[0];
    this.requestBody.ticketId = ticketId ;
    this.props.commentAdd(this.requestBody)
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.filetList = []
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title="Add comment"
        visible={this.props.visible}
        footer={
          <div className="text-center mt-3">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Add comment
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={this.requestBody.text}
                  style={{ height: "120px", resize: "none" }} 
                  onChange={e => {
                    this.requestBody.text = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter message"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Attachments</label>
                <div>
                  <BlobUpload
                    fileList={this.filetList}
                    onChange={(event: Array<UploadFile>) => {
                      this.filetList = event;
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

const mapDispatchToProps = { commentAdd };

export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
