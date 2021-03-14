import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../redux-logic/Store";
import "./styles.scss";
import { ProfileResponse } from "../../../redux-logic/auth/profile/update-profile/Type";

interface PropsType {
  profileResponse: ProfileResponse;
}
class Invoice extends Component<PropsType> {
  render() {
    const {  profileResponse } = this.props;
    return profileResponse.data.unpaidInvoices > 0 ? (
      <fieldset className="fieldset">
        <legend>Pending Invoice</legend>
        <div className="row">
          <div className="col-12 col-sm-6 text-left">
            <span className="fs-25">
              <strong>
                You have{" "}
                <span className="text-danger">
                  {profileResponse.data.unpaidInvoices}
                </span>{" "}
                unpaid Invoices
              </strong>
            </span>
          </div>
          <div className="col-12 col-sm-6 text-right">
            <button
              onClick={() => {
              }}
              className="btn btn-secondary rounded-10"
            >
              See Invoices
            </button>
          </div>
        </div>
      </fieldset>
    ) : <div style={{marginTop: "100px"}}></div>
  }
}

function mapStateToProps(state: AppState) {
  return {
    profileResponse: state.smallProfileReducer
  };
}

const mapDispatchToProps = { };
export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
