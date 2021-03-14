import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Empty from "antd/lib/empty";
import {
  SurveyModel,
  SurveyQuestionsModel
} from "../../../../redux-logic/survey/Type";
import {
  surveyAdd,
  surveyEdit
} from "../../../../redux-logic/survey/Action";
import SurveyQuestion from "./SurveyQuestion";
import { AppState } from "../../../../redux-logic/Store";
import { getNotification } from "../../../../service/notification";
import { CrudObject } from "../../../../redux-logic/essentials-tools/type/Basic-Object-type";

const initialize: SurveyModel = {
  name: "",
  description: "",
  questions: [],
  enabled: true
};

interface PropsType {
  enterSurvey: CrudObject;
  enterSurveyOnChange: Function;
  closeAddSurvey: Function;
  surveyAdd: Function;
  surveyEdit: Function;
}

class SurveyQuestionList extends Component<PropsType> {
  requestBody: SurveyModel = { ...initialize };
  enterQuestion = {
    visible: false,
    update: false,
    edit: false,
    value: {},
    valueIndex: 0
  };

  componentDidUpdate = () => {
    const { enterSurvey } = this.props;
    if (enterSurvey.update) {
      this.requestBody.questions = [...enterSurvey.value.questions];
      this.props.enterSurveyOnChange("update", false);
    }
  };

  enterQuestionOnChange = (
    filed: "visible" | "update" | "value",
    value: any
  ) => {
    this.enterQuestion[filed] = value;
    this.forceUpdate();
  };

  submitSurvey = () => {
    const { closeAddSurvey, surveyAdd, surveyEdit , enterSurvey} = this.props;
    if (this.requestBody.questions.length === 0) {
      getNotification("Questions must be one and more.");
      return;
    }
    if (enterSurvey.edit) {
      const updateSurvey = {
        name: enterSurvey.value.name,
        description: enterSurvey.value.description,
        questions: [...this.requestBody.questions],
        enabled: enterSurvey.value.enabled,
        id: enterSurvey.value.id
      };
      surveyEdit(updateSurvey)
    } else {
      const addSurvey = {
        name: enterSurvey.value.name,
        description: enterSurvey.value.description,
        questions: this.requestBody.questions,
        enabled: enterSurvey.value.enabled
      };
      surveyAdd(addSurvey);
    }
    closeAddSurvey();
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize, questions: [] };
    this.props.enterSurveyOnChange("visible", false);
  };

  setNumberAnswerAndQuestion = () => {
    for (let index in this.requestBody.questions) {
      this.requestBody.questions[index].number = Number(index) + 1;
      for (let answerIndex in this.requestBody.questions[index].answers) {
        this.requestBody.questions[index].answers[answerIndex].number = Number(
          `${Number(index) + 1}.${Number(answerIndex) + 1}`
        );
      }
    }
    this.forceUpdate();
  };

  render() {
    const { enterSurvey } = this.props;
    return (
      <Modal
        title="Question List"
        visible={enterSurvey.visible}
        maskClosable={false}
        destroyOnClose
        footer={
          <div className="text-right">
            <button
              onClick={this.submitSurvey}
              className="btn btn-outline-success btn-xs"
            >
              Save survey
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <Fragment>
          <div className="text-right">
            <button
              onClick={() => {
                this.enterQuestion.edit = false;
                this.enterQuestion.update = false;
                this.enterQuestionOnChange("visible", true);
              }}
              className="btn btn-success btn-xs"
            >
              Add Question
            </button>
          </div>
          <div>
            <table className="table text-center mt-2">
              <thead>
                <tr>
                  <th scope="col">ORDER</th>
                  <th scope="col">DESCRIPTION</th>
                  <th scope="col">NO ANSWER</th>
                  <th scope="col">EDIT</th>
                  <th scope="col">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {this.requestBody.questions.map(
                  (question: SurveyQuestionsModel, index: number) => (
                    <tr key={`${JSON.stringify(question)}${index}`}>
                      <td>{Number(index) + 1}</td>
                      <td>{question.text}</td>
                      <td>{question.answers.length}</td>
                      <td>
                        <button
                          className="btn-icon glyph-icon simple-icon-note"
                          onClick={() => {
                            this.enterQuestion.update = true;
                            this.enterQuestion.value = question;
                            this.enterQuestion.valueIndex = index;
                            this.enterQuestion.edit = true;
                            this.enterQuestionOnChange("visible", true);
                          }}
                        />
                      </td>
                      <td>
                        <button
                          className="btn-icon glyph-icon simple-icon-trash"
                          onClick={() => {
                            this.requestBody.questions.splice(index, 1);
                            this.setNumberAnswerAndQuestion();
                          }}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            {this.requestBody.questions.length === 0 ? (
              <div className="text-center">
                <Empty
                  description={<span>No Question Set yet.</span>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : null}
          </div>
          <SurveyQuestion
            enterQuestion={this.enterQuestion}
            enterQuestionOnChange={this.enterQuestionOnChange}
            questions={this.requestBody.questions}
            onChange={(event: SurveyQuestionsModel) => {
              if (this.enterQuestion.edit) {
                this.requestBody.questions.splice(
                  this.enterQuestion.valueIndex,
                  1,
                  event
                );
              } else {
                this.requestBody.questions.push(event);
              }
              this.setNumberAnswerAndQuestion();
            }}
          />
        </Fragment>
      </Modal>
    );
  }
}
function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = { surveyAdd, surveyEdit };

export default connect(mapStateToProps, mapDispatchToProps)(SurveyQuestionList);
