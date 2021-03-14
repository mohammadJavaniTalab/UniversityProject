import React, { Component, Fragment } from "react";
import Modal from "antd/lib/modal";
import { CrudObject } from "../../../../redux-logic/essentials-tools/type/Basic-Object-type";
import {
  MessageModel,
  messagePriorityObject
} from "../../../../redux-logic/message/Type";
import { checkFieldIsOk, getTimeAndDate } from "../../../../service/public";

interface MessageDetailsValue extends CrudObject {
  value: MessageModel;
}

interface PropsType {
  value: MessageDetailsValue;
  onChange: Function;
}

export default class MessageDetails extends Component<PropsType> {
  renderDetail = () => {
    const {
      value: { value }
    } = this.props;
    return (
      <Fragment>
        <div>
          {messagePriorityObject[value.priority] === "High" ? (
            <small className="text-danger">Important</small>
          ) : null}
          {messagePriorityObject[value.priority] === "Low" ? (
            <small className="text-primary">Regular Message</small>
          ) : null}
          <small className="float-right text-muted">
            ( {getTimeAndDate(value.creationDate, "DATE")} )
          </small>
        </div>
        <div className="my-1">
          <span className="h">
            <b>From : </b>
            <span>
              {checkFieldIsOk(value.fromUser) ? value.fromUser.username : ""}
            </span>
          </span>
        </div>
        <div className="my-1">
          <b>Subject : </b>
          <span>{value.title}</span>
        </div>
        <div className="my-1">
          <span>{value.body}</span>
        </div>
      </Fragment>
    );
  };

  render() {
    const { value, onChange } = this.props;
    return (
      <Modal
        title="Message Details"
        className="message-details"
        maskClosable={false}
        destroyOnClose
        visible={value.visible}
        footer={null}
        onCancel={() => {
          const update = { ...value, visible: false };
          onChange(update);
        }}
      >
        {value.visible ? this.renderDetail() : null}
      </Modal>
    );
  }
}
