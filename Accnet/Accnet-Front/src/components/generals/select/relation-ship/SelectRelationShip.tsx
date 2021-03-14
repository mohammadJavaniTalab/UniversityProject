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
  isAbove19: boolean;
}

class SelectRelationShip extends Component<PropType> {
  render() {
    const { Option } = Select;
    const { value, onChange } = this.props;
    return (
      <div>
        {this.props.isAbove19 ? (
          <Select
            value={value}
            className="w-100"
            placeholder="Select relationship"
            onChange={(event: string) => {
              onChange(event);
            }}
          >
            <Option value="Daughter">Daughter</Option>
            <Option value="Son">Son</Option>
            <Option value="Grand Parent">Grand Parent</Option>
            <Option value="Grand Child">Grand Child</Option>
            <Option value="Aunt">Aunt</Option>
            <Option value="Brother">Brother</Option>
            <Option value="Child">Child</Option>
            <Option value="Nephew">Nephew</Option>
            <Option value="Niece">Niece</Option>
            <Option value="Parent">Parent</Option>
            <Option value="Sister">Sister</Option>
            <Option value="Uncle">Uncle</Option>
          </Select>
        ) : (
          <Select
            value={value}
            className="w-100"
            placeholder="Select relationship"
            onChange={(event: string) => {
              onChange(event);
            }}
          >
            <Option value="Daughter">Daughter</Option>
            <Option value="Son">Son</Option>

            <Option value="Grand Child">Grand Child</Option>
            <Option value="Aunt">Aunt</Option>
            <Option value="Brother">Brother</Option>
            <Option value="Child">Child</Option>
            <Option value="Nephew">Nephew</Option>
            <Option value="Niece">Niece</Option>

            <Option value="Sister">Sister</Option>
            <Option value="Uncle">Uncle</Option>
          </Select>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SelectRelationShip);
