import React, { Component } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";
import { AppState } from "../../../../redux-logic/Store";
import {
  userSurveyList,
  userSurveySetAnswerQuestion
} from "../../../../redux-logic/user-survey/Action";
import {
  UserSurveyListResponse,
  UserSurveyModel,
  UserSurveyAnswerResponse
} from "../../../../redux-logic/user-survey/Type";
import "./styles.scss";
import { PaginationRequestBody } from "../../../../redux-logic/essentials-tools/type/Request-type";
import AllImages from "../../../../assets/images/images";
import { Button } from "antd";

interface PropsType {
  userSurveyList: Function;
  userSurveySetAnswerQuestion: Function;
  userSurveyResponse: UserSurveyListResponse;
  onVisible: Function;
  onChange: Function;
}
class UserSurveyList extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };
  componentDidMount = () => {
    const { userSurveyList } = this.props;
    userSurveyList(this.requestBody);
  };
  render() {
    const {
      userSurveyResponse,
      onVisible,
      onChange,
      userSurveySetAnswerQuestion
    } = this.props
    return (
      <div className="client-survey-list pt-4">
        <div className="card w-100 border">
          <div className="card-header px-4 py-3">
            <span>
              Please complete our questionnaire to complete your income tax
              return.
            </span>
          </div>
          <ul className="list-group list-group-flush text-center">
            <li className="list-group-item">
              <div className="row">
                <div className="col">NAME</div>
                <div className="col">DESCRIPTION</div>
                <div className="col">SELECT</div>
              </div>
            </li>
            {!userSurveyResponse.loading &&
              userSurveyResponse.items.map(
                (survey: UserSurveyModel, index: number) => (
                  <li
                    key={`${JSON.stringify(survey)}${index}`}
                    className="list-group-item"
                  >
                    <div className="row">
                      <div className="col">{survey.surveyName}</div>
                      <div className="col">{survey.surveyDescription}</div>
                      <div className="col">
                        <Button
                          type="link"
                          onClick={() => {
                            const updateQuestion: UserSurveyAnswerResponse = {
                              data: survey,
                              success: true,
                              error: userSurveyResponse.error,
                              message: userSurveyResponse.message,
                              loading: false
                            };
                            userSurveySetAnswerQuestion(updateQuestion);
                            onChange();
                          }}
                        >Start</Button>
                      </div>
                    </div>
                  </li>
                )
              )}
          </ul>
          {!userSurveyResponse.loading &&
          userSurveyResponse.items.length === 0 ? (
            <div className="text-center py-3">
              <Empty
                description={<span>No Survey Found yet.</span>}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : null}

          {userSurveyResponse.loading ? (
            <div className="text-center py-3">
              <Empty
                description={<span>Please wait ...</span>}
                image={AllImages.loading}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    userSurveyResponse: state.userSurveyListReducer
  };
}

const mapDispatchToProps = { userSurveyList, userSurveySetAnswerQuestion };
export default connect(mapStateToProps, mapDispatchToProps)(UserSurveyList);
