import React, { Component, Fragment } from "react";
import Modal from "antd/lib/modal";
import Empty from "antd/lib/empty";
import Select from "antd/lib/select";
import {
  SurveyQuestionsModel,
  SurveyAnswerModel
} from "../../../../redux-logic/survey/Type";
import SurveyAnswer from "../answer/SurveyAnswer";
import { getNotification } from "../../../../service/notification";
import { CrudObject } from "../../../../redux-logic/essentials-tools/type/Basic-Object-type";

const initialize: SurveyQuestionsModel = {
  number: 0,
  text: "",
  mustAnsweredNumber: [],
  answers: []
};

interface PropType {
  enterQuestion: CrudObject;
  enterQuestionOnChange: Function;
  onChange: Function;
  questions: Array<SurveyQuestionsModel>;
}
export default class SurveyQuestion extends Component<PropType> {
  questionModel: SurveyQuestionsModel = { ...initialize };
  mustBeAnswer: Array<string> = [];
  enterAnswer: CrudObject = {
    visible: false,
    update: false,
    edit: false,
    value: {},
    valueIndex: 0
  };

  componentDidUpdate = () => {
    const { enterQuestion, enterQuestionOnChange, questions } = this.props;
    if (enterQuestion.visible && enterQuestion.update) {
      this.questionModel.number = enterQuestion.value.number;
      this.questionModel.text = enterQuestion.value.text;
      this.questionModel.mustAnsweredNumber = [
        ...enterQuestion.value.mustAnsweredNumber
      ];
      this.questionModel.answers = [...enterQuestion.value.answers];
      const temp: SurveyQuestionsModel = enterQuestion.value;
      for (let index in temp.mustAnsweredNumber) {
        for (let indexQuestion in questions) {
          for (let indexAnswer in questions[indexQuestion].answers) {
            if (
              questions[indexQuestion].answers[indexAnswer].number ===
              temp.mustAnsweredNumber[index]
            ) {
              this.mustBeAnswer.push(
                questions[indexQuestion].answers[indexAnswer].text
              );
            }
          }
        }
      }
      enterQuestionOnChange("update", false);
    }
  };

  enterAnswerOnChange = (filed: "visible" | "update" | "value", value: any) => {
    this.enterAnswer[filed] = value;
    this.forceUpdate();
  };

  checkQuestion = () => {
    if (this.questionModel.text === "") {
      getNotification("Please enter text.");
      return;
    }
    this.props.onChange(this.questionModel);
    this.closeModal();
  };

  closeModal = () => {
    this.props.enterQuestionOnChange("visible", false);
    this.questionModel = { ...initialize, answers: [], mustAnsweredNumber: [] };
    this.mustBeAnswer = [];
    this.forceUpdate();
  };

  render() {
    const { questions, enterQuestion } = this.props;
    const { Option } = Select;
    return (
      <Modal
        title="Enter Question"
        visible={enterQuestion.visible}
        maskClosable={false}
        destroyOnClose
        footer={
          <div className="text-right">
            <button
              onClick={this.checkQuestion}
              className="mb-2 btn btn-success btn-xs"
            >
              Save Question
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <Fragment>
          {enterQuestion.edit &&
          enterQuestion.valueIndex === 0 ? null : questions.length > 0 ? (
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Must Answered Number</label>
                  <div>
                    <Select
                      mode="multiple"
                      placeholder="Select answer question before this question"
                      className="select-component w-100"
                      size={"default"}
                      value={this.mustBeAnswer}
                      onChange={(event: Array<string>) => {
                        this.mustBeAnswer = [];
                        for (let index in event) {
                          if (event[index][0] === "{") {
                            const answer: SurveyAnswerModel = JSON.parse(
                              event[index]
                            );
                            this.questionModel.mustAnsweredNumber.push(
                              answer.number
                            );
                            this.mustBeAnswer.push(answer.text);
                          } else {
                            this.mustBeAnswer.push(event[index]);
                          }
                        }
                        if (event.length === 0) {
                          this.questionModel.mustAnsweredNumber = [];
                          this.mustBeAnswer = [];
                        }
                        this.forceUpdate();
                      }}
                      filterOption
                    >
                      {questions.map(
                        (
                          question: SurveyQuestionsModel,
                          indexQuestion: number
                        ) =>
                          question.answers.map(
                            (
                              answer: SurveyAnswerModel,
                              indexAnswer: number
                            ) => (
                              <Option
                                key={`${JSON.stringify({
                                  ...answer,
                                  index: `${indexQuestion},${indexAnswer}`
                                })}`}
                              >
                                <div>
                                  <div>{answer.text}</div>
                                  <div>{question.text}</div>
                                </div>
                              </Option>
                            )
                          )
                      )}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>Question</label>
                <textarea
                  style={{ height: "120px", resize: "none" }}
                  value={this.questionModel.text}
                  onChange={e => {
                    this.questionModel.text = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter question"
                />
              </div>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={() => {
                this.enterAnswer.edit = false;
                this.enterAnswer.update = false;
                this.enterAnswerOnChange("visible", true);
              }}
              className="btn btn-success btn-xs"
            >
              Add Answer
            </button>
          </div>
          <table className="table text-center mt-2">
            <thead>
              <tr>
                <th scope="col">ORDER</th>
                <th scope="col">QUESTION</th>
                <th scope="col">NO ANSWER</th>
                <th scope="col">EDIT</th>
                <th scope="col">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {this.questionModel.answers.map(
                (answers: SurveyAnswerModel, index: number) => (
                  <tr key={`${JSON.stringify(answers)}${index}`}>
                    <td>{Number(index) + 1}</td>
                    <td>{answers.text}</td>
                    <td>{answers.actions.length}</td>
                    <td>
                      <button
                        className="btn-icon glyph-icon simple-icon-note"
                        onClick={() => {
                          this.enterAnswer.update = true;
                          this.enterAnswer.value = answers;
                          this.enterAnswer.valueIndex = index;
                          this.enterAnswer.edit = true;
                          this.enterAnswerOnChange("visible", true);
                        }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn-icon glyph-icon simple-icon-trash"
                        onClick={() => {
                          this.questionModel.answers.splice(index, 1);
                          this.forceUpdate();
                        }}
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          {this.questionModel.answers.length === 0 ? (
            <div className="text-center">
              <Empty
                description={<span>No Answer Set yet.</span>}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : null}
          <SurveyAnswer
            enterAnswer={this.enterAnswer}
            enterAnswerOnChange={this.enterAnswerOnChange}
            onChange={(event: SurveyAnswerModel) => {
              if (this.enterAnswer.edit) {
                this.questionModel.answers.splice(
                  this.enterAnswer.valueIndex,
                  1,
                  event
                );
              } else {
                this.questionModel.answers.push(event);
              }
              this.forceUpdate();
            }}
          />
        </Fragment>
      </Modal>
    );
  }
}
