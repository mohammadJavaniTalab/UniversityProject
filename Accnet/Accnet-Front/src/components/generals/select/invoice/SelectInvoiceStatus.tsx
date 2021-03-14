// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "antd/lib/select";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";
import {
  InvoiceStatusType,
  invoiceStatusObject
} from "../../../../redux-logic/invoice/Type";

// ====================================================
interface PropType {
  value: InvoiceStatusType;
  onChange: Function;
}

class SelectInvoiceStatus extends Component<PropType> {
  render() {
    const { Option } = Select;
    const { value, onChange } = this.props;
    return (
      <Select
        value={invoiceStatusObject[value]}
        onChange={(e: string) => {
          if (invoiceStatusObject[1] === e) {
            onChange(1);
          }
          if (invoiceStatusObject[2] === e) {
            onChange(2);
          }
          if (invoiceStatusObject[3] === e) {
            onChange(3);
          }
        }}
        className="w-100"
      >
        <Option key={invoiceStatusObject[1]}>{invoiceStatusObject[1]}</Option>
        <Option key={invoiceStatusObject[2]}>{invoiceStatusObject[2]}</Option>
        <Option key={invoiceStatusObject[3]}>{invoiceStatusObject[3]}</Option>
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
)(SelectInvoiceStatus);
