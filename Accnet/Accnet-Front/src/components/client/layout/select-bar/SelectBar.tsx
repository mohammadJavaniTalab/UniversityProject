// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Badge from "antd/lib/badge";

// ======================================= modules
import { AppState } from "../../../../redux-logic/Store";
import Consultant from "../../../consultant/Consultant";
import { ProfileResponse } from "../../../../redux-logic/auth/profile/Type";
import {
  dashboard_Type,
  pathProject,
} from "../../../../service/constants/defaultValues";
import { navigate } from "gatsby";
import AllImages from "../../../../assets/images/images";

// =================================================

interface PropsType {
  profileResponse: ProfileResponse;
  page: string;
}
class SelectBar extends Component<PropsType> {
  visible: boolean = false;

  onVisible = () => {
    this.visible = !this.visible;
    this.forceUpdate();
  };

  render() {
    const { profileResponse, page } = this.props;
    return (
      <div className="top-items">
        <div className="row">
          <div className="col-12">
            <div className="float-left t-sm-center full-width">
              <Badge
                offset={[-5, -3]}
                count={profileResponse.data.uncheckedTaxes}
              >
                <div
                  onClick={() => navigate(pathProject.client.taxes)}
                  className={`card custom-card 
                    ${page === dashboard_Type.taxes ? "active" : ""}
                    cursor-pointer
                    `}
                >
                  <div className="card-body">
                    <span className="fas fa-file-contract icon mb-3" />
                    <div className="clearfix">Taxes</div>
                  </div>
                </div>
              </Badge>
              <Badge
                offset={[-5, -3]}
                count={profileResponse.data.unpaidInvoices}
              >
                <div
                  onClick={() => navigate(pathProject.client.invoice)}
                  className={`card custom-card ${
                    page === dashboard_Type.invoice ? "active" : ""
                  } cursor-pointer`}
                >
                  <div className="card-body">
                    <span className="fas fa-file-invoice-dollar icon mb-3" />
                    <div className="clearfix">Invoices</div>
                  </div>
                </div>
              </Badge>
              <Badge
                offset={[-5, -3]}
                count={profileResponse.data.unreadMessages}
              >
                <div
                  onClick={() => navigate(pathProject.client.message)}
                  className={`card custom-card ${
                    page === dashboard_Type.message ? "active" : ""
                  } cursor-pointer`}
                >
                  <div className="card-body">
                    <span className="fa fa-comment icon mb-3"></span>
                    <div className="clearfix">Messages</div>
                  </div>
                </div>
              </Badge>
              <Badge
                offset={[-5, -3]}
                count={profileResponse.data.uncheckedRequestLinks}
              >
                <div
                  onClick={() => navigate(pathProject.client.link_account)}
                  className={`card custom-card ${
                    page === dashboard_Type.link_account ? "active" : ""
                  } cursor-pointer`}
                >
                  <div className="card-body">
                    <span className="fa fa-link icon mb-3"></span>
                    <div className="clearfix">Link Account</div>
                  </div>
                </div>
              </Badge>
            </div>

            <div className="float-right position-1 full-width t-sm-center appointment-time">
              <div
                onClick={this.onVisible}
                className="card custom-card-1 cursor-pointer"
              >
                <div className="card-body">
                  <img
                    src={AllImages.icon.appointment}
                    style={{ width: 30, height: "auto", marginTop: "-5px" }}
                  />
                </div>
                <div
                  className="text-center"
                  style={{ marginTop: "-15px", marginBottom: "8px" }}
                >
                  <span>Consultation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Consultant
          isSurveyRelated={false}
          showMessageBox={true}
          visible={this.visible}
          onVisible={this.onVisible}
          closeAble={true}
          type="CLIENT"
          current_step={null}
        />
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    profileResponse: state.smallProfileReducer,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SelectBar);
