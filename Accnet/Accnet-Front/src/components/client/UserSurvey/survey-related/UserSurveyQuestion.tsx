// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import DatePicker from "antd/lib/date-picker";
import Empty from "antd/lib/empty";
import { Checkbox } from "antd";
import { navigate } from "gatsby";

// ======================================= component
import DependentsList from "../dependents/DependentsList";
import RelativeList from "../dependents/relative/RelativeList";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";
import {
  UserSelectSurvey,
  UserSurveyAnswerQuestion,
  UserSurveyAnswerResponse,
  ExceptionQuestionsListResponse,
  ExceptionAnswersRequestBody,
  ExceptionQuestionsAnswerResponse,
} from "../../../../redux-logic/user-survey/Type";

import {
  SurveyAnswerTypeObject,
  SurveyAnswerModel,
} from "../../../../redux-logic/survey/Type";
import {
  userSurveyAnswerQuestion,
  userSurveyPreviousQuestion,
  userSurveyNextQuestion,
  getExceptionQuestions,
  sendExceptionAnswers,
} from "../../../../redux-logic/user-survey/Action";
import { updateSurvey } from "../../../../redux-logic/survey/survey-update/Action";
import { SurveyStateUpdateResponse } from "../../../../redux-logic/survey/survey-update/Type";

import { PaginationRequestBody } from "../../../../redux-logic/essentials-tools/type/Request-type";

// ======================================= services
import { checkFieldIsOk, publicCheckArray } from "../../../../service/public";
import AllImages from "../../../../assets/images/images";
import { pathProject } from "../../../../service/constants/defaultValues";

// ======================================= css
import "./styles.scss";
import Spouse from "../dependents/Spouse";
import moment from "moment";
import { getNotification } from "../../../../service/notification";
import UserUpload from "../documents/UserUpload";
import QuestionsCheckForm from "../questions-view/QuestionsCheckForm";
import MedicalUpload from "../documents/MedicalUpload";
import ChildCareUpload from "../documents/ChildCareUpload";
import { ConsoleView } from "react-device-detect";
import SelfEmployee from "../documents/SelfEmployee";

// ======================================= interface

