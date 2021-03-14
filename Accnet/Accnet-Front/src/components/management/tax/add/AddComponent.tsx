// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Switch from "antd/lib/switch";
import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import { UploadFile } from "antd/lib/upload/interface";
// ======================================= component
import SelectUser from "../../../generals/select/user/SelectUser";

// ======================================= component
import { BasicTaxModel } from "../../../../redux-logic/tax/Type";
import { taxAdd } from "../../../../redux-logic/tax/Action";
import { UserModel } from "../../../../redux-logic/user/Type";
import { blobUpload } from "../../../../service/constants/defaultValues";
import { getNotification } from "../../../../service/notification";
import { getIdFromUploadFile } from "../../../../service/public";
import { Select } from "antd";
import { initialUserModel } from "../../../../redux-logic/auth/profile/InitialResponse";
const { Option } = Select;

// ======================================================

const initialize: BasicTaxModel = {
  creationDate: "",
  id: "",
  relationType: "",
  taxFile: {
    userSignedEngagementId: "",
    userSignedTaxFormId: "",
    engagementBlobId: "",
    taxFormBlobId: "",
    extraTaxFile: [],
  },
  user: {
    ...initialUserModel,
  },
  amount: -0, //
  title: "", //
  status: 1,
  description: "", //
  enabled: true,
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  taxAdd: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: BasicTaxModel = { ...initialize };
  userName: string = "";
  uploadFile: Array<UploadFile> = [];

  handleSubmit = () => {
    if (this.requestBody.user.id === "") {
      getNotification("Please select user.");
      return;
    }
    if (this.requestBody.title === "") {
      getNotification("Please enter title.");
      return;
    }

    if (this.requestBody.description === "") {
      getNotification("Please enter description.");
      return;
    }

    this.props.taxAdd(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.userName = "";
    this.uploadFile = [];
    this.forceUpdate();
    this.props.onVisible();
  };

  findTaxStatus = () => {
    switch (this.requestBody.status) {
      case 1:
        return "Setting Consultation";
      case 2:
        return "Pending Consultation";
      case 3:
        return "Payment Pending";
      case 4:
        return "Processing Tax File";
      case 5:
        return "Documents Sign";
      case 6:
        return "AccNet E-Filing";
      case 7:
        return "E-Filing on your own";
    }
  };

  render() {
    return (
      <Modal
        title="Add tax"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Add
            </button>
          </div>
        }
        onCancel={this.closeModal}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>User name</label>
                <div>
                  <SelectUser
                    value={this.userName}
                    onChange={(event: UserModel) => {
                      this.requestBody.user = event;
                      this.userName = event.username;
                      this.forceUpdate();
                    }}
                  />
                </div>
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
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Title</label>
                <input
                  value={this.requestBody.title}
                  onChange={(e) => {
                    this.requestBody.title = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter tax title"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Amount</label>
                <input
                  value={
                    this.requestBody.amount === -0
                      ? undefined
                      : this.requestBody.amount
                  }
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      this.requestBody.amount = Number(e.target.value);
                    } else {
                      this.requestBody.amount = -0;
                    }
                    this.forceUpdate();
                  }}
                  className="form-control"
                  min="0"
                  type="text"
                  pattern="[0-9]*"
                  maxLength={15}
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Status</label>
                <Select
                  value={this.findTaxStatus()}
                  className="w-100"
                  placeholder="Select Status"
                  onChange={(event: string) => {
                    switch (event) {
                      case "SetConsultation":
                        this.requestBody.status = 1;
                        break;
                      case "PendingConsultation":
                        this.requestBody.status = 2;
                        break;
                      case "PaymentPending":
                        this.requestBody.status = 3;
                        break;
                      case "ProcessPending":
                        this.requestBody.status = 4;
                        break;
                      case "DocumentSign":
                        this.requestBody.status = 5;
                        break;

                      case "AccNetEFiling":
                        this.requestBody.status = 6;
                        break;

                      case "UserEFiling":
                        this.requestBody.status = 6;
                        break;
                    }
                    this.forceUpdate();
                  }}
                >
                  <Option value="SetConsultation" key="1">
                    Set Consultation
                  </Option>
                  <Option value="PendingConsultation" key="2">
                    Pending Consultation
                  </Option>
                  <Option value="PaymentPending" key="3">
                    Payment Pending
                  </Option>
                  <Option value="ProcessPending" key="4">
                    Tax Process Pending
                  </Option>
                  <Option value="EngagementSign" key="5">
                    Document Sign
                  </Option>
                  <Option value="AccNetEFiling" key="6">
                    AccNet E-Filing
                  </Option>
                  <Option value="UserEFiling" key="7">
                    User E-Filing
                  </Option>
                </Select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  style={{ height: "120px", resize: "none" }}
                  value={this.requestBody.description}
                  onChange={(e) => {
                    this.requestBody.description = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter tax description"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Income Tax Form</label>
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

const mapDispatchToProps = { taxAdd };
export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
