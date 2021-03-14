import React from "react";
import { Button, Table, Upload } from "antd";
import { blobUpload, hostName } from "../../../service/constants/defaultValues";
import {
  getWindowAfterSSR,
  getIdFromUploadFile,
} from "../../../service/public";

interface UploadPropTypes {
  message: string;
  fileList: Array<any>;
  onSave: any;
  onRemove : any
  onUploadStatusChange : any
}

class UploadFiles extends React.Component<UploadPropTypes> {
  extraFilesUpload: Array<any> = [];
  startSaving: boolean = false;

  addToFileList = () => {
    let uploadedArray = getIdFromUploadFile(this.extraFilesUpload);
    this.props.onSave(this.extraFilesUpload[0].name, uploadedArray[0])
  };

  removeFromFileList = () => {

  }

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
      render: (extraFile: any) => {
        return (
          <Button
            type="link"
            style={{ padding: "0px" }}
            onClick={() => {
                this.props.onRemove(extraFile)
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
      render: (extraFile: any) => {
        return (
          <Button
            type="link"
            style={{ padding: "0px" }}
            onClick={() => {
              if (getWindowAfterSSR()) {
                window.open(`${hostName}/api/blob/download/${extraFile}`);
              }
            }}
          >
            Download
          </Button>
        );
      },
    },
  ];

  render() {
    return (
      <div>
        <div className="form-group">
          <div>{this.props.message}</div>
          <div className="mt-3">
            <div className="form-group">
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
                    disabled={this.startSaving}
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
              dataSource={this.props.fileList}
              pagination={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
