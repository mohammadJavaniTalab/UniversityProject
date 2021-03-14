import React, { Component } from "react";

interface PropsType {
  onChange: Function;
  type: string;
}
export default class ConsultationType extends Component<PropsType> {
  render() {
    const { onChange } = this.props;
    return (
      <div className="consultation-type text-center">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-sm-12 col-md-6 mb-4 mb-md-0">
              <div className="mb-2">
                <span className="h3 title">Complimentary</span>
              </div>

              <p className="min-height">
                Perfect for those clients who have simple questions and
                solutions in mind.
              </p>
              <div className="mt-3">
                <button
                  onClick={() => {
                    onChange(15);
                  }}
                  className="mb-2 btn btn-info btn-sm"
                >
                  {this.props.type !== "MANAGEMENT"
                    ? "Book Consultation"
                    : "Select"}
                </button>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="mb-2">
                <span className="h3 title">VIP</span>
              </div>
              <p className="text-cenetr">
                Spend 60 minutes with one of our experienced tax professionals,
                with individualized attention, problem-solving, and planning.
                The fee for this tax consultation is $200 (CAD) plus GST.
              </p>
              <div className="mt-3">
                <button
                  onClick={() => {
                    onChange(60);
                  }}
                  className="mb-2 btn btn-success btn-sm"
                >
                  {this.props.type !== "MANAGEMENT"
                    ? "Book Consultation"
                    : "Select"}
                </button>
              </div>
            </div>
          </div>
         
        </div>
      </div>
    );
  }
}
