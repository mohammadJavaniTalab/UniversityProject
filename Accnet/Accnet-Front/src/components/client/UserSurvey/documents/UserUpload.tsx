import React, { Component } from "react";
import { Button, Upload, Table, Empty } from "antd";
import { blobUpload } from "../../../../service/constants/defaultValues";
import { AppState } from "../../../../redux-logic/Store";
import { connect } from "react-redux";
import { getIdFromUploadFile } from "../../../../service/public";
import {
  FileListResponse,
  AllFilesResponse,
  FileRequestBody,
} from "../../../../redux-logic/files/Type";
import {
  fetchAllFiles,
  addAssessments,
  addExtraFiles,
  addReciepts,
} from "../../../../redux-logic/files/Action";
import { ApplicationDataResponse } from "../../../../redux-logic/essentials-tools/type/Response-type";
import AllImages from "../../../../assets/images/images";
import BlobDownload from "../../../file/BlobDownload";

interface UserUploadsPropTypes {
  surveyId: string;
  onSaveAnswer: any;
  typeOfUser: string;
  userId: string;
  allFilesResponse: FileListResponse;
  providedResponses : AllFilesResponse
  addResponses: ApplicationDataResponse;
  fetchAllFiles: any;
  addAssessments: any;
  addExtraFiles: any;
  addReciepts: any;
}

class UserUpload extends Component<UserUploadsPropTypes> {
  uploadedReceipts: Array<any> = [];
  reciepts: Array<any> = [];
  uploadedAssessments: Array<any> = [];
  assessments: Array<any> = [];
  uploadedExtras: Array<any> = [];
  extras: Array<any> = [];
  needsListFetch: boolean = false;
  setBlobs: boolean = false;

  isUploading: boolean = false;

  didInitializeSystem: boolean = false;

  initializeSystem = () => {
    if (this.props.typeOfUser !== "main") {
      if (this.props.userId !== undefined && this.props.userId !== "" ) {
        this.props.fetchAllFiles(this.props.surveyId, this.props.userId);
      }else if (this.props.providedResponses !== undefined && this.props.providedResponses !== null) {
        this.extras = this.props.providedResponses.extraFile
        this.assessments = this.props.providedResponses.assessments
        this.reciepts = this.props.providedResponses.reciepts
      }
    } else {
      this.props.fetchAllFiles(this.props.surveyId);
    }
    this.didInitializeSystem = true;
  };


  resetData = () => {
    this.didInitializeSystem = false
    this.extras = []
    this.reciepts = []
    this.assessments = []
  }

  showLoading: boolean = false;
  didSaveReciepts: boolean = false;
  didSaveAssessments: boolean = false;
  didSaveExtraFiles: boolean = false;

  finalizeSave = () => {
    if (this.showLoading) {
      if (
        this.didSaveAssessments &&
        this.didSaveExtraFiles &&
        this.didSaveReciepts
      ) {
        this.showLoading = false;
        let allFilesResponse: AllFilesResponse = {
          reciepts: this.reciepts,
          assessments: this.assessments,
          extraFile: this.extras,
        };

        this.props.onSaveAnswer(allFilesResponse);
        this.resetData()
        return;
      }
    }

    if (this.props.typeOfUser === "main") {
      this.showLoading = true;
      this.forceUpdate();
      if (!this.didSaveReciepts) {
        let ids: Array<string> = [];
        for (let i = 0; i < this.reciepts.length; i++) {
          ids.push(this.reciepts[i].id);
        }
        let requestBody: FileRequestBody = {
          surveyId: this.props.surveyId,
          blobIds: ids,
        };
        this.didSaveReciepts = true;
        this.props.addReciepts(requestBody);
      }

      if (!this.didSaveAssessments) {
        let ids: Array<string> = [];
        for (let i = 0; i < this.assessments.length; i++) {
          ids.push(this.assessments[i].id);
        }
        let requestBody: FileRequestBody = {
          surveyId: this.props.surveyId,
          blobIds: ids,
        };
        this.didSaveAssessments = true;
        this.props.addAssessments(requestBody);
      }

      if (!this.didSaveExtraFiles) {
        let ids: Array<string> = [];
        for (let i = 0; i < this.extras.length; i++) {
          ids.push(this.extras[i].id);
        }
        let requestBody: FileRequestBody = {
          surveyId: this.props.surveyId,
          blobIds: ids,
        };
        this.didSaveExtraFiles = true;
        this.props.addExtraFiles(requestBody);
      }
    } else {
      let allFilesResponse: AllFilesResponse = {
        reciepts: this.reciepts,
        assessments: this.assessments,
        extraFile: this.extras,
      };
      this.resetData()
      this.props.onSaveAnswer(allFilesResponse);
    }
  };

