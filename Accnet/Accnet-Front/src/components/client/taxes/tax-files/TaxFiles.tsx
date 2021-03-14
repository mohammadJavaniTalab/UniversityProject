import React, { Component } from "react";
import { AppState } from "../../../../redux-logic/Store";
import { connect } from "react-redux";
import { Modal, Button, Upload, Switch, Table, Empty } from "antd";
import { taxEdit } from "../../../../redux-logic/tax/Action";
import { BasicTaxModel, ExtraTaxFile } from "../../../../redux-logic/tax/Type";
import { initialUserModel } from "../../../../redux-logic/auth/profile/InitialResponse";
import { getNotification } from "../../../../service/notification";
import {
  getIdFromUploadFile,
  getWindowAfterSSR,
} from "../../../../service/public";
import {
  hostName,
  blobUpload,
} from "../../../../service/constants/defaultValues";
import "./style.scss";
import AllImages from "../../../../assets/images/images";

interface TaxFilesPropTypes {
  showModal: boolean;
  onSaveFiles: any;
  taxEdit: any;
  editValue: BasicTaxModel;
  onCancel: any;
}

const emptyBasicTaxModel: BasicTaxModel = {
  amount: 0,
  creationDate: "",
  description: "",
  enabled: false,
  id: "",
  relationType: "",
  status: 1,
  taxFile: {
    userSignedEngagementId: "",
    userSignedTaxFormId: "",
    engagementBlobId: "",
    taxFormBlobId: "",
    extraTaxFile: [],
  },
  title: "",
  user: {
    ...initialUserModel,
  },
};

class TaxFiles extends Component<TaxFilesPropTypes> {
  step: number = -1;

  incomeTaxForm: Array<any> = [];
  engagementLetter: Array<any> = [];
  extraFiles: Array<ExtraTaxFile> = [];
  extraFilesUpload: Array<any> = [];
  extraFileName: string = "";

  updateStep = (goingNext: boolean) => {
    switch (this.step) {
      case 0:
        if (goingNext) {
          this.step++;
        }
        break;
      case 1:
        if (goingNext) {
          this.step++;
        } else {
          this.step--;
        }
        break;
      case 2:
        if (!goingNext) {
          this.step--;
        } else {
          this.step++;
        }
        break;
      case 3:
        if (!goingNext) {
          this.step--;
        }
        break;
    }
    this.forceUpdate();
  };

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
          <div>
            {!extraFile.setByAdmin ? (
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
            ) : null}
          </div>
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

  requestBody: BasicTaxModel = {
    ...emptyBasicTaxModel,
  };

  didSetTempValue: boolean = false;
  showLoading: boolean = false;
  handleSubmit = () => {
    this.showLoading = true;
    this.forceUpdate();
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
          : this.requestBody.taxFile.engagementBlobId,
      userSignedEngagementId:
        engagements !== [] && engagements.length > 0
          ? engagements[0]
          : this.requestBody.taxFile.engagementBlobId,

      taxFormBlobId:
        taxForm !== [] && taxForm.length > 0
          ? taxForm[0]
          : this.requestBody.taxFile.taxFormBlobId,

      userSignedTaxFormId:
        taxForm !== [] && taxForm.length > 0
          ? taxForm[0]
          : this.requestBody.taxFile.taxFormBlobId,
      extraTaxFile:
        this.extraFiles !== []
          ? [...this.extraFiles]
          : this.requestBody.taxFile.extraTaxFile,
    };

    this.requestBody = {
      ...this.requestBody,
      status : 6
    }

