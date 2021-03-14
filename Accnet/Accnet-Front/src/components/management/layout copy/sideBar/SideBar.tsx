import React, { Component } from "react";
import { Link, navigate } from "gatsby";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getWindowAfterSSR } from "../../../../service/public";
import { getActiveNav } from "../../../../service/public";

import { managementList, SidebarType } from "./SidebarArray";

interface PropsType {
  changeSideBar: Function;
}

export default class SideBar extends Component<PropsType> {
  linkToNavbar = (link: string) => {
    navigate(link);
    this.props.changeSideBar();
  };

  render() {
    const windowPathName = getWindowAfterSSR() ? window.location.pathname : "";

    return (
      <div className="sidebar">
        <div className="main-menu b-shadow">
          <div className="scroll">
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <ul className="list-unstyled nav flex-column">
                {managementList.map((data: SidebarType) => (
                  <li
                    key={`${data.icon}${data.link}`}
                    className={`nav-item ${getActiveNav(
                      windowPathName,
                      data.link
                    )}`}
                  >
                    <Link
                      to={data.link}
                      onClick={() => this.linkToNavbar(data.link)}
                    >
                      <i className={`glyph-icon ${data.icon}`}></i>
                      <span>{data.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    );
  }
}
