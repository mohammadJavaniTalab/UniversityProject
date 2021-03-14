import React, { Component, Fragment } from "react";
import LayoutClient from "../../../components/client/layout/LayoutClient";
import Taxes from "../../../components/client/taxes/Taxes";
import "./styles.scss";
import {
  dashboard_Type,
  pathProject,
} from "../../../service/constants/defaultValues";


export default class index extends Component {
 
  render() {
    return (
      <LayoutClient
        selectBar={true}
        path={pathProject.client.taxes}
        name={dashboard_Type.taxes}
      >
        <Fragment>
          <div style={{ marginTop: "100px" }}></div>
          <article className="container mt-4">
            <Taxes />
          </article>
        </Fragment>
      </LayoutClient>
    );
  }
}