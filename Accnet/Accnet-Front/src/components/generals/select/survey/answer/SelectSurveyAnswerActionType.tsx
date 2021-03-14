import React, { Component } from "react";
import Select from "antd/lib/select";
import {
  SurveyActionTypeObject,
  SurveyActionTypeModel,
} from "../../../../../redux-logic/survey/Type";

interface PropType {
  value: SurveyActionTypeModel;
  onChange: Function;
}

class SelectSurveyAnswerActionType extends Component<PropType> {
  render() {
    const { Option } = Select;
    const { value, onChange } = this.props;
    return (
      <Select
        showSearch
        placeholder="Select action type"
        optionFilterProp="children"
        className="select-component w-100"
        notFoundContent={null}
        value={SurveyActionTypeObject[value]}
        onChange={(event: string) => {
          if (event.includes(SurveyActionTypeObject[1])) {
            onChange(1);
          }
          if (event.includes(SurveyActionTypeObject[2])) {
            onChange(2);
          }
          if (event.includes(SurveyActionTypeObject[3])) {
            onChange(3);
          }
          if (event.includes(SurveyActionTypeObject[4])) {
            onChange(4);
          }
          if (event.includes(SurveyActionTypeObject[5])) {
            onChange(5);
          }
          if (event.includes(SurveyActionTypeObject[6])) {
            onChange(6);
          }
          if (event.includes(SurveyActionTypeObject[7])) {
            onChange(7);
          }
          if (event.includes(SurveyActionTypeObject[8])) {
            onChange(8);
          }
        }}
        filterOption
      >
        <Option key={SurveyActionTypeObject[1]}>
          {SurveyActionTypeObject[1]}
        </Option>
        <Option key={SurveyActionTypeObject[2]}>
          {SurveyActionTypeObject[2]}
        </Option>
        <Option key={SurveyActionTypeObject[3]}>
          {SurveyActionTypeObject[3]}
        </Option>
        <Option key={SurveyActionTypeObject[4]}>
          {SurveyActionTypeObject[4]}
        </Option>
        <Option key={SurveyActionTypeObject[5]}>
          {SurveyActionTypeObject[5]}
        </Option>
        <Option key={SurveyActionTypeObject[6]}>
          {SurveyActionTypeObject[6]}
        </Option>
        <Option key={SurveyActionTypeObject[7]}>
          {SurveyActionTypeObject[7]}
        </Option>
        <Option key={SurveyActionTypeObject[8]}>
          {SurveyActionTypeObject[8]}
        </Option>
      </Select>
    );
  }
}

export default SelectSurveyAnswerActionType;
