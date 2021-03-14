import React, { Component, Fragment } from "react";
import LayoutClient from "../../../components/client/layout/LayoutClient";
import PaidInvoice from "../../../components/client/paid-invoice/PaidInvoice";
import "./styles.scss";
import {
  dashboard_Type,
  pathProject
} from "../../../service/constants/defaultValues";

export default class index extends Component {
  render() {
    return (
      <LayoutClient
        path={pathProject.client.invoice}
        name={dashboard_Type.invoice}
        selectBar={true}
      >
        <Fragment>
          <div style={{ marginTop: "100px" }}></div>
          <article className="container mt-4">
            <PaidInvoice />   
          </article> 
        </Fragment>
      </LayoutClient> 
    );
  }
}
