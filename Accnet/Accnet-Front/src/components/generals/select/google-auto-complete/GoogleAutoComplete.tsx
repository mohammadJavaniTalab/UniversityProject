import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../redux-logic/Store";
import { reSendGoogleAutoCompleteRequest } from "../../../../redux-logic/google/Action";
import Select from "antd/lib/select";

import {
  GoogleAutoCompleteResponse,
  GoogleAutoCompleteModel
} from "../../../../redux-logic/google/Type";

interface PropType {
  reSendGoogleAutoCompleteRequest: Function;
  googleResponse: GoogleAutoCompleteResponse;
  value: string;
  onChange: Function;
}

class GoogleAutoComplete extends Component<PropType> {
  render() {
    const { Option } = Select;
    const { googleResponse, value, onChange } = this.props;
    return (
      <Select
        showSearch
        placeholder="Search your address"
        className="select-component w-100"
        notFoundContent={null}
        value={value === "" ? undefined : value}
        loading={googleResponse.loading}
        onChange={(event: string) => {
          onChange(JSON.parse(event));
        }}
        onSearch={(Keyword: string) => {
          if (Keyword.length > 1) {
            this.props.reSendGoogleAutoCompleteRequest(Keyword);
          }
        }}
      >
        {googleResponse.data.map((address: GoogleAutoCompleteModel) => (
          <Option key={`${JSON.stringify(address)}`}>
            {address.description}
          </Option>
        ))}
      </Select>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    googleResponse: state.googleAutoCompleteReducer
  };
}

const mapDispatchToProps = { reSendGoogleAutoCompleteRequest };

export default connect(mapStateToProps, mapDispatchToProps)(GoogleAutoComplete);
