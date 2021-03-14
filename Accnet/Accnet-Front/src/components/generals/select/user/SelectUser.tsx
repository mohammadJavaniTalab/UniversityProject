import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../redux-logic/Store";
import { userList } from "../../../../redux-logic/user/Action";
import { UserModel } from "../../../../redux-logic/user/Type";
import Select from "antd/lib/select";
import { PaginationRequestBody } from "../../../../redux-logic/essentials-tools/type/Request-type";
import { ApplicationListResponse } from "../../../../redux-logic/essentials-tools/type/Response-type";

interface PropType {
  userList: Function;
  userResponse: ApplicationListResponse;
  value: string;
  onChange: Function;
}

class SelectUser extends Component<PropType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
    Keyword: ""
  };
  render() {
    const { Option } = Select;
    const { userResponse, value, onChange } = this.props;
    return (
      <Select
        showSearch
        placeholder="Search by user name , mobile, email"
        optionFilterProp="children"
        className="select-component w-100"
        notFoundContent={null}
        value={value === "" ? undefined : value}
        loading={userResponse.selectLoading}
        onChange={(event: string) => {
          onChange(JSON.parse(event));
        }}
        onSearch={(Keyword: string) => {
          if (Keyword.length > 1) {
            this.props.userList({ ...this.requestBody, Keyword });
          }
        }}
        filterOption
      >
        {userResponse.items.map((user: UserModel) => (
          <Option key={`${JSON.stringify(user)}`}>{user.username}</Option>
        ))}
      </Select>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    userResponse: state.userReducer
  };
}

const mapDispatchToProps = { userList };

export default connect(mapStateToProps, mapDispatchToProps)(SelectUser);
