import React, { Component } from "react";
import { Button, Upload, Table } from "antd";
import { blobUpload } from "../../../../service/constants/defaultValues";

import { AppState } from "../../../../redux-logic/Store";
import { connect } from "react-redux";
import { getIdFromUploadFile } from "../../../../service/public";
import { MedicalList, FileRequestBody } from "../../../../redux-logic/files/Type";
import {
  addMedicalFiles,
  fetchMedicalFiles,
} from "../../../../redux-logic/files/Action";
import BlobDownload from "../../../file/BlobDownload";

interface MedicalUploadPropTypes {
  surveyId: string;
  onSaveAnswer: any;
  typeOfUser: string;
  medicalListResponse: MedicalList;
  addMedicalFiles: any;
  fetchMedicalFiles: any;
}

class MedicalUpload extends Component<MedicalUploadPropTypes> {
  uploadedReceipts: Array<any> = [];
  reciepts: Array<any> = [];
  setBlobs: boolean = false;
  isUploading: boolean = false;

  didFetchFiles: boolean = false;
  didUpdateFiles: boolean = false;
  render() {
    if (!this.didFetchFiles) {
      this.props.fetchMedicalFiles(this.props.surveyId);
      this.didFetchFiles = true;
    } else if (!this.didUpdateFiles && this.props.medicalListResponse.success) {
      this.reciepts = this.props.medicalListResponse.data;
      this.didUpdateFiles = true;
    }
    return (
      <div>
        <div className="col-12">
          <div>
            <div className="form-group">
              <div className="form-group col-12">
                <div className="pt-2" style={{ paddingLeft: "12px" }}>
                  <span className="pr-4">
                    Upload all medical expense receipts, if applicable.
                  </span>
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
                            id: getIdFromUploadFile(
                              this.uploadedReceipts
                            )[0],
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
                            return (
                              <BlobDownload blobId={reciept.id}/>
                            );
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

              <div className="pt-4">
                <div className="col-12">
                  <Button
                    type="primary"
                    className="w-100"
                    disabled={this.isUploading}
                    onClick={() => {
                      let blobIds : Array<string> = []
                      for (let i = 0; i < this.reciepts.length; i++){
                        blobIds.push(this.reciepts[i].id)
                      }
                      let requestBody : FileRequestBody = {
                        blobIds : blobIds,
                        surveyId : this.props.surveyId
                      }
                      this.props.addMedicalFiles(requestBody)
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
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    medicalListResponse: state.fetchMedicalFiles,
  };
}

const mapDispatchToProps = {
  addMedicalFiles,
  fetchMedicalFiles,
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalUpload);
