// ======================================= modules
import React, { Component, Fragment } from "react";

// ======================================= component
import SideBarLayout from "./sideBar/SideBarLayout";
import GlobalHeader from "./header/GlobalHeader";
import Layout from "../../layout";

export default class LayoutManagement extends Component {
  render() {
    const { children } = this.props;
    return (
      <Layout>
        <SideBarLayout>
          <Fragment>
            <GlobalHeader />
            <div className="main-content-padding"></div>
          </Fragment>
        </SideBarLayout>
      </Layout>
    );
  }
}