    this.props.taxEdit(this.requestBody);
    this.props.onSaveFiles();
  };

  setExtraFiles: boolean = false;
  startSaving: boolean = false;

  removeUserUploadedFiles = (extraFiles: Array<ExtraTaxFile>) => {
    let extraFilesByAdmin: Array<ExtraTaxFile> = [];
    for (let i = 0; i < extraFiles.length; i++) {
      if (extraFiles[i].setByAdmin) {
        extraFilesByAdmin.push(extraFiles[i]);
      }
    }
    return extraFilesByAdmin;
  };

  removeAdminUploadedFiles = (extraFiles: Array<ExtraTaxFile>) => {
    let extraFilesByAdmin: Array<ExtraTaxFile> = [];
    for (let i = 0; i < extraFiles.length; i++) {
      if (!extraFiles[i].setByAdmin) {
        extraFilesByAdmin.push(extraFiles[i]);
      }
    }
    return extraFilesByAdmin;
  };

  checkTaxFormBlobId = () => {
    if (
      this.requestBody.taxFile !== undefined &&
      this.requestBody.taxFile !== null &&
      this.requestBody.taxFile.taxFormBlobId !== undefined &&
      this.requestBody.taxFile.taxFormBlobId !== null &&
      this.requestBody.taxFile.taxFormBlobId !== ""
    ) {
      return true;
    }
    return false;
  };

  checkEngagementBlobId = () => {
    if (
      this.requestBody.taxFile !== undefined &&
      this.requestBody.taxFile !== null &&
      this.requestBody.taxFile.engagementBlobId !== undefined &&
      this.requestBody.taxFile.engagementBlobId !== null &&
      this.requestBody.taxFile.engagementBlobId !== ""
    ) {
      return true;
    }
    return false;
  };

  checkExtraTaxFiles = () => {
    if (
      this.requestBody.taxFile !== undefined &&
      this.requestBody.taxFile !== null &&
      this.requestBody.taxFile.extraTaxFile !== undefined &&
      this.requestBody.taxFile.extraTaxFile !== null &&
      this.requestBody.taxFile.extraTaxFile !== [] &&
      this.requestBody.taxFile.extraTaxFile.length > 0
    ) {
      return true;
    }

    return false;
  };

  isUploading : boolean = false


  render() {
    if (!this.props.showModal) {
      this.requestBody = {
        ...emptyBasicTaxModel,
      };
      this.extraFilesUpload = [];
      this.extraFiles = [];
      this.extraFileName = "";
      this.setExtraFiles = false
      this.step = -1;
      this.didSetTempValue = false;
      this.showLoading = false;
      this.startSaving = false;
    }
    if (this.startSaving) {
      let uploadedArray = getIdFromUploadFile(this.extraFilesUpload);
      if (uploadedArray.length > 0) {
        let extraFile: ExtraTaxFile = {
          name: this.extraFilesUpload[0].name,
          blobId: uploadedArray[0],
          setByAdmin: false,
        };
        this.extraFiles.push(extraFile);
        this.extraFilesUpload = [];
        this.extraFileName = "";
        this.startSaving = false;
        this.forceUpdate();
      }
    }

    if (
      !this.didSetTempValue &&
      this.props.editValue !== undefined &&
      this.props.editValue !== null &&
      this.props.editValue.id !== undefined &&
      this.props.editValue.id !== null &&
      this.props.editValue.id !== ""
    ) {
      this.requestBody = {
        ...this.props.editValue,
      };
      this.didSetTempValue = true;
    }

    if (
      !this.setExtraFiles &&
      this.requestBody.taxFile !== undefined &&
      this.requestBody.taxFile !== null &&
      this.requestBody.taxFile.extraTaxFile !== undefined &&
      this.requestBody.taxFile.extraTaxFile !== null &&
      this.requestBody.id !== undefined &&
      this.requestBody.id !== null &&
      this.requestBody.id !== ""
    ) {
      this.extraFiles = [...this.requestBody.taxFile.extraTaxFile];
      this.setExtraFiles = true;
    }

    if (this.step === -1 && this.checkEngagementBlobId()) {
      this.step = 0;
      this.forceUpdate();
    }

    if (this.step === -1 && this.checkTaxFormBlobId()) {
      this.step = 1;
      this.forceUpdate();
    }

    if (this.step === -1 && this.checkExtraTaxFiles()) {
      this.step = 2;
      this.forceUpdate();
    }

    return (
      <Modal
        visible={this.props.showModal}
        maskClosable={false}
        onCancel={() => {
          this.props.onCancel();
        }}
        footer={
          this.step === -1 || this.showLoading
            ? null
            : [
                this.step === 0 ? (
                  <div style={{ display: "flow-root" }}>
                    <Button
                      type="primary"
                      className="float-right"
                      disabled={this.isUploading}
                      onClick={() => {
                        this.updateStep(true);
                      }}
                    >
                      I want AccNet to e-file my taxes
                    </Button>
                    <Button
                      className="float-left"
                      disabled={this.isUploading}
                      onClick={() => {
                        this.requestBody = {
                          ...this.requestBody,
                          status: 7,
                        };
                        this.props.taxEdit(this.requestBody);
                        this.props.onSaveFiles();
                      }}
                    >
                      I do the e-filing on my own
                    </Button>
                  </div>
                ) : this.step === 1 || this.step === 2 ? (
                  <div style={{ display: "flow-root" }}>
                    <Button
                      type="primary"
                      className="float-right"
                      disabled={this.isUploading}
                      onClick={() => {
                        this.updateStep(true);
                      }}
                    >
                      Next
                    </Button>
                    <Button
                      className="float-left"
                      disabled={this.isUploading}
                      onClick={() => {
                        this.updateStep(false);
                      }}
                    >
                      Previous
                    </Button>
                  </div>
                ) : this.step === 3 ? (
                  <div style={{ display: "flow-root" }}>
                    <Button
                      type="primary"
                      disabled={this.isUploading}
                      className="float-right"
                      onClick={() => {
                        this.handleSubmit();
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      className="float-left"
                      disabled={this.isUploading}
                      onClick={() => {
                        this.updateStep(false);
                      }}
                    >
                      Previous
                    </Button>
                  </div>
                ) : null,
              ]
        }
        title="Tax Documents"
      >
        {this.showLoading ? (
          <div className="text-center py-3">
            <Empty
              description={<span>Please wait ...</span>}
              image={AllImages.loading}
            />
          </div>
        ) : (
          <div>
            {this.step === 1 ? (
              <div className="col-12">
                <div>
                  <div className="form-group">
                    <div className="form-group">
                      <strong className="numberCircle">Step 1 :</strong>{" "}
                      <div>Sign and Date page 2 of Engagement Letter.</div>
                      <hr />
                    </div>
                    <div className="form-group">
                      <strong className="numberCircle">Step 2 :</strong>{" "}
                      <div>Sign only section G of Income Tax Form.</div>
                      <hr />
                    </div>
                    <div className="form-group">
                      <strong className="numberCircle">Step 3 :</strong>{" "}
                      <div>
                        Take a picture or scan the files from step 1 & 2.
                      </div>
                      <hr />
                    </div>
                    <strong className="numberCircle">Step 4 :</strong>{" "}
                    <div>Upload your signed documents.</div>
                    <div className="mt-3">
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
                              let shouldWait : boolean = false
                              for (let i = 0; i < info.fileList.length; i++){
                                if (info.fileList[i].status === "uploading"){
                                  shouldWait = true
                                }
                              }
                              this.isUploading = shouldWait
                              this.forceUpdate();
                            }}
                          >
                            <Button
                              type="primary"
                              disabled={this.isUploading}
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
                        dataSource={this.removeAdminUploadedFiles(
                          this.extraFiles
                        )}
                        pagination={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* <div className="row"> */}
            {this.step === 0 ? (
              <div className="col-12">
                <div className="form-group">
                  {this.requestBody.taxFile !== undefined &&
                  this.requestBody.taxFile !== null &&
                  this.requestBody.taxFile.engagementBlobId !== undefined &&
                  this.requestBody.taxFile.engagementBlobId !== null &&
                  this.requestBody.taxFile.engagementBlobId !== "" ? (
                    <div>
                      <div className="form-group">
                        <strong className="numberCircle">Step 1 :</strong>
                        <div>
                          <label>Download Engagement Letter</label>

                          <Button
                            className="ml-3"
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
                        </div>
                        <hr />
                      </div>

                      <div className="form-group">
                        <strong className="numberCircle">Step 2 :</strong>
                        <div>
                          <label>Download Income Tax Form</label>

                          <Button
                            className="ml-3"
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
                        </div>
                        <hr />
                      </div>

                      <div className="form-group">
                        <strong className="numberCircle">Step 3 :</strong>{" "}
                        <div className="mb-2">
                          Download other required files
                        </div>
                        <Table
                          columns={this.mainTableColumnNames}
                          dataSource={this.removeUserUploadedFiles(
                            this.extraFiles
                          )}
                          pagination={false}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {this.step === 2 ? (
              <div className="col-12">
                <div className="form-group">
                  {this.requestBody.taxFile !== undefined &&
                  this.requestBody.taxFile !== null &&
                  this.requestBody.taxFile.engagementBlobId !== undefined &&
                  this.requestBody.taxFile.engagementBlobId !== null &&
                  this.requestBody.taxFile.engagementBlobId !== "" ? (
                    <div>
                      <div className="form-group">
                        <strong className="numberCircle">Step 1 :</strong>{" "}
                        <div>
                          Upload valid government issued photo I.D. ( we use
                          this to verify your signature )
                        </div>
                        <div className="mt-3">
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
                                  let shouldWait : boolean = false
                                  for (let i = 0; i < info.fileList.length; i++){
                                    if (info.fileList[i].status === "uploading"){
                                      shouldWait = true
                                    }
                                  }
                                  this.isUploading = shouldWait
                                  this.forceUpdate();
                                }}
                              >
                                <Button
                                  type="primary"
                                  disabled={this.isUploading}
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
                            dataSource={this.removeAdminUploadedFiles(
                              this.extraFiles
                            )}
                            pagination={false}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {this.step === 3 ? (
              <div className="col-12">
                <div>
                  By clicking on Submit you are agreeing to these conditions:
                  <div>
                    I hereby verify that all uploaded information provided is
                    accurate. I have read and understood how AccNet Online Inc.
                    will use my personal information. Prior to registering, I
                    was made aware of all AccNet privacy policies. Similarly, I
                    was made aware of all AccNet terms and conditions. By
                    clicking submit, I understand AccNet will be submitting all
                    of my tax-related documents to the Canada Revenue Agency. If
                    I have a spouse or dependent, I take responsibility for
                    sharing their information with AccNet. I understand that all
                    of this information will be used by AccNet Online Inc. to
                    e-file the income taxes. I agree to these conditions.
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

export default connect(mapStateToProps, { taxEdit })(TaxFiles);
