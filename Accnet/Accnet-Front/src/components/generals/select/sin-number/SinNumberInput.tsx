import React, { Component } from "react";

interface PropsType {
  value: string;
  onChange: Function;
}
export default class SinNumberInput extends Component<PropsType> {
  render() {
    const { value, onChange } = this.props;

    return (
      <input
        type="text"
        value={value}
        onChange={e => {
          if (e.target.validity.valid) {
            onChange(e.target.value);
          }
        }}
        pattern="[0-9]*"
        className="form-control"
        placeholder="Enter SIN"
        maxLength={9}
      />
    );
  }
}
