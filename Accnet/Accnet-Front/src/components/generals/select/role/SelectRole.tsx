// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "antd/lib/select";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";
import { roleList } from "../../../../redux-logic/role/Action";
import { PaginationRequestBody } from "../../../../redux-logic/essentials-tools/type/Request-type";
import { RoleModel, RoleListResponse } from "../../../../redux-logic/role/Type";

// ====================================================
interface PropType {
  roleList: Function;
  roleResponse: RoleListResponse;
  value: string;
  onChange: Function;
}

class SelectRole extends Component<PropType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 100
  };
  render() {
    const { Option } = Select;
    const { roleResponse, value, onChange } = this.props;
    return (
      <Select
        showSearch
        placeholder="Select role"
        optionFilterProp="children"
        className="select-component w-100"
        notFoundContent={null}
        value={value === "" ? undefined : value}
        loading={roleResponse.selectLoading}
        onChange={(event: string) => {
          onChange(JSON.parse(event));
        }}
        onFocus={() => this.props.roleList(this.requestBody)}
        onBlur={() => {}}
        onSearch={() => {}}
        filterOption
      >
        {roleResponse.items.map((role: RoleModel) => (
          <Option key={`${JSON.stringify(role)}`}>{role.name}</Option>
        ))}
      </Select>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    roleResponse: state.roleReducer
  };
}

const mapDispatchToProps = { roleList };

export default connect(mapStateToProps, mapDispatchToProps)(SelectRole);
