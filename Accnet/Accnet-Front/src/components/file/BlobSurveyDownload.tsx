import React, { Component } from "react";
import { getWindowAfterSSR, checkFieldIsOk } from "../../service/public";
import { surveyBlobDownload } from "../../service/constants/defaultValues";
import { AppState } from "../../redux-logic/Store";
import { connect } from "react-redux";
import { getSurveyDetails } from "../../redux-logic/tax/Action";
import { Button } from "antd";
import { getNotification } from "../../service/notification";

interface PropsType {
  userId: string;
  surveyId: string;
  mainUserName: string;
  getSurveyDetails: any;
}
class BlobSurveyDownload extends Component<PropsType> {
  render() {
    const { userId, surveyId } = this.props;
    return checkFieldIsOk(userId) ? (
      <Button
        type="link"
        style={{ padding: "0px" }}
        onClick={(event: any) => {
          event.preventDefault();
          getNotification("your download has been started. please wait...")
          this.props.getSurveyDetails(
            surveyId,
            userId,
            this.props.mainUserName
          );
          return
        }}
        className="text-style cursor-pointer"
      >
        <span className="fa fa-download"></span>
        <span> Download </span>
      </Button>
    ) : (
      <span />
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

export default connect(mapStateToProps, { getSurveyDetails })(
  BlobSurveyDownload
);
