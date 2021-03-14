// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Switch from "antd/lib/switch";
import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import { UploadFile } from "antd/lib/upload/interface";
import { BasicTaxModel, ExtraTaxFile } from "../../../../redux-logic/tax/Type";
import { taxEdit } from "../../../../redux-logic/tax/Action";
import {
  blobUpload,
  hostName,
} from "../../../../service/constants/defaultValues";
import { getNotification } from "../../../../service/notification";
import {
  getIdFromUploadFile,
  getWindowAfterSSR,
} from "../../../../service/public";
import { Select, Table, Popconfirm } from "antd";
import { initialUserModel } from "../../../../redux-logic/auth/profile/InitialResponse";
import "./style.scss";
const { Option } = Select;

// ======================================================

const initialize: BasicTaxModel = {
  amount: 0,
  creationDate: "",
  relationType: "",
  description: "",
  enabled: false,
  id: "",
  status: 1,
  taxFile: {
    userSignedEngagementId: "",
    userSignedTaxFormId: "",
    engagementBlobId: "",
    extraTaxFile: [],
    taxFormBlobId: "",
  },
  title: "",
  user: {
    ...initialUserModel,
  },
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  taxEdit: Function;
  editValue: BasicTaxModel;
}

class AddComponent extends Component<PropType> {
  requestBody: BasicTaxModel = { ...initialize };
  userName: string = "";
  incomeTaxForm: Array<any> = [];
  engagementLetter: Array<any> = [];
  extraFiles: Array<ExtraTaxFile> = [];
  extraFilesUpload: Array<any> = [];
  extraFileName: string = "";
  mainTableColumnNames = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Delete",
      dataIndex: "",
      key: "x",
      render: (extraFile: ExtraTaxFile) => {
        return (
          <Button
            type="link"
            style={{ padding: "0px" }}
            onClick={() => {
              let index = this.extraFiles.indexOf(extraFile);
              this.extraFiles.splice(index, 1);
              this.forceUpdate();
            }}
          >
            Delete
          </Button>
        );
      },
    },
    {
      title: "Download",
      dataIndex: "",
      key: "x",
      render: (extraFile: ExtraTaxFile) => {
        return (
          <Button
            type="link"
            style={{ padding: "0px" }}
            onClick={() => {
              if (getWindowAfterSSR()) {
                window.open(
                  `${hostName}/api/blob/download/${extraFile.blobId}`
                );
              }
            }}
          >
            Download
          </Button>
        );
      },
    },
  ];
  componentDidUpdate = () => {
    const { visible, editValue } = this.props;
    if (visible) {
      if (editValue.id !== this.requestBody.id) {
        this.requestBody = {
          ...editValue,
        };

        this.forceUpdate();
      }
    }
  };

  removeUserUploadedFiles = (extraFiles: Array<ExtraTaxFile>) => {
    let extraFilesByAdmin: Array<ExtraTaxFile> = [];
    for (let i = 0; i < extraFiles.length; i++) {
      if (extraFiles[i].setByAdmin) {
        extraFilesByAdmin.push(extraFiles[i]);
      }
    }
    return extraFilesByAdmin;
  };

  handleSubmit = () => {
    if (this.requestBody.title === "") {
      getNotification("Please enter title.");
      return;
    }

    if (this.requestBody.description === "") {
      getNotification("Please enter description.");
      return;
    }
    let engagements = getIdFromUploadFile(this.engagementLetter);
    let taxForm = getIdFromUploadFile(this.incomeTaxForm);
    this.requestBody.taxFile = {
      ...this.requestBody.taxFile,
      engagementBlobId:
        engagements !== [] && engagements.length > 0
          ? engagements[0]
          : this.requestBody.taxFile !== undefined &&
            this.requestBody.taxFile !== null
          ? this.requestBody.taxFile.engagementBlobId
          : "",

      taxFormBlobId:
        taxForm !== [] && taxForm.length > 0
          ? taxForm[0]
          : this.requestBody.taxFile !== undefined &&
            this.requestBody.taxFile !== null
          ? this.requestBody.taxFile.taxFormBlobId
          : "",

      extraTaxFile:
        this.extraFiles !== []
          ? [...this.extraFiles]
          : this.requestBody.taxFile !== undefined &&
            this.requestBody.taxFile !== null
          ? this.requestBody.taxFile.extraTaxFile
          : [],
    };
    this.props.taxEdit(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.userName = "";
    this.incomeTaxForm = [];
    this.engagementLetter = [];
    this.extraFiles = [];
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
  startSaving: boolean = false;
  setExtraFiles: boolean = false;
  render() {
    if (!this.props.visible) {
      this.setExtraFiles = false;
      this.startSaving = false;
    }
    if (this.startSaving) {
      let uploadedArray = getIdFromUploadFile(this.extraFilesUpload);
      if (uploadedArray.length > 0) {
        let extraFile: ExtraTaxFile = {
          name: this.extraFilesUpload[0].name,
          blobId: uploadedArray[0],
          setByAdmin: true,
        };
        this.extraFiles.push(extraFile);
        this.extraFilesUpload = [];
        this.extraFileName = "";
        this.startSaving = false;
        this.forceUpdate();
      }
    }
    if (
      !this.setExtraFiles &&
      this.requestBody.taxFile !== undefined &&
      this.requestBody.taxFile !== null &&
      this.requestBody.taxFile.extraTaxFile !== undefined &&
      this.requestBody.taxFile.extraTaxFile !== null &&
      this.requestBody.taxFile.extraTaxFile !== [] &&
      this.requestBody.taxFile.extraTaxFile.length > 0
    ) {
      this.extraFiles = [...this.requestBody.taxFile.extraTaxFile];
      this.setExtraFiles = true;
    }

    return (
      <Modal
        title="Edit tax"
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
        onCancel={this.closeModal}
      >
        <div className="container">
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
                <label>Description</label>
                <input
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
            {/* <div className="col-12 col-sm-6">
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
                  type="number"
                  placeholder="Enter amount"
                />
              </div>
            </div> */}
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
                  <Option value="DocumentSign" key="5">
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
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Income Tax Form</label>
                <div>
                  <Upload
                    name="file"
                    fileList={this.incomeTaxForm}
                    action={`${blobUpload}`}
                    onChange={(info: any) => {
                      this.incomeTaxForm = info.fileList;
                      this.forceUpdate();
                    }}
                  >
                    <Button>
                      <span className="glyph-icon simple-icon-cloud-upload mr-2" />
                      <span>Upload</span>
                    </Button>
                  </Upload>
                  {this.requestBody.taxFile !== undefined &&
                  this.requestBody.taxFile !== null &&
                  this.requestBody.taxFile.taxFormBlobId !== undefined &&
                  this.requestBody.taxFile.taxFormBlobId !== null &&
                  this.requestBody.taxFile.taxFormBlobId !== "" ? (
                    <div>
                      <Button
                        className="mt-1"
                        onClick={() => {
                          if (getWindowAfterSSR()) {
                            window.open(
                              `${hostName}/api/blob/download/${this.requestBody.taxFile.taxFormBlobId}`
                            );
                          }
                        }}
                      >
                        {" "}
                        <span className="glyph-icon simple-icon-cloud-download" />{" "}
                        <span className="ml-2">Download</span>{" "}
                      </Button>
                      <Button
                        className="ml-1"
                        type="danger"
                        onClick={() => {
                          this.requestBody.taxFile.taxFormBlobId = "";
                          this.forceUpdate();
                        }}
                      >
                        {" "}
                        <span className="fa fa-trash-alt" />{" "}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Engagement Letter</label>
                <div>
                  <Upload
                    name="file"
                    fileList={this.engagementLetter}
                    action={`${blobUpload}`}
                    onChange={(info: any) => {
                      this.engagementLetter = info.fileList;
                      this.forceUpdate();
                    }}
                  >
                    <Button>
                      <span className="glyph-icon simple-icon-cloud-upload mr-2" />
                      <span>Upload</span>
                    </Button>
                  </Upload>
                  {this.requestBody.taxFile !== undefined &&
                  this.requestBody.taxFile !== null &&
                  this.requestBody.taxFile.engagementBlobId !== undefined &&
                  this.requestBody.taxFile.engagementBlobId !== null &&
                  this.requestBody.taxFile.engagementBlobId !== "" ? (
                    <div>
                      <Button
                        className="mt-1"
                        onClick={() => {
                          if (getWindowAfterSSR()) {
                            window.open(
                              `${hostName}/api/blob/download/${this.requestBody.taxFile.engagementBlobId}`
                            );
                          }
                        }}
                      >
                        {" "}
                        <span className="glyph-icon simple-icon-cloud-download" />{" "}
                        <span className="ml-2">Download</span>{" "}
                      </Button>
                      <Button
                        className="ml-1"
                        type="danger"
                        onClick={() => {
                          this.requestBody.taxFile.engagementBlobId = "";
                          this.forceUpdate();
                        }}
                      >
                        {" "}
                        <span className="fa fa-trash-alt" />{" "}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
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

          <div>
            <label>Extra Files</label>
            <div className="form-group">
              {/* <input
                          type="text"
                          maxLength={32}
                          className="form-control form-group"
                          value={this.extraFileName}
                          placeholder="Enter Title"
                          onChange={(event: any) => {
                            this.extraFileName = event.target.value;
                            this.forceUpdate();
                          }}
                        /> */}

              <div style={{ display: "flow-root" }}>
                <Upload
                  name="file"
                  action={`${blobUpload}`}
                  fileList={this.extraFilesUpload}
                  className="float-left w-80"
                  onChange={(info: any) => {
                    this.extraFilesUpload = info.fileList;
                    this.forceUpdate();
                  }}
                >
                  <Button
                    type="primary"
                    // disabled={
                    //   this.extraFileName === "" ? true : false
                    // }
                    onClick={() => {
                      this.startSaving = true;
                    }}
                  >
                    {" "}
                    <span className="fa fa-upload" />{" "}
                    <span className="ml-2">Upload & Save</span>{" "}
                  </Button>
                </Upload>
              </div>
            </div>
            <Table
              columns={this.mainTableColumnNames}
              dataSource={this.removeUserUploadedFiles(this.extraFiles)}
              pagination={false}
            />
          </div>

          <div className="col-12 col-sm-6">
            <div className="form-group"></div>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}

const mapDispatchToProps = { taxEdit };
export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
