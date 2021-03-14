import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../redux-logic/Store";
import { Link, navigate } from "gatsby";
import { pages, SideBarPages } from "./ManagementPages";
import { Tooltip } from "antd";
import AllImages from "../../../../assets/images/images";

interface PropsType {
  page: string;
}
class SideBar extends Component<PropsType> {
  render() {
    return (
      <nav className="vertical-aside">
        <ul className="side-menu">
          <li>
            <span className="side-link cursor-pointer">
              <img
                src={AllImages.icon.home}
                className="w-100 h-auto"
                alt="accnet logo"
              />
            </span>
          </li>
          {pages.map((page: SideBarPages, index: number) => (
            <li
              onClick={() => navigate(page.path)}
              className={page.path === this.props.page ? "active-item" : ""}
              key={`${JSON.stringify(page)}${index}`}
            >
              <span className="side-link cursor-pointer">
                <i className={page.icon}></i>

                <label className="d-block">
                  {page.name}
                  <br />
                  {page.subName}
                </label>
              </span>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
