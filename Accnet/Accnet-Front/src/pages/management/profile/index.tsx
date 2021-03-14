// ======================================= modules
import React, { Component } from "react";

// ======================================= component
import PublicProfile from "../../../components/profile/PublicProfile";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= services
import { pathProject } from "../../../service/constants/defaultValues";

// ======================================= css
import "./styles.scss";


// =======================================================
interface PropsType {}
export default class index extends Component<PropsType> {
  render() {
    return (
      <LayoutManagement pagePath={pathProject.management.profile}>
        <PublicProfile />
      </LayoutManagement>
    );
  }
}
