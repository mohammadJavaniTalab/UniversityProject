import React, { Component, Fragment } from "react";
import Modal from "antd/lib/modal";
import {
  SurveyActionModel,
  SurveyActionTypeModel
} from "../../../../../redux-logic/survey/Type";
import SelectSurveyAnswerActionType from "../../../../generals/select/survey/answer/SelectSurveyAnswerActionType";

const initialize: SurveyActionModel = {
  type: 1,
  value: 0
};

interface PropType {
  visible: boolean;
  onChange: Function;
  onVisible: Function;
}

class AddComponent extends Component<PropType> {
  actionModel: SurveyActionModel = { ...initialize };

  closeModal = () => {
    this.actionModel = { ...initialize };
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title="Enter Action"
        visible={this.props.visible}
        maskClosable={false}
        destroyOnClose
        footer={null}
        onCancel={() => this.closeModal()}
      >
        <Fragment>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Action type</label>
                <div>
                  <SelectSurveyAnswerActionType
                    value={this.actionModel.type}
                    onChange={(event: SurveyActionTypeModel) => {
                      this.actionModel.type = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              {this.actionModel.type === 1 ? (
                <div className="form-group">
                  <label>Action value</label>
                  <input
                    value={this.actionModel.value}
                    onChange={e => {
                      this.actionModel.value = Number(e.target.value);
                      this.forceUpdate();
                    }}
                    type="text"
                    min="0"
                    pattern="[0-9]*"
                    maxLength={15}
                    className="form-control"
                    placeholder="Enter survey description"
                  />
                </div>
              ) : null}
            </div>
          </div>
          <hr />
          <div className="text-center">
            <button
                onClick={() => {
                  this.props.onChange(this.actionModel)
                  this.closeModal()
                }}
                className="mb-2 btn btn-success"
              >
                Add Action
              </button>
          </div>
        </Fragment>
      </Modal>
    );
  }
}

export default AddComponent;