interface PropsType {
  selectSurvey: UserSelectSurvey;
  userSurveyResponse: UserSurveyAnswerResponse;
  consultantVisibleOnChange: Function;
  userSurveyAnswerQuestion: Function;
  userSurveyPreviousQuestion: Function;
  userSurveyNextQuestion: Function;
  onVisible: Function;
  onRemoveCloseIcon: Function;
  updateSurvey: any;
  updatedSurveyResponse: SurveyStateUpdateResponse;
  exceptionQuestionsResponse: ExceptionQuestionsListResponse;
  getExceptionQuestions: any;
  sendExceptionAnswers: any;
  exceptionQuestionsAnswerResponse: ExceptionQuestionsAnswerResponse;
}
class UserSurveyQuestion extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageSize: 10,
    PageNumber: 0,
  };
  current_answer: UserSurveyAnswerQuestion = {
    answerIds: [],
    userAnswer: "",
  };
  addDependent = {
    Visible: false,
    surveyId: "",
  };
  addRelative = {
    Visible: false,
    surveyId: "",
  };

  addSpouse = {
    Visible: false,
    surveyId: "",
  };

  clearAnswerQuestion = () => {
    if (this.numberOfActions !== 1 && this.numberOfActions !== 0) {
      this.doneActions += 1;
      if (this.doneActions === this.numberOfActions) {
        this.current_answer.answerIds = [];
        this.current_answer.userAnswer = "";
        this.doneActions = 0;
        this.forceUpdate();
      }
    } else {
      this.current_answer.answerIds = [];
      this.current_answer.userAnswer = "";
      this.forceUpdate();
    }
  };

  submitAnswerQuestion = (answer: SurveyAnswerModel) => {
    const { userSurveyAnswerQuestion } = this.props;
    const update = this.renderActions(answer);
    if (update) {
      userSurveyAnswerQuestion(this.current_answer);
      this.clearAnswerQuestion();
    }
  };

  checkQuestion = (questionNumber: number) => {
    let exceptionQuestion: boolean = false;

    switch (questionNumber) {
      case 2:
        exceptionQuestion = true;
        break;
      case 16:
        exceptionQuestion = true;
        break;
      case 22:
        exceptionQuestion = true;
        break;
      case 23:
        exceptionQuestion = true;
        break;
      case 24:
        exceptionQuestion = true;
        break;
      case 25:
        exceptionQuestion = true;
        break;
    }

    return exceptionQuestion;
  };

  numberOfActions: number = 0;
  doneActions: number = 0;
  renderActions = (answer: SurveyAnswerModel) => {
    const { userSurveyResponse } = this.props;
    let temp = true;
    if (checkFieldIsOk(answer.actions)) {
      this.numberOfActions = 0;
      for (let index in answer.actions) {
        if (answer.actions[index].type === 3) {
          this.addDependent.Visible = true;
          this.addDependent.surveyId = userSurveyResponse.data.surveyId;
          temp = false;
          this.numberOfActions += 1;
        } else if (answer.actions[index].type === 4) {
          this.addRelative.Visible = true;
          this.addRelative.surveyId = userSurveyResponse.data.surveyId;
          temp = false;
          this.numberOfActions += 1;
        } else if (answer.actions[index].type === 8) {
          this.addSpouse.Visible = true;
          this.addSpouse.surveyId = userSurveyResponse.data.surveyId;
          temp = false;
          this.numberOfActions += 1;
        }
      }
    }
    this.forceUpdate();
    return temp;
  };

  answerCheckBox = (id: string): string => {
    const { userSurveyResponse } = this.props;
    let temp = "";
    if (
      "userAnswerId" in userSurveyResponse.data &&
      publicCheckArray(userSurveyResponse.data.userAnswerId)
    ) {
      for (let index in userSurveyResponse.data.userAnswerId) {
        if (userSurveyResponse.data.userAnswerId[index] === id) {
          temp = "text-danger";
        }
      }
    }

    return temp;
  };

  renderInput = (answer: SurveyAnswerModel) => {
    return (
      <div className="p-3 input-group">
        {this.props.userSurveyResponse.data.nextQuestion.number === 9 ? (
          <span className="fa fa-dollar-sign" style={{ padding: "12px" }} />
        ) : null}
        <input
          value={
            this.props.userSurveyResponse.data.nextQuestion.number === 9
              ? this.current_answer.userAnswer
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : this.current_answer.userAnswer
          }
          className="form-control"
          onChange={(event) => {
            let value = event.target.value;
            while (value.includes(",")) {
              value = value.replace(",", "");
            }
            this.current_answer.userAnswer = value;
            this.forceUpdate();
          }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              this.current_answer.answerIds.push(answer.id ? answer.id : "");
              this.submitAnswerQuestion(answer);
            }}
            disabled={this.current_answer.userAnswer === ""}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  renderStatic = (answer: SurveyAnswerModel) => {
    const { userSurveyResponse } = this.props;
    return (
      <div className="text-center my-2">
        <button
          onClick={() => {
            this.current_answer.answerIds.push(answer.id ? answer.id : "");
            this.submitAnswerQuestion(answer);
          }}
          className="btn btn-outline-primary custom-btn selected-btn"
        >
          <span
            className={
              "userAnswerId" in userSurveyResponse.data &&
              userSurveyResponse.data.userAnswerId.length > 0 &&
              userSurveyResponse.data.userAnswerId[0] === answer.id
                ? answer.id
                : ""
                ? "text-success"
                : ""
            }
          >
            {answer.text}
          </span>
        </button>
      </div>
    );
  };

  renderCalender = (answer: SurveyAnswerModel) => {
    return (
      <div className="p-3 input-group">
        <DatePicker
          className="form-control"
          showToday={true}
          disabledDate={(d: any) => {
            return (
              !d ||
              d.isAfter(moment(new Date())) ||
              d.isSameOrBefore("1910-01-01")
            );
          }}
          onChange={(date: any, dateString: any) => {
            this.current_answer.userAnswer = dateString;
            this.forceUpdate();
          }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              this.current_answer.answerIds.push(answer.id ? answer.id : "");
              this.submitAnswerQuestion(answer);
            }}
            disabled={this.current_answer.userAnswer === ""}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  renderCheckBox = (answer: SurveyAnswerModel, index: number) => {
    return (
      <div className="py-3 text-center col-4">
        <Checkbox
          onChange={(event) => {
            this.current_answer.answerIds.splice(
              index,
              0,
              answer.id ? answer.id : ""
            );
            this.forceUpdate();
          }}
        >
          <span className={this.answerCheckBox(answer.id ? answer.id : "")}>
            {answer.text}
          </span>
        </Checkbox>
      </div>
    );
  };

  showStep: number = 0;
  getException: boolean = false;
  didAnswerFormCheck: boolean = false;
  didAnswerMedical: boolean = false;
  render() {
    const {
      userSurveyAnswerQuestion,
      userSurveyResponse,
      onVisible,
      consultantVisibleOnChange,
      userSurveyPreviousQuestion,
      userSurveyNextQuestion,
    } = this.props;

    if (
      ((userSurveyResponse.success &&
        userSurveyResponse.data.nextQuestion !== null &&
        userSurveyResponse.data.nextQuestion.number === 16) ||
        (userSurveyResponse.success &&
          userSurveyResponse.data.nextQuestion !== null &&
          userSurveyResponse.data.nextQuestion.number === 22)) &&
      !this.getException
    ) {
      this.props.getExceptionQuestions(userSurveyResponse.data.surveyId);
      this.getException = true;
    }

    if (this.showStep === 3) {
      if (
        !this.props.updatedSurveyResponse.loading &&
        this.props.updatedSurveyResponse.success
      ) {
        this.showStep = 0;
        navigate(pathProject.client.invoice);
        onVisible();
      } else if (this.props.updatedSurveyResponse.error.code !== 0) {
        getNotification(
          "Something went wrong!",
          this.props.updatedSurveyResponse.error.data[0],
          4
        );
      }
    }

    if (
      checkFieldIsOk(userSurveyResponse.data) &&
      userSurveyResponse.data.isFinished
    ) {
      this.props.onRemoveCloseIcon();
    }

    return (
      <div className="q-step1">
        {userSurveyResponse.loading ||
        (userSurveyResponse.data.nextQuestion !== null &&
          (userSurveyResponse.data.nextQuestion.number === 16 ||
            userSurveyResponse.data.nextQuestion.number === 22) &&
          this.props.exceptionQuestionsResponse.loading) ? (
          <div className="text-center py-3">
            <Empty
              description={<span>Please wait ...</span>}
              image={AllImages.loading}
            />
          </div>
        ) : (
          <Fragment>
            {checkFieldIsOk(userSurveyResponse.data) &&
            !userSurveyResponse.data.isFinished &&
            checkFieldIsOk(userSurveyResponse.data.nextQuestion) ? (
              <Fragment>
                {userSurveyResponse.data.nextQuestion.number === 23 ||
                (this.props.exceptionQuestionsAnswerResponse.data.question
                  .number === 23 &&
                  !this.didAnswerMedical) ? (
                  <div className="m-header">
                    <span className="mr-2">Question</span>

                    <span>23</span>

                    <span className="mx-1">/</span>
                    <span>{userSurveyResponse.data.questionCount}</span>
                  </div>
                ) : userSurveyResponse.data.nextQuestion.number > 15 &&
                  userSurveyResponse.data.nextQuestion.number < 23 ? (
                  <div className="m-header">
                    <span className="mr-2">Question</span>

                    <span>16 - 22</span>

                    <span className="mx-1">/</span>
                    <span>{userSurveyResponse.data.questionCount}</span>
                  </div>
                ) : (
                  <div className="m-header">
                    <span className="mr-2">Question</span>

                    <span>{userSurveyResponse.data.nextQuestion.number}</span>

                    <span className="mx-1">/</span>
                    <span>{userSurveyResponse.data.questionCount}</span>
                  </div>
                )}

                <div className="m-body py-5">
                  {!this.checkQuestion(
                    userSurveyResponse.data.nextQuestion.number
                  ) ? (
                    <h3 className="d-block text-center mb-50 t-color question">
                      {userSurveyResponse.data.nextQuestion.text}
                    </h3>
                  ) : null}

                  {!this.checkQuestion(
                    userSurveyResponse.data.nextQuestion.number
                  ) ? (
                    <div>
                      {" "}
                      <div className="m-0">
                        {userSurveyResponse.data.nextQuestion.answers.map(
                          (answer: SurveyAnswerModel, index: number) => (
                            <Fragment key={`${JSON.stringify(answer)}${index}`}>
                              {SurveyAnswerTypeObject[answer.type] ===
                              "Input" ? (
                                <Fragment>
                                  {this.renderInput(answer)}
                                  {"userAnswerText" in
                                    userSurveyResponse.data &&
                                  userSurveyResponse.data.userAnswerText !==
                                    "" ? (
                                    <div className="px-3">
                                      <b>Your last answer : </b>
                                      <span>
                                        {userSurveyResponse.data.userAnswerText}
                                      </span>
                                    </div>
                                  ) : null}
                                </Fragment>
                              ) : null}
                            </Fragment>
                          )
                        )}
                      </div>
                      <div className="m-0">
                        {userSurveyResponse.data.nextQuestion.answers.map(
                          (answer: SurveyAnswerModel, index: number) => (
                            <Fragment key={`${JSON.stringify(answer)}${index}`}>
                              {SurveyAnswerTypeObject[answer.type] ===
                              "Static" ? (
                                <Fragment>{this.renderStatic(answer)}</Fragment>
                              ) : null}
                            </Fragment>
                          )
                        )}
                      </div>
                      <div className="m-0">
                        {userSurveyResponse.data.nextQuestion.answers.map(
                          (answer: SurveyAnswerModel, index: number) => (
                            <Fragment key={`${JSON.stringify(answer)}${index}`}>
                              {SurveyAnswerTypeObject[answer.type] ===
                              "Calendar" ? (
                                <Fragment>
                                  {this.renderCalender(answer)}
                                  {"userAnswerText" in
                                    userSurveyResponse.data &&
                                  userSurveyResponse.data.userAnswerText !==
                                    "" ? (
                                    <div className="px-3">
                                      <b>Your last answer : </b>
                                      <span>
                                        {userSurveyResponse.data.userAnswerText}
                                      </span>
                                    </div>
                                  ) : null}
                                </Fragment>
                              ) : null}
                            </Fragment>
                          )
                        )}
                      </div>
                      <div className="m-0 row">
                        {userSurveyResponse.data.nextQuestion.answers.map(
                          (answer: SurveyAnswerModel, index: number) => (
                            <Fragment key={`${JSON.stringify(answer)}${index}`}>
                              {SurveyAnswerTypeObject[answer.type] ===
                              "CheckBox" ? (
                                <Fragment>
                                  {this.renderCheckBox(answer, index)}
                                </Fragment>
                              ) : null}
                            </Fragment>
                          )
                        )}
                        {SurveyAnswerTypeObject[
                          userSurveyResponse.data.nextQuestion.answers[
                            userSurveyResponse.data.nextQuestion.answers
                              .length - 1
                          ].type
                        ] === "CheckBox" ? (
                          <div className="p-3 text-center col-12">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                userSurveyAnswerQuestion(this.current_answer);
                                this.clearAnswerQuestion();
                              }}
                              disabled={
                                this.current_answer.answerIds.length === 0
                              }
                            >
                              Save
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : userSurveyResponse.data.nextQuestion.number === 2 ? (
                    <div className="m-0">
                      <UserUpload
                        typeOfUser="main"
                        onSaveAnswer={() => {
                          this.current_answer.answerIds.push(
                            userSurveyResponse.data.nextQuestion.answers[0]
                              .id !== undefined &&
                              userSurveyResponse.data.nextQuestion.answers[0]
                                .id !== ""
                              ? userSurveyResponse.data.nextQuestion.answers[0]
                                  .id
                              : ""
                          );
                          userSurveyAnswerQuestion(this.current_answer);
                          this.clearAnswerQuestion();
                        }}
                        userId=""
                        surveyId={userSurveyResponse.data.surveyId}
                        providedResponses={{
                          assessments: [],
                          extraFile: [],
                          reciepts: [],
                        }}
                      />
                    </div>
                  ) : (userSurveyResponse.data.nextQuestion.number === 16 ||
                      userSurveyResponse.data.nextQuestion.number === 22) &&
                    !this.didAnswerFormCheck ? (
                    <QuestionsCheckForm
                      listOfQuestionsAndAnswers={
                        this.props.exceptionQuestionsResponse
                      }
                      surveyId={userSurveyResponse.data.surveyId}
                      onSave={(request: ExceptionAnswersRequestBody) => {
                        this.didAnswerFormCheck = true;
                        this.clearAnswerQuestion();
                        this.props.sendExceptionAnswers(request);
                      }}
                    />
                  ) : userSurveyResponse.data.nextQuestion.number === 23 ||
                    (this.props.exceptionQuestionsAnswerResponse.data.question
                      .number === 23 &&
                      !this.didAnswerMedical) ? (
                    <MedicalUpload
                      onSaveAnswer={() => {
                        this.didAnswerMedical = true;
                        this.current_answer.answerIds.push(
                          this.props.exceptionQuestionsAnswerResponse.data
                            .question.answers[0].id
                        );
                        userSurveyAnswerQuestion(this.current_answer);
                        this.clearAnswerQuestion();
                      }}
                      surveyId={userSurveyResponse.data.surveyId}
                      typeOfUser="main"
                    />
                  ) : userSurveyResponse.data.nextQuestion.number === 24 ? (
                    <ChildCareUpload
                      onSaveAnswer={() => {
                        console.log("ghablesh", this.current_answer);
                        this.current_answer.answerIds.push(
                          userSurveyResponse.data.nextQuestion.answers[0].id !==
                            undefined &&
                            userSurveyResponse.data.nextQuestion.answers[0]
                              .id !== ""
                            ? userSurveyResponse.data.nextQuestion.answers[0].id
                            : ""
                        );
                        userSurveyAnswerQuestion(this.current_answer);
                        this.clearAnswerQuestion();
                      }}
                      surveyId={userSurveyResponse.data.surveyId}
                      typeOfUser="main"
                    />
                  ) : userSurveyResponse.data.nextQuestion.number === 25 ? (
                    <SelfEmployee
                      onSaveAnswer={() => {
                        console.log("ghablesh", this.current_answer);
                        this.current_answer.answerIds.push(
                          userSurveyResponse.data.nextQuestion.answers[0].id !==
                            undefined &&
                            userSurveyResponse.data.nextQuestion.answers[0]
                              .id !== ""
                            ? userSurveyResponse.data.nextQuestion.answers[0].id
                            : ""
                        );
                        userSurveyAnswerQuestion(this.current_answer);
                        this.clearAnswerQuestion();
                      }}
                      surveyId={userSurveyResponse.data.surveyId}
                      typeOfUser="main"
                    />
                  ) : null}
                </div>
                <div className="m-footer">
                  {checkFieldIsOk(userSurveyResponse.data.nextQuestion) ? (
                    <div className="row">
                      <div className="col-6 text-left">
                        {userSurveyResponse.data.nextQuestion.number > 1 ? (
                          <b
                            className="cursor-pointer"
                            onClick={() => {
                              if (
                                userSurveyResponse.data.nextQuestion.number ===
                                  23 ||
                                (this.props.exceptionQuestionsAnswerResponse
                                  .data.question.number === 23 &&
                                  userSurveyResponse.data.nextQuestion.number <
                                    this.props.exceptionQuestionsAnswerResponse
                                      .data.question.number)
                              ) {
                                this.didAnswerFormCheck = false;
                                this.didAnswerMedical = false;
                                this.getException = false;
                                userSurveyPreviousQuestion({
                                  id: userSurveyResponse.data.nextQuestion.id,
                                });
                                this.clearAnswerQuestion();
                              } else if (
                                userSurveyResponse.data.nextQuestion.number <
                                  23 &&
                                userSurveyResponse.data.nextQuestion.number > 15
                              ) {
                                userSurveyPreviousQuestion({
                                  id: "b6b76bab-1ac9-4263-bb11-a536108281b5",
                                });
                                this.clearAnswerQuestion();
                              } else {
                                userSurveyPreviousQuestion({
                                  id: userSurveyResponse.data.nextQuestion.id,
                                });
                                this.clearAnswerQuestion();
                              }
                            }}
                          >
                            Previous
                          </b>
                        ) : null}
                      </div>
                      <div className="col-6 text-right">
                        {"userAnswerText" in userSurveyResponse.data &&
                        !userSurveyResponse.data.isFinished ? (
                          <b
                            className="cursor-pointer"
                            onClick={() => {
                              if (
                                userSurveyResponse.data.nextQuestion.number ===
                                16
                              ) {
                                this.didAnswerFormCheck = false;
                                this.didAnswerMedical = false;
                                this.getException = false;
                                userSurveyNextQuestion({
                                  id: userSurveyResponse.data.nextQuestion.id,
                                });
                                this.clearAnswerQuestion();
                              } else if (
                                userSurveyResponse.data.nextQuestion.number <=
                                  22 &&
                                userSurveyResponse.data.nextQuestion.number >=
                                  16
                              ) {
                                userSurveyNextQuestion({
                                  id: "de75e8c1-77d8-499e-b682-9437026cfd56",
                                });
                                this.clearAnswerQuestion();
                              } else {
                                userSurveyNextQuestion({
                                  id: userSurveyResponse.data.nextQuestion.id,
                                });
                                this.clearAnswerQuestion();
                              }
                            }}
                          >
                            Next
                          </b>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </Fragment>
            ) : (
              <div className="text-center">
                {userSurveyResponse.data.isFinished &&
                !userSurveyResponse.data.makeAnAppointment ? (
                  <Fragment>
                    <div className="py-3">
                      <span>
                        Complete. Please pay the outstanding invoice. Once this
                        is complete, we will begin working on your tax return.
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          navigate(pathProject.client.invoice);
                          onVisible();
                        }}
                        className="mb-2 btn btn-secondary btn-sm"
                      >
                        Take me to invoices
                      </button>
                    </div>
                  </Fragment>
                ) : null}
                {userSurveyResponse.data.isFinished &&
                userSurveyResponse.data.makeAnAppointment ? (
                  <Fragment>
                    <div className="py-3">
                      <span>
                        Complete. Please pay the outstanding invoice. Once this
                        is complete, we will begin working on your tax return.
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          this.showStep = 3;
                          this.props.updateSurvey(
                            userSurveyResponse.data.surveyId
                          );
                          this.forceUpdate();
                        }}
                        className="mb-2 btn btn-secondary btn-sm"
                      >
                        Take me to invoices
                      </button>
                    </div>
                  </Fragment>
                ) : // <Fragment>
                //   {this.showStep === 1 ? (
                //     <div className="row py-3">
                //       <div className="col-sm-12 col-md-6 mb-4 mb-md-0">
                //         <div className="mb-2">
                //           <span className="h3 title">
                //             Process Now (recommended)
                //           </span>
                //         </div>

                //         <p className="min-height">
                //           We highly recommend the choice to process your
                //           income tax return now as opposed to later.
                //           Meanwhile, should you have any special tax
                //           complexities, our AccNet tax professional will
                //           advise what is applicable to you, and you will be
                //           advised of any extra charges that may be associated
                //           with the processing of those extra items. Some
                //           complexities are rental income, disability, medical
                //           expenses, foreign investments, etc. To process your
                //           tax return now, kindly proceed to pay the invoice so
                //           we can begin working on your tax return.
                //         </p>
                //         <div className="mt-3">
                //           <button
                //             onClick={() => {
                //               this.showStep = 3;
                //               this.props.updateSurvey(
                //                 userSurveyResponse.data.surveyId
                //               );
                //               this.forceUpdate();
                //             }}
                //             className="mb-2 btn btn-success btn-sm"
                //           >
                //             Pay Now
                //           </button>
                //         </div>
                //       </div>
                //       <div className="col-sm-12 col-md-6">
                //         <div className="mb-2">
                //           <span className="h3 title">Have a talk</span>
                //         </div>
                //         <p className="text-cenetr">
                //           Book a free-of-charge consultation now with an
                //           AccNet representative, to clarify some of your tax
                //           information(s), and pay the final invoice then. In
                //           this instance AccNet will begin working on your tax
                //           return when the full invoice has been paid.
                //         </p>
                //         <div className="mt-3">
                //           <button
                //             onClick={() => {
                //               this.showStep = 0;
                //               onVisible();
                //               setTimeout(() => {
                //                 consultantVisibleOnChange();
                //               }, 500);
                //             }}
                //             className="mb-2 btn btn-info btn-sm"
                //           >
                //             Book free consultation
                //           </button>
                //         </div>
                //       </div>
                //     </div>
                //   ) : this.showStep === 3 ? (
                //     <div className="text-center py-3">
                //       <Empty
                //         description={<span>Please wait ...</span>}
                //         image={AllImages.loading}
                //       />
                //     </div>
                //   ) : (
                //     <div>
                //       <div className="py-3">
                //         <span>
                //           Thank you. Your answers require us to ask a couple
                //           more questions, so we can maximize your return. One
                //           of our tax professionals will need to contact you.
                //           Please click okay to proceed.
                //         </span>
                //       </div>
                //       <div>
                //         <button
                //           onClick={() => {
                //             this.showStep = 1;
                //             this.forceUpdate();
                //           }}
                //           className="mb-2 btn btn-secondary btn-sm"
                //         >
                //           okay
                //         </button>
                //       </div>
                //     </div>
                //   )}
                // </Fragment>
                null}
              </div>
            )}

            {this.addDependent.Visible ? (
              <DependentsList
                onSaveAll={() => {
                  this.addDependent.Visible = false;
                  userSurveyAnswerQuestion(this.current_answer);
                  this.clearAnswerQuestion();
                }}
                onCancelAll={() => {
                  this.addDependent.Visible = false;
                  this.clearAnswerQuestion();
                }}
                dependentsModalVisibility={this.addDependent.Visible}
                surveyId={this.addDependent.surveyId}
              />
            ) : null}

            {this.addRelative.Visible ? (
              <RelativeList
                onCancelAll={() => {
                  this.addRelative.Visible = false;
                  this.clearAnswerQuestion();
                }}
                onSaveAll={() => {
                  this.addRelative.Visible = false;
                  userSurveyAnswerQuestion(this.current_answer);
                  this.clearAnswerQuestion();
                }}
                surveyId={this.addRelative.surveyId}
                relativeModalVisibility={this.addRelative.Visible}
              />
            ) : null}

            {this.addSpouse.Visible ? (
              <Spouse
                onCancel={() => {
                  this.addSpouse.Visible = false;
                  this.current_answer.answerIds = [];
                  this.current_answer.userAnswer = "";
                  this.forceUpdate();
                }}
                onSave={() => {
                  this.addSpouse.Visible = false;
                  if (this.numberOfActions - 1 === this.doneActions) {
                    userSurveyAnswerQuestion(this.current_answer);
                  }
                  this.clearAnswerQuestion();
                }}
                spouseModalVisibility={this.addSpouse.Visible}
                surveyId={this.addSpouse.surveyId}
              />
            ) : null}
          </Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    userSurveyResponse: state.userSurveyQuestionReducer,
    updatedSurveyResponse: state.surveyUpdateReducer,
    exceptionQuestionsResponse: state.getExceptionsReducer,
    exceptionQuestionsAnswerResponse: state.sendExceptionsReducer,
  };
}

const mapDispatchToProps = {
  userSurveyAnswerQuestion,
  userSurveyPreviousQuestion,
  userSurveyNextQuestion,
  updateSurvey,
  getExceptionQuestions,
  sendExceptionAnswers,
};
export default connect(mapStateToProps, mapDispatchToProps)(UserSurveyQuestion);
