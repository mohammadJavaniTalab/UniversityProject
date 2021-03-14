import React, { Component } from "react";
import Select from "antd/lib/select";

interface PropsType {
  value: string;
  onChange: Function;
}

class SelectProvince extends Component<PropsType> {
  render() {
    const { Option } = Select;
    const { value, onChange } = this.props;
    return (
      <Select
        value={value}
        className="select-component w-100"
        onSelect={(event: string) => {
          onChange(event);
        }}
      >
        <Option key="Alberta">Alberta</Option>
        <Option key="British Columbia">British Columbia</Option>
        <Option key="Monitoba">Monitoba</Option>
        <Option key="New Brunswick">New Brunswick</Option>
        <Option key="Newfoundland & Labrador">Newfoundland & Labrador</Option>
        <Option key="Northwest Territories">Northwest Territories</Option>
        <Option key="Nova Scotia">Nova Scotia</Option>
        <Option key="Nunavut">Nunavut</Option>
        <Option key="Ontario">Ontario</Option>
        <Option key="Prince Edward Island">Prince Edward Island</Option>
        <Option key="Quebec">Quebec</Option>
        <Option key="Saskatchewan">Saskatchewan</Option>
        <Option key="Yukon">Yukon</Option>
      </Select>
    );
  }
}

export default SelectProvince;

{
  /* <Select
        value={this.requestBody.province}
        defaultValue={this.requestBody.province}
        className="select-component w-100"
        onSelect={(e: any) => {
          this.requestBody.province = e;
          this.forceUpdate();
        }}
      ></Select> */
}
