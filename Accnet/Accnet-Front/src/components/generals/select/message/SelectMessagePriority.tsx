// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "antd/lib/select";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";
import {
  MessagePriorityType,
  messagePriorityObject
} from "../../../../redux-logic/message/Type";

// ====================================================
interface PropType {
  value: MessagePriorityType;
  onChange: Function;
}

class SelectMessagePriority extends Component<PropType> {
  render() {
    const { Option } = Select;
    const { value, onChange } = this.props;
    return (
      <Select
        value={messagePriorityObject[value]}
        onChange={(e: string) => {
          if (messagePriorityObject[1] === e) {
            onChange(1);
          }
          if (messagePriorityObject[2] === e) {
            onChange(2);
          }
          if (messagePriorityObject[3] === e) {
            onChange(3);
          }
        }}
        className="w-100"
      >
        <Option key={messagePriorityObject[1]}>
          {messagePriorityObject[1]}
        </Option>
        <Option key={messagePriorityObject[2]}>
          {messagePriorityObject[2]}
        </Option>
        <Option key={messagePriorityObject[3]}>
          {messagePriorityObject[3]}
        </Option>
      </Select>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectMessagePriority);
