// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";

// ======================================= component
import LayoutClient from "../../../components/client/layout/LayoutClient";

// ======================================= redux
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { SurveyResponse, SurveyModel } from "../../../redux-logic/survey/Type";
import { surveyList } from "../../../redux-logic/survey/Action";
import { AppState } from "../../../redux-logic/Store";

// ======================================= services
import AllImages from "../../../assets/images/images";
import {
  pathProject,
  dashboard_Type
} from "../../../service/constants/defaultValues";

// =====================================================

interface PropsType {
  surveyResponse: SurveyResponse;
  surveyList: Function;
}
class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };

  componentDidMount = () => {
    this.props.surveyList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { surveyResponse } = this.props;
    if (surveyResponse.updateList) {
      this.props.surveyList(this.requestBody);
    }
  };

  renderResult = () => {
    const { surveyResponse } = this.props;
    return (
      <tbody>
        {surveyResponse.items.map((survey: SurveyModel, index: number) => (
          <tr key={`${JSON.stringify(survey)}${index}`}>
            <td>{survey.name}</td>
            <td>{survey.description}</td>
            <td>
              {survey.enabled ? (
                <span className="glyph-icon simple-icon-check h4 text-success" />
              ) : (
                <span className="glyph-icon simple-icon-close h4 text-danger" />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  render() {
    const { surveyResponse } = this.props;
    return ( 
      <LayoutClient
        path={pathProject.client.survey_history}
        name={dashboard_Type.survey_history}
        selectBar={false}
      >
        <article className="container">
          <div className="row">
            <div className="col-sm-12 col-md-3 text-left">
              <h3 className="my-3 grid-title">Survey History</h3>
            </div>
            <div className="col-sm-12 col-md-6 align-right f-right mb-3"></div>
            <div className="col-sm-12 col-md-3 text-md-right"></div>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">NAME</th>
                    <th scope="col">DESCRIPTION</th>
                    <th scope="col">STATUS</th>
                  </tr>
                </thead>
                {this.renderResult()}
              </table>

              {surveyResponse.loading ? (
                <div className="text-center py-3">
                  <Empty
                    description={<span>Please wait ...</span>}
                    image={AllImages.loading}
                  />
                </div>
              ) : surveyResponse.items.length === 0 ? (
                <div className="text-center py-3">
                  <Empty
                    description={<span>No survey Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </LayoutClient>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    surveyResponse: state.surveyReducer
  };
}

const mapDispatchToProps = { surveyList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
