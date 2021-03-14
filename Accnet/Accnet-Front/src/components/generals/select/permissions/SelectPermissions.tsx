import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../redux-logic/Store";
import { permissionList } from "../../../../redux-logic/permission/Action";
import Select from "antd/lib/select";
import { PaginationRequestBody } from "../../../../redux-logic/essentials-tools/type/Request-type";
import {
  PermissionListResponse,
  PermissionModel
} from "../../../../redux-logic/permission/Type";

interface PropType {
  permissionList: Function;
  permissionResponse: PermissionListResponse;
  value: string;
  onChange: Function;
}

class SelectPermissions extends Component<PropType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };
  
  render() {
    const { Option } = Select;
    const { permissionResponse, value, onChange } = this.props;
    return (
      <Select
        showSearch
        placeholder="Select permissions"
        optionFilterProp="children"
        className="select-component w-100"
        notFoundContent={null}
        value={value === "" ? undefined : value}
        loading={permissionResponse.selectLoading}
        onChange={(event: string) => {
          onChange(JSON.parse(event));
        }}
        onFocus={() => this.props.permissionList(this.requestBody)}
        filterOption
      >
        {permissionResponse.items.map((permission: PermissionModel) => (
          <Option key={`${JSON.stringify(permission)}`}>{permission.name}</Option>
        ))}
      </Select>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    permissionResponse: state.permissionReducer
  };
}

const mapDispatchToProps = { permissionList };

export default connect(mapStateToProps, mapDispatchToProps)(SelectPermissions);
