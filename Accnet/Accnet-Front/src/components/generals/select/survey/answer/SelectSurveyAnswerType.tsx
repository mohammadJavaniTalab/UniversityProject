import React, { Component } from "react";
import Select from "antd/lib/select";
import {
  SurveyAnswerTypeObject,
  SurveyAnswerTypeModel
} from "../../../../../redux-logic/survey/Type";

interface PropType {
  value: SurveyAnswerTypeModel;
  onChange: Function;
}

class SelectSurveyAnswerType extends Component<PropType> {
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
        value={SurveyAnswerTypeObject[value]}
        onChange={(event: string) => {
          if (event.includes(SurveyAnswerTypeObject[1])) {
            onChange(1);
          }
          if (event.includes(SurveyAnswerTypeObject[2])) {
            onChange(2);
          }
          if (event.includes(SurveyAnswerTypeObject[3])) {
            onChange(3);
          }
          if (event.includes(SurveyAnswerTypeObject[4])) {
            onChange(4);
          }
        }}
        filterOption
      >
        <Option key={SurveyAnswerTypeObject[1]}>
          {SurveyAnswerTypeObject[1]}
        </Option>
        <Option key={SurveyAnswerTypeObject[2]}>
          {SurveyAnswerTypeObject[2]}
        </Option>
        <Option key={SurveyAnswerTypeObject[3]}>
          {SurveyAnswerTypeObject[3]}
        </Option>
        <Option key={SurveyAnswerTypeObject[4]}>
          {SurveyAnswerTypeObject[4]}
        </Option>
      </Select>
    );
  }
}

export default SelectSurveyAnswerType;
