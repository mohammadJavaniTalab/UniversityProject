import React, { Component } from "react";
import { getWindowAfterSSR, checkFieldIsOk } from "../../service/public";
import { blobDownload } from "../../service/constants/defaultValues";

interface PropsType {
  blobId: string;
}
export default class BlobDownload extends Component<PropsType> {
  render() {
    const { blobId } = this.props;
    return checkFieldIsOk(blobId) ? (
      <i
        onClick={() => {
          if (getWindowAfterSSR()) {
            window.open(`${blobDownload}${blobId}`);
          }
        }}
        className="text-style cursor-pointer"
      >
        <span className="fa fa-download"></span>
        <span> Download </span>
      </i>
    ) : (
      <span />
    );
  }
}
