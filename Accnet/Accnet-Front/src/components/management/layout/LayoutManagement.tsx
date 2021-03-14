// ======================================= modules
import React, { Component, Fragment } from "react";

// ======================================= component

import Layout from "../../layout";
import Sidebar from "./sideBar/SideBar";
import Header from "./header/Header";

interface PropsType {
  pagePath: string;
}
export default class LayoutManagement extends Component<PropsType> {
  render() {
    const { children } = this.props;
    return (
      <Layout>
        <section className="container-fluid px-0 dashboard-wrapper">
          <Sidebar page={this.props.pagePath} />
          <div className="page-content">
            <header className="header">
              <div className="container  pb-3">
                <Header page={this.props.pagePath}/>
              </div>
            </header>
            <div className="container pt-2">{children}</div>
          </div>
        </section>
      </Layout>
    );
  }
}
