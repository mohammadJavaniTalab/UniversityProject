// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "antd/lib/select";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";

// ====================================================
interface PropType {
  value: string;
  onChange: Function;
}

class SelectGender extends Component<PropType> {
  render() {
    const { Option } = Select;
    const { value, onChange } = this.props;
    return (
      <Select
        value={value}
        className="w-100"
        placeholder="Select gender"
        onChange={(event: string) => {
          onChange(event);
        }}
      >
        <Option value="Mr">Mr</Option>
        <Option value="Mrs">Mrs</Option>
        <Option value="Ms">Ms</Option>
        <Option value="Miss">Miss</Option>
        <Option value="Unknown">Unknown</Option>
      </Select>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SelectGender);
