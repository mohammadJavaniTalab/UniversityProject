import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../redux-logic/Store";
import { navigate } from "gatsby";
import Tooltip from "antd/lib/tooltip";
import {
  pathProject,
  dashboard_Type,
} from "../../../../service/constants/defaultValues";
import AllImages from "../../../../assets/images/images";

interface PropsType {
  page: string;
}
class sideBar extends Component<PropsType> {
  render() {
    const { page } = this.props;
    return (
      <nav className="vertical-aside">
        <ul className="side-menu">
          <li>
            <span className="side-link">
              <img
                src={AllImages.icon.home}
                className="w-100 h-auto"
                alt="accnet logo"
              />
            </span>
          </li>
          <li
            onClick={() => navigate(pathProject.client.taxes)}
            className={page === dashboard_Type.taxes ? "active-item" : ""}
          >
            <span className="side-link cursor-pointer">
              <i className="fa fa-home d-block"></i>
             <label>Home</label>
            </span>
          </li>
          <li
            onClick={() => {
              navigate(pathProject.client.messages);
            }}
            className={page === dashboard_Type.messages ? "active-item" : ""}
          >
            <span className="side-link cursor-pointer">
              <i className="fa fa-comment-alt d-block"></i>
               <label>Messages</label>
            </span>
          </li>
          <li
            onClick={() => {
              navigate(pathProject.client.ticket);
            }}
            className={page === dashboard_Type.ticket ? "active-item" : ""}
          >
            <span className="side-link cursor-pointer">
              <i className="fas fa-headset d-block"></i>
               <label>Support</label>
            </span>
          </li>
          {/* <li
            onClick={() => {
              navigate(pathProject.client.link_account);
            }}
            className={page === dashboard_Type.accept_user ? "active-item" : ""}
          >
            <span className="side-link cursor-pointer">
              <span className="fa fa-link icon"></span>
            </span>
            <span className="d-block">Link</span>
            <span className="d-block">Account</span>
          </li> */}
          {/* <li
            onClick={() => {
              navigate(pathProject.client.survey_history);
            }}
            className={
              page === dashboard_Type.survey_history ? "active-item" : ""
            }
          >
            <span className="side-link cursor-pointer">
              <span className="fas fa-poll"></span>
            </span>
            <span className="d-block">Survey</span>
            <span className="d-block">History</span>
          </li> */}
        </ul>
      </nav>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(sideBar);
