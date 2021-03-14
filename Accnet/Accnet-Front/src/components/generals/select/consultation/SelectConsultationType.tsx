// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "antd/lib/select";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";
import { AppointmentTypeModel } from "../../../../redux-logic/appointment/Type";

// ====================================================
interface PropType {
  value: string;
  onChange: Function;
}

class SelectConsultationType extends Component<PropType> {
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
        <Option value="FaceTime Video Call">FaceTime Video Call</Option>
        <Option value="FaceTime Audio Call">FaceTime Audio Call</Option>
        <Option value="Skype">Skype</Option>
        <Option value="Regular Phone Call">Regular Phone Call</Option>
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
)(SelectConsultationType);
