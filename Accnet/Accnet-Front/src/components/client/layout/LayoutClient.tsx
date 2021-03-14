// ======================================= modules
import React, { Component } from "react";

// ======================================= component

import Layout from "../../layout";
import Sidebar from "./side-menu/sideBar";
import SelectBar from "./select-bar/SelectBar";
import Header from "./header/Header";
import { dashboard_Type } from "../../../service/constants/defaultValues";

interface PropsType {
  path: string;
  name: string;
  selectBar: boolean;
}
export default class LayoutClient extends Component<PropsType> {
  render() {
    const { children, name, selectBar } = this.props;
    return (
      <Layout>
        <section className="container-fluid px-0 dashboard-wrapper">
          <Sidebar page={name} />
          <div className="page-content">
            <header className="header">
              <div className="container">
                <Header page={name} />
                {selectBar ? <SelectBar page={name} /> : null}
              </div>
            </header>
            {children}
          </div>
        </section>
      </Layout>
    );
  }
}
