// ======================================= module
import React, { Component, Fragment } from "react";
import Modal from "antd/lib/modal";
import Empty from "antd/lib/empty";
import {
  SurveyAnswerModel,
  SurveyActionModel,
  SurveyActionTypeObject,
  SurveyAnswerTypeModel
} from "../../../../redux-logic/survey/Type";
import SurveyAction from "./action/SurveyAction";
import SelectSurveyAnswerType from "../../../generals/select/survey/answer/SelectSurveyAnswerType";
import { getNotification } from "../../../../service/notification";
import { CrudObject } from "../../../../redux-logic/essentials-tools/type/Basic-Object-type";

const initialize: SurveyAnswerModel = {
  type: 1,
  number: 0, 
  text: "",
  actions: [],
  id : ""
};

interface PropType {
  enterAnswer: CrudObject;
  enterAnswerOnChange: Function;
  onChange: Function;
}

class AddComponent extends Component<PropType> {
  answerModel: SurveyAnswerModel = { ...initialize };
  visible: boolean = false;
  actionIndex: number = 0;

  onVisible = () => {
    this.visible = !this.visible;
    this.forceUpdate();
  };

  componentDidUpdate = () => {
    const { enterAnswer, enterAnswerOnChange } = this.props;
    if (enterAnswer.visible && enterAnswer.update) {
      this.answerModel.type = enterAnswer.value.type;
      this.answerModel.number = enterAnswer.value.number;
      this.answerModel.text = enterAnswer.value.text;
      this.answerModel.actions = [...enterAnswer.value.actions];
      enterAnswerOnChange("update", false);
    }
  };

  checkAnswer = () => {
    if (this.answerModel.type === 1 && this.answerModel.text === "") {
      getNotification("Please enter text.");
      return;
    }
    this.props.onChange(this.answerModel);
    this.closeModal();
  };

  closeModal = () => {
    const { enterAnswerOnChange } = this.props;
    enterAnswerOnChange("visible", false);
    this.answerModel = { ...initialize, actions: [] };
    this.forceUpdate();
  };

  render() {
    const { enterAnswer } = this.props;
    return (
      <Modal 
        title="Enter Answer"
        visible={enterAnswer.visible}
        maskClosable={false}
        destroyOnClose
        footer={
          <div className="text-right">
            <button
              onClick={() => this.checkAnswer()}
              className="btn btn-success btn-xs"
            >
              {enterAnswer.edit ? "Edit Answer" : "Add Answer"}
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <Fragment>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Answer</label>
                <input
                  value={this.answerModel.text}
                  onChange={e => {
                    this.answerModel.text = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter answer"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Answer type</label>
                <div>
                  <SelectSurveyAnswerType
                    value={this.answerModel.type}
                    onChange={(event: SurveyAnswerTypeModel) => {
                      this.answerModel.type = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            {this.answerModel.actions.length < 4 ? (
              <button
                onClick={() => this.onVisible()}
                className="btn btn-success btn-xs"
              >
                Add Action
              </button>
            ) : null}
          </div>
          <div className="text-center">
            <table className="table mt-2">
              <thead>
                <tr>
                  <th scope="col">ORDER</th>
                  <th scope="col">VALUE</th>
                  <th scope="col">TYPE</th>
                  <th scope="col">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {this.answerModel.actions.map(
                  (action: SurveyActionModel, index: number) => (
                    <tr key={`${JSON.stringify(action)}${index}`}>
                      <td>{Number(index) + 1}</td>
                      <td>{action.value}</td>
                      <td>{SurveyActionTypeObject[action.type]}</td>
                      <td>
                        <button
                          className="btn-icon glyph-icon simple-icon-trash"
                          onClick={() => {
                            this.answerModel.actions.splice(index, 1);
                            this.forceUpdate();
                          }}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            {this.answerModel.actions.length === 0 ? (
              <div className="text-center">
                <Empty
                  description={<span>No Action Set yet.</span>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : null}
          </div>
          <SurveyAction
            visible={this.visible}
            onVisible={() => {
              this.onVisible();
            }}
            onChange={(event: SurveyActionModel) => {
              this.answerModel.actions.push(event);
              this.forceUpdate();
            }}
          />
        </Fragment>
      </Modal>
    );
  }
}

export default AddComponent;
