// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "antd/lib/select";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";
import { TicketPriorityType, ticketPriorityObject } from "../../../../redux-logic/ticket/Type";

// ====================================================
interface PropType {
  value: TicketPriorityType;
  onChange: Function;
}

class SelectPriorityTicket extends Component<PropType> {
  render() {
    const { Option } = Select;
    const { value, onChange } = this.props;
    return (
      <Select
        value={ticketPriorityObject[value]}
        onChange={(e: string) => {
          if (ticketPriorityObject[1] === e) {
            onChange(1);
          }
          if (ticketPriorityObject[2] === e) {
            onChange(2);
          }
          if (ticketPriorityObject[3] === e) {
            onChange(3);
          }
        }}
        className="w-100"
        placeholder="Select ticket priority "
      >
        <Option key={ticketPriorityObject[1]}>
          {ticketPriorityObject[1]}
        </Option>
        <Option key={ticketPriorityObject[2]}>
          {ticketPriorityObject[2]}
        </Option>
        <Option key={ticketPriorityObject[3]}>
          {ticketPriorityObject[3]}
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
)(SelectPriorityTicket);
