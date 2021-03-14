// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";

// ======================================= component
import SurveyQuestionList from "./question/SurveyQuestionList";

// ======================================= redux
import { SurveyModel } from "../../../redux-logic/survey/Type";
import { surveyAdd } from "../../../redux-logic/survey/Action";

// ======================================= css
import "./style.scss";
import { getNotification } from "../../../service/notification";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";
import { checkFieldIsOk } from "../../../service/public";

interface PropType {
  enterSurvey: CrudObject;
  enterSurveyOnChange: Function;
  surveyAdd: Function;
}

class AddComponent extends Component<PropType> {
  enterSurvey: CrudObject = {
    visible: false,
    update: true,
    edit: false,
    value: {
      name: "",
      description: "",
      questions: [],
      enabled: false,
      id: ""
    },
    valueIndex: 0
  };

  componentDidMount = () => {
    const { enterSurvey } = this.props;
    if (enterSurvey.update) {
      this.enterSurvey.edit = enterSurvey.edit;
      this.enterSurvey.value.name = enterSurvey.value.name;
      this.enterSurvey.value.description = enterSurvey.value.description;
      this.enterSurvey.value.id = enterSurvey.value.id;
      this.enterSurvey.value.enabled = enterSurvey.value.enabled ? true : false;
      this.enterSurvey.value.questions = [...enterSurvey.value.questions];
      this.props.enterSurveyOnChange("update", false);
      this.forceUpdate();
    }
  };

  enterSurveyOnChange = (filed: "visible" | "update", value: boolean) => {
    this.enterSurvey[filed] = value;
    this.forceUpdate();
  };

  closeModal = () => {
    this.props.enterSurveyOnChange("visible", false);
  };

  checkInformation = () => {
    if (!checkFieldIsOk(this.enterSurvey.value.name)) {
      getNotification("Please enter name.");
      return;
    }
    if (!checkFieldIsOk(this.enterSurvey.value.description)) {
      getNotification("Please enter description.");
      return;
    }
    this.enterSurveyOnChange("visible", true);
  };

  render() {
    const { enterSurvey } = this.props;
    return (
      <Modal
        title={enterSurvey.edit ? "Edit survey" : "Add survey"}
        visible
        maskClosable={false}
        destroyOnClose
        footer={
          <div className="text-center">
            <button
              onClick={() => this.checkInformation()}
              className="btn btn-outline-success"
            >
              Set Questions
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <div className="container">
          <div className="row">
            <div className="col-9">
              <div className="form-group">
                <label>Name</label>
                <input
                  value={this.enterSurvey.value.name}
                  onChange={e => {
                    this.enterSurvey.value.name = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter survey name"
                />
              </div>
            </div>
            <div className="col-3" />
          </div>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={this.enterSurvey.value.description}
                  style={{ height: "120px", resize: "none" }}
                  onChange={e => {
                    this.enterSurvey.value.description = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter survey description"
                />
              </div>
            </div>
          </div>
          <div className="">
            <span>Enabled</span>
            <Switch
              className="mx-2"
              checked={this.enterSurvey.value.enabled}
              onChange={event => {
                this.enterSurvey.value.enabled = event;
                this.forceUpdate();
              }}
            />
          </div>
          <SurveyQuestionList
            enterSurvey={this.enterSurvey}
            enterSurveyOnChange={this.enterSurveyOnChange}
            closeAddSurvey={() => this.closeModal()}
          />
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}
const mapDispatchToProps = { surveyAdd };
export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
