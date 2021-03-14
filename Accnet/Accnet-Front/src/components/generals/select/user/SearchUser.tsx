import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../redux-logic/Store";
import { userSearch } from "../../../../redux-logic/user/Action";
import { UserModel } from "../../../../redux-logic/user/Type";
import Select from "antd/lib/select";
import { PaginationRequestBody } from "../../../../redux-logic/essentials-tools/type/Request-type";
import { ApplicationListResponse } from "../../../../redux-logic/essentials-tools/type/Response-type";

interface PropType {
  userSearch: Function;
  userResponse: ApplicationListResponse;
  value: string;
  onChange: Function;
}

class SearchUser extends Component<PropType> {
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
        placeholder="Search by mobile, email"
        className="select-component w-100"
        notFoundContent={null}
        value={value === "" ? undefined : value}
        loading={userResponse.selectLoading}
        onChange={(event: string) => {
          onChange(JSON.parse(event));
        }}
        onSearch={(keyword: string) => {
          if (keyword.length > 1) {
            this.props.userSearch({ keyword });
          }
        }}
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

const mapDispatchToProps = { userSearch };

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);
