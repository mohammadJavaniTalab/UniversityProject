// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "antd/lib/select";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";
import { featureList } from "../../../../redux-logic/feature/Action";
import { PaginationRequestBody } from "../../../../redux-logic/essentials-tools/type/Request-type";
import { FeatureModel} from "../../../../redux-logic/feature/Type";
import { ApplicationListResponse } from "../../../../redux-logic/essentials-tools/type/Response-type";

// ====================================================
interface PropType {
  featureList: Function;
  featureResponse: ApplicationListResponse;
  value: string;
  onChange: Function;
}

class SelectFeature extends Component<PropType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };
  render() {
    const { Option } = Select;
    const { featureResponse , value , onChange} = this.props;
    return (
      <Select
        showSearch
        placeholder="Select feature"
        optionFilterProp="children"
        className="select-component w-100"
        notFoundContent={null}
        value={value === "" ?  undefined : value}
        loading={featureResponse.selectLoading}
        onChange={(event: string) => { 
          onChange(JSON.parse(event))
        }}
        onFocus={() => this.props.featureList(this.requestBody)}
        onBlur={() => {}}
        onSearch={() => {}}
        filterOption
      >
        {featureResponse.items.map((feature: FeatureModel) => (
          <Option key={`${JSON.stringify(feature)}`}>{feature.name}</Option>
        ))}
      </Select>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    featureResponse: state.featureReducer
  };
}

const mapDispatchToProps = { featureList };

export default connect(mapStateToProps, mapDispatchToProps)(SelectFeature);
