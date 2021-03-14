// ======================================= module
import React, { Component, Fragment } from "react";
import Modal from "antd/lib/modal";

// ======================================= component
import UserSurveyList from "./UserSurveyList";
import UserSurveyQuestion from "./UserSurveyQuestion";
import Consultant from "../../../consultant/Consultant";

// ======================================= redux
import { UserSelectSurvey } from "../../../../redux-logic/user-survey/Type";

// ======================================= css
import "./styles.scss";

interface PropsType {
  visible: boolean;
  onVisible: Function;
  closeAble: boolean;
}

export default class CalculateMyTaxes extends Component<PropsType> {
  selectSurvey: UserSelectSurvey = "LIST";
  consultantVisible: boolean = false;

  consultantVisibleOnChange = () => {
    this.consultantVisible = !this.consultantVisible;
    this.forceUpdate();
  };

  showModalCloseIcon : boolean = this.props.closeAble

  render() {
    const { visible, onVisible } = this.props;
    return (
      <Fragment>
        <Consultant
        showMessageBox={false}
        isSurveyRelated={true}
          visible={this.consultantVisible}
          onVisible={this.consultantVisibleOnChange}
          closeAble={false}
          type="CLIENT"
          current_step={"Set Consultation Details"}
        />
        <Modal
          title={null}
          className="calculate-my-taxes"
          maskClosable={false}
          destroyOnClose
          visible={visible}
          footer={null}
          closable={this.showModalCloseIcon}
          onCancel={() => {
            const self = this;
            Modal.confirm({
              title: "You Can Continue Filling Your Survey At Any Time!",
              okText: "Ok Close!",
              cancelText: "Continue Survey",
              onOk() {
                self.selectSurvey = "LIST";
                onVisible();
              },
              onCancel() {},
            });
          }}
        >
          <Fragment>
            {this.selectSurvey === "LIST" ? (
              <UserSurveyList
                onVisible={onVisible}
                onChange={() => {
                  this.selectSurvey = "QUESTIONS";
                  this.forceUpdate();
                }}
              />
            ) : null}
            {this.selectSurvey === "QUESTIONS" ? (
              <UserSurveyQuestion
                selectSurvey={this.selectSurvey}
                consultantVisibleOnChange={this.consultantVisibleOnChange}
                onVisible={() => {
                  this.selectSurvey = "LIST";
                  onVisible();
                }}
                onRemoveCloseIcon={() => {
                  if (this.showModalCloseIcon){
                    this.showModalCloseIcon = false
                    this.forceUpdate()
                  }
                }}
                
              />
            ) : null}
          </Fragment>
        </Modal>
      </Fragment>
    );
  }
}

