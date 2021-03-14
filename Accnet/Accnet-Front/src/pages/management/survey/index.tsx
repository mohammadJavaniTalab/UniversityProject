// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";

// ======================================= component
import AddEditSurvey from "../../../components/management/survey/AddComponent";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= redux
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { SurveyResponse, SurveyModel } from "../../../redux-logic/survey/Type";
import { surveyList } from "../../../redux-logic/survey/Action";
import { AppState } from "../../../redux-logic/Store";

// ======================================= services
import AllImages from "../../../assets/images/images";
import { pathProject } from "../../../service/constants/defaultValues";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";

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
  enterSurvey: CrudObject = {
    visible: false,
    edit: false,
    update: false,
    value: {},
    valueIndex: 0
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

  enterSurveyOnChange = (
    filed: "visible" | "edit" | "update",
    value: boolean
  ) => {
    this.enterSurvey[filed] = value;
    this.forceUpdate();
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
            <td>
              <button
                className="btn-icon glyph-icon simple-icon-note"
                onClick={() => {
                  this.enterSurvey.edit = true;
                  this.enterSurvey.update = true;
                  this.enterSurvey.valueIndex = index;
                  this.enterSurvey.value = survey;
                  this.enterSurveyOnChange("visible", true);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  render() {
    const { surveyResponse } = this.props;
    return (
      <LayoutManagement pagePath={pathProject.management.survey}>
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-3 text-left">
              <h3 className="my-3 grid-title">Survey Management</h3>
            </div>
            <div className="col-sm-12 col-md-6 align-right f-right mb-3"></div>
            <div className="col-sm-12 col-md-3 text-md-right">
              <button
                className="btn btn-outline-primary mb-3 add-item-btn"
                onClick={() => {
                  this.enterSurvey.edit = false;
                  this.enterSurvey.update = false;
                  this.enterSurveyOnChange("visible", true);
                }}
              >
                <span className="fa fa-plus mr-1"></span>
                <span>Add survey</span>
              </button>
            </div>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">NAME</th>
                    <th scope="col">DESCRIPTION</th>
                    <th scope="col">ENABLE</th>
                    <th scope="col">EDIT</th>
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
          {this.enterSurvey.visible ? (
            <AddEditSurvey
              enterSurvey={this.enterSurvey}
              enterSurveyOnChange={this.enterSurveyOnChange}
            />
          ) : null}
        </Fragment>
      </LayoutManagement>
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
