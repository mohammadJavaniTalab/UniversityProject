import React, { Component } from "react";
import { Upload, Button, Table } from "antd";
import { blobUpload, blobDownload } from "../../../../service/constants/defaultValues";
import { getIdFromUploadFile } from "../../../../service/public";
import BlobDownload from "../../../file/BlobDownload";
import { AppState } from "../../../../redux-logic/Store";
import { connect } from "react-redux";
import {
  SelfEmployeeList,
  FileRequestBody,
} from "../../../../redux-logic/files/Type";
import {
  addSelfFiles,
  fetchSelfFiles,
  downloadFile
} from "../../../../redux-logic/files/Action";

interface Props {
  surveyId: string;
  onSaveAnswer: any;
  typeOfUser: string;
  employeeList: SelfEmployeeList;
  addSelfFiles: any;
  fetchSelfFiles: any;
  downloadFile : any
}
interface State {}
class SelfEmployee extends Component<Props, State> {
  uploadedReceipts: Array<any> = [];
  reciepts: Array<any> = [];
  setBlobs: boolean = false;
  isUploading: boolean = false;

  didFetchFiles: boolean = false;
  didUpdateFiles: boolean = false;
  isSelfEmployed: boolean = false;
  didSetValues: boolean = false;
  render() {
    if (!this.didSetValues && this.props.employeeList.success) {
      this.reciepts = this.props.employeeList.data;
      this.didSetValues = true;
      this.forceUpdate();
    }
    return (
      <div>
        <div className="col-12">
          <div>
            {this.isSelfEmployed ? (
              <div className="form-group">
                <div className="form-group col-12">
                  <div className="pt-2" style={{ paddingLeft: "12px" }}>
                    <strong className="numberCircle">Step 1 :</strong>{" "}
                    <span className="mr-3">Download this form</span>
                    <Button type="link" onClick={() => {
                      this.props.downloadFile(`${blobDownload}b838395c-e2b6-4a96-9a99-b09ca4f8766c` , "Self-employed expenses.xlsx")
                    }}>
                      DOWNLOAD
                    </Button>
                    <div className="form-group mt-3">
                      <strong className="numberCircle">Step 2 :</strong>{" "}
                      <span>Fill it out</span>
                    </div>
                    <strong className="numberCircle mt-3">Step 3 :</strong>{" "}
                    <span className="pr-4">Upload completed form.</span>
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
              </div>
            ) : (
              <div className="row">
                <div className="col-12">
                  <span>If you're self employed:</span>{" "}
                  <Button
                    type="primary"
                    className="ml-2"
                    onClick={() => {
                      this.isSelfEmployed = true;
                      this.forceUpdate();
                    }}
                  >
                    Click here
                  </Button>
                  <hr />
                </div>
              </div>
            )}
            <div className="pt-4">
              <div className="col-12">
                <Button
                  type="primary"
                  className="w-100"
                  disabled={this.isUploading}
                  onClick={() => {
                    if (this.isSelfEmployed) {
                      let blobIds: Array<string> = [];
                      for (let i = 0; i < this.reciepts.length; i++) {
                        blobIds.push(this.reciepts[i].id);
                      }
                      let requestBody: FileRequestBody = {
                        blobIds: blobIds,
                        surveyId: this.props.surveyId,
                      };
                      this.props.addSelfFiles(requestBody);
                    }
                    this.props.onSaveAnswer();
                  }}
                >
                  Next Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    employeeList: state.fetchSelfFiles,
  };
}

export default connect(mapStateToProps, { addSelfFiles, fetchSelfFiles , downloadFile })(
  SelfEmployee
);