  didSetValues: boolean = false;
  render() {
    if (!this.didInitializeSystem) {
      this.initializeSystem();
    }
    if (this.showLoading) {
      this.finalizeSave();
    }

    if (!this.didSetValues && (this.props.userId !== "" || this.props.typeOfUser === "main") && this.props.allFilesResponse.success) {
      this.reciepts = this.props.allFilesResponse.data.reciepts;
      this.extras = this.props.allFilesResponse.data.extraFile;
      this.assessments = this.props.allFilesResponse.data.assessments;
      this.didSetValues = true;
      this.forceUpdate();
    }

    return (
      <div>
        <div className="col-12">
          <div>
            {this.showLoading ? (
              <div className="text-center">
                <Empty
                  description={<span>Please wait ...</span>}
                  image={AllImages.loading}
                />
              </div>
            ) : (
              <div className="form-group">
                <div className="form-group col-12">
                  <strong
                    className="numberCircle pb-2"
                    style={{ paddingLeft: "12px" }}
                  >
                    Step 1 :
                  </strong>{" "}
                  <div className="pt-2" style={{ paddingLeft: "12px" }}>
                    <span className="pr-4">{`Please upload ${
                      this.props.typeOfUser === "main"
                        ? "your"
                        : this.props.typeOfUser === "spouse"
                        ? "spousal"
                        : "dependent"
                    } 2019 T4.`}</span>
                    <Upload
                      name="file"
                      action={`${blobUpload}`}
                      fileList={this.uploadedReceipts}
                      className="form-group w-80"
                      onChange={(info: any) => {
                        this.uploadedReceipts = info.fileList;
                        let shouldWait: boolean = false;
                        for (let i = 0; i < info.fileList.length; i++) {
                          if (info.fileList[i].status === "uploading") {
                            shouldWait = true;
                          } else if (
                            info.fileList[i].status === "done" &&
                            this.setBlobs
                          ) {
                            let object = {
                              name: info.fileList[i].name,
                              id: getIdFromUploadFile(this.uploadedReceipts)[0],
                            };
                            this.reciepts.push(object);
                            this.uploadedReceipts = [];
                            this.setBlobs = false;
                          }
                        }
                        this.isUploading = shouldWait;
                        this.forceUpdate();
                      }}
                    >
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          this.setBlobs = true;
                          this.forceUpdate();
                        }}
                      >
                        {" "}
                        <span className="fa fa-upload" />{" "}
                        <span className="ml-2">Upload</span>{" "}
                      </Button>
                    </Upload>
                  </div>
                  <div>
                    {this.reciepts !== undefined &&
                    this.reciepts !== null &&
                    this.reciepts !== [] &&
                    this.reciepts.length > 0 ? (
                      <Table
                        className="pt-3"
                        pagination={false}
                        columns={[
                          {
                            title: "Name",
                            dataIndex: "name",
                            key: "name",
                          },
                          {
                            title: "Download",
                            render: (reciept: any) => {
                              return <BlobDownload blobId={reciept.id} />;
                            },
                          },
                          {
                            title: "Delete",
                            render: (reciept: any) => {
                              return (
                                <Button
                                  type="link"
                                  className="p-0"
                                  onClick={() => {
                                    for (
                                      let i = 0;
                                      i < this.reciepts.length;
                                      i++
                                    ) {
                                      if (this.reciepts[i].id === reciept.id) {
                                        this.reciepts.splice(i, 1);
                                        this.forceUpdate();
                                      }
                                    }
                                  }}
                                >
                                  Delete
                                </Button>
                              );
                            },
                          },
                        ]}
                        dataSource={this.reciepts}
                      />
                    ) : (
                      <hr className="mr-3 ml-3" />
                    )}
                  </div>
                </div>

                <div className="form-group col-12 pt-3 pb-3">
                  <strong
                    className="numberCircle pb-2"
                    style={{ paddingLeft: "12px" }}
                  >
                    Step 2 :
                  </strong>{" "}
                  <div className="pt-2" style={{ paddingLeft: "12px" }}>
                    <span className="pr-4">2018 Notice of Asseessment.</span>
                    <Upload
                      name="file"
                      action={`${blobUpload}`}
                      fileList={this.uploadedAssessments}
                      className="form-group w-80"
                      onChange={(info: any) => {
                        this.uploadedAssessments = info.fileList;
                        let shouldWait: boolean = false;
                        for (let i = 0; i < info.fileList.length; i++) {
                          if (info.fileList[i].status === "uploading") {
                            shouldWait = true;
                          } else if (
                            info.fileList[i].status === "done" &&
                            this.setBlobs
                          ) {
                            let object = {
                              name: info.fileList[i].name,
                              id: getIdFromUploadFile(
                                this.uploadedAssessments
                              )[0],
                            };
                            this.assessments.push(object);
                            this.uploadedAssessments = [];
                            this.setBlobs = false;
                          }
                        }
                        this.isUploading = shouldWait;
                        this.forceUpdate();
                      }}
                    >
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          this.setBlobs = true;
                          this.forceUpdate();
                        }}
                      >
                        {" "}
                        <span className="fa fa-upload" />{" "}
                        <span className="ml-2">Upload</span>{" "}
                      </Button>
                    </Upload>
                  </div>
                  <div>
                    {this.assessments !== undefined &&
                    this.assessments !== null &&
                    this.assessments !== [] &&
                    this.assessments.length > 0 ? (
                      <Table
                        className="pt-3"
                        pagination={false}
                        columns={[
                          {
                            title: "Name",
                            dataIndex: "name",
                            key: "name",
                          },
                          {
                            title: "Download",
                            render: (reciept: any) => {
                              return <BlobDownload blobId={reciept.id} />;
                            },
                          },
                          {
                            title: "Delete",
                            render: (reciept: any) => {
                              return (
                                <Button
                                  type="link"
                                  className="p-0"
                                  onClick={() => {
                                    for (
                                      let i = 0;
                                      i < this.assessments.length;
                                      i++
                                    ) {
                                      if (
                                        this.assessments[i].id === reciept.id
                                      ) {
                                        this.assessments.splice(i, 1);
                                        this.forceUpdate();
                                      }
                                    }
                                  }}
                                >
                                  Delete
                                </Button>
                              );
                            },
                          },
                        ]}
                        dataSource={this.assessments}
                      />
                    ) : (
                      <hr className="mr-3 ml-3" />
                    )}
                  </div>
                </div>

