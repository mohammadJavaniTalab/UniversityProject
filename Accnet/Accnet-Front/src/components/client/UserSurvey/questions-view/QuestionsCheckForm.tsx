import * as React from "react";
import { AppState } from "../../../../redux-logic/Store";
import { connect } from "react-redux";
import { Checkbox, Button } from "antd";
import "./style.scss";
import {
  ExceptionQuestionModel,
  ExceptionQuestionsListResponse,
  ExceptionAnswersRequestBody,
} from "../../../../redux-logic/user-survey/Type";

interface IQuestionsCheckFormProps {
  listOfQuestionsAndAnswers: ExceptionQuestionsListResponse;
  surveyId: string;
  onSave: any;
}

class QuestionsCheckForm extends React.Component<IQuestionsCheckFormProps> {
  exceptionAnswers: ExceptionAnswersRequestBody = {
    answers: [],
    surveyId: this.props.surveyId,
  };

  existInAnswers = (id: string) => {
    for (let i = 0; i < this.exceptionAnswers.answers.length; i++) {
      if (this.exceptionAnswers.answers[i] === id) {
        return true;
      }
    }
    return false;
  };

  findIdByText = (item: ExceptionQuestionModel, text: string) => {
    for (let i = 0; i < this.props.listOfQuestionsAndAnswers.data.length; i++) {
      if (
        item.question.id ===
        this.props.listOfQuestionsAndAnswers.data[i].question.id
      ) {
        let question = this.props.listOfQuestionsAndAnswers.data[i].question;
        for (let j = 0; j < question.answers.length; j++) {
          if (question.answers[j].text === text) {
            let id: string = question.answers[j].id;
            return id;
          }
        }
      }
    }
    return "";
  };

  getOtherAnswerId = (item: ExceptionQuestionModel, answerId: string) => {
    for (let i = 0; i < item.question.answers.length; i++) {
      if (item.question.answers[i].id !== answerId) {
        return item.question.answers[i].id;
      }
    }

    return "";
  };

  findSameQuestionAnswer = (sameId: string) => {
    for (let i = 0; i < this.exceptionAnswers.answers.length; i++) {
      if (this.exceptionAnswers.answers[i] === sameId) {
        this.exceptionAnswers.answers.splice(i, 1);
      }
    }
  };

  checkAllNoAnswers = (checked: boolean) => {
    this.exceptionAnswers = {
      ...this.exceptionAnswers,
      answers: [],
    };

    if (checked) {
      for (
        let i = 0;
        i < this.props.listOfQuestionsAndAnswers.data.length;
        i++
      ) {
        let question = this.props.listOfQuestionsAndAnswers.data[i].question;
        for (let j = 0; j < question.answers.length; j++) {
          if (question.answers[j].text === "No") {
            let id: string = question.answers[j].id;
            this.exceptionAnswers.answers.push(id);
          }
        }
      }
    }
    this.forceUpdate();
  };

  setValuesByResponse: boolean = false;

  isAllChecked: boolean = false;
  render() {
    if (!this.setValuesByResponse) {
      for (
        let i = 0;
        i < this.props.listOfQuestionsAndAnswers.data.length;
        i++
      ) {
        this.exceptionAnswers.answers.push(
          this.props.listOfQuestionsAndAnswers.data[i].userAnswerId
        );
      }
      this.setValuesByResponse = true;
    }
    return (
      <div className="content-padding">
        <h3>
          <strong>Answer below questions with yes / no check mark.</strong>
        </h3>

        <div className="row">
          <div className="col-8"></div>
          <div className="col-4">
            <Button
              type="primary"
              className="col-12"
              onClick={(e: any) => {
                this.isAllChecked = !this.isAllChecked;
                this.checkAllNoAnswers(this.isAllChecked);
              }}
            >
              Check all NO
            </Button>
            <hr />
          </div>
        </div>
        {this.props.listOfQuestionsAndAnswers.data.map(
          (item: ExceptionQuestionModel) => {
            return (
              <div className="row pt-3">
                <div className="col-8">
                  <div className="row">
                    <div className="circle-number">
                      {item.question.number}
                    </div>
                    <div className="questions-style col-10">{item.question.text}</div>{" "}
                  </div>
                </div>{" "}
                <div className="col-4">
                  <div style={{textAlign: "center"}}>
                    <Checkbox
                      checked={this.existInAnswers(
                        this.findIdByText(item, "Yes")
                      )}
                      className=""
                      key={item.question.id}
                      value={this.findIdByText(item, "Yes")}
                      onChange={(e: any) => {
                        let id = this.findIdByText(item, "Yes");
                        if (e.target.checked) {
                          let otherId = this.getOtherAnswerId(item, id);
                          this.findSameQuestionAnswer(otherId ? otherId : "");
                          this.exceptionAnswers.answers.push(id);
                          this.forceUpdate();
                        } else {
                          this.findSameQuestionAnswer(id);
                          this.forceUpdate();
                        }
                      }}
                    >
                      Yes
                  </Checkbox>
                    <Checkbox
                      checked={this.existInAnswers(this.findIdByText(item, "No"))}
                      key={item.question.id}

                      value={this.findIdByText(item, "No")}
                      onChange={(e: any) => {
                        let id = this.findIdByText(item, "No");
                        if (e.target.checked) {
                          let otherId = this.getOtherAnswerId(item, id);
                          this.findSameQuestionAnswer(otherId ? otherId : "");
                          this.exceptionAnswers.answers.push(id);
                          this.forceUpdate();
                        } else {
                          this.findSameQuestionAnswer(id);
                          this.forceUpdate();
                        }
                      }}
                    >
                      No
                  </Checkbox>
                  </div>
                </div>
              </div>
            );
          }
        )}

        <hr />
        <div className="row float-right">
          <Button
            type="primary"
            disabled={
              this.props.listOfQuestionsAndAnswers.data.length ===
                this.exceptionAnswers.answers.length
                ? false
                : true
            }
            onClick={() => {
              this.props.onSave(this.exceptionAnswers);
            }}
          >
            Save Answers
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

export default connect(mapStateToProps, {})(QuestionsCheckForm);
