// ======================================= modules
import React, { Component } from "react";

// ======================================= component
import PublicProfile from "../../../components/profile/PublicProfile";

// ======================================= css
import "./styles.scss";
import LayoutClient from "../../../components/client/layout/LayoutClient";
import {
  pathProject,
  dashboard_Type
} from "../../../service/constants/defaultValues";

// =======================================================
interface PropsType {}
export default class index extends Component<PropsType> {
  render() {
    return (
      <LayoutClient 
        path={pathProject.client.profile}
        name={dashboard_Type.profile}
        selectBar={false}
      >
        <div className="profile-page">
          <PublicProfile /> 
        </div>
      </LayoutClient>
    );
  }
}