                <div className="form-group col-12">
                  <strong
                    className="numberCircle pb-2"
                    style={{ paddingLeft: "12px" }}
                  >
                    Step 3 :
                  </strong>{" "}
                  <div className="pt-2" style={{ paddingLeft: "12px" }}>
                    <span className="pr-4">Any other extra tax documents.</span>

                    <Upload
                      name="file"
                      action={`${blobUpload}`}
                      fileList={this.uploadedExtras}
                      className="form-group w-80"
                      onChange={(info: any) => {
                        this.uploadedExtras = info.fileList;
                        let shouldWait: boolean = false;
                        for (let i = 0; i < info.fileList.length; i++) {
                          if (info.fileList[i].status === "uploading") {
                            shouldWait = true;
                          } else if (
                            info.fileList[i].status === "done" &&
                            this.setBlobs
                          ) {
                            let object = {
                              name: info.fileList[i].name,
                              id: getIdFromUploadFile(this.uploadedExtras)[0],
                            };
                            this.extras.push(object);
                            this.uploadedExtras = [];
                            this.setBlobs = false;
                          }
                        }
                        this.isUploading = shouldWait;
                        this.forceUpdate();
                      }}
                    >
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          this.setBlobs = true;
                          this.forceUpdate();
                        }}
                      >
                        {" "}
                        <span className="fa fa-upload" />{" "}
                        <span className="ml-2">Upload</span>{" "}
                      </Button>
                    </Upload>
                  </div>
                  <div>
                    {this.extras !== undefined &&
                    this.extras !== null &&
                    this.extras !== [] &&
                    this.extras.length > 0 ? (
                      <Table
                        className="pt-3"
                        pagination={false}
                        columns={[
                          {
                            title: "Name",
                            dataIndex: "name",
                            key: "name",
                          },
                          {
                            title: "Download",
                            render: (reciept: any) => {
                              return <BlobDownload blobId={reciept.id} />;
                            },
                          },
                          {
                            title: "Delete",
                            render: (reciept: any) => {
                              return (
                                <Button
                                  type="link"
                                  className="p-0"
                                  onClick={() => {
                                    for (
                                      let i = 0;
                                      i < this.extras.length;
                                      i++
                                    ) {
                                      if (this.extras[i].id === reciept.id) {
                                        this.extras.splice(i, 1);
                                        this.forceUpdate();
                                      }
                                    }
                                  }}
                                >
                                  Delete
                                </Button>
                              );
                            },
                          },
                        ]}
                        dataSource={this.extras}
                      />
                    ) : (
                      <hr className="mr-3 ml-3" />
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="col-12">
                    <Button
                      type="primary"
                      className="w-100"
                      disabled={this.isUploading}
                      onClick={() => {
                        this.finalizeSave();
                      }}
                    >
                      Next Question
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    allFilesResponse: state.fetchAllFiles,
    addResponses: state.addAllFiles,
  };
}

const mapDispatchToProps = {
  fetchAllFiles,
  addAssessments,
  addExtraFiles,
  addReciepts,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserUpload);
