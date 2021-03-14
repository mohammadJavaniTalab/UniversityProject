import React, { Component } from "react";
import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import { blobUpload } from "../../service/constants/defaultValues";
import { UploadFile } from "antd/lib/upload/interface";

interface PropsType {
  fileList: Array<UploadFile>;
  onChange: Function;
  Limited: number;
}

export default class BlobUpload extends Component<PropsType> {
  render() {
    const { fileList, onChange, Limited } = this.props;
    return (
      <Upload
        name="file"
        fileList={fileList}
        action={`${blobUpload}`}
        onChange={(info: any) => {
          onChange(info.fileList);
        }}
      >
        {fileList.length <= Limited ? (
          <Button>
            <span className="glyph-icon simple-icon-cloud-upload mr-2" /> 
            <span>Click to Upload</span>
          </Button>
        ) : null}
      </Upload>
    );
  }
}
