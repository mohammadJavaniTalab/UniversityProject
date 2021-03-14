// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "gatsby";

// ======================================= component
import Profile from "../../profile/Profile";

// ======================================= redux
import { AppState } from "../../../../redux-logic/Store";
import { changeSideBar } from "../../../../redux-logic/management/sidebar/Action";
import AllImages from "../../../../assets/images/images";
import { getWindowAfterSSR } from "../../../../service/public";

// ========================================================
interface PropsType {
  changeSideBar: any;
  setting: any;
}

class GlobalHeader extends Component<PropsType> {
  changeSideBar = () => {
    const {
      setting: { sideBar }
    } = this.props;
    this.props.changeSideBar(sideBar);
  };

  render() {
    return (
      <nav className="navbar fixed-top main-nav">
       <div className="d-flex a-i-center w-100">
        <div className="col-4">
          <div className="d-flex align-items-center navbar-left">
            <div className="d-inline-block menu-button d-none d-md-block text-left">
              <i
                onClick={this.changeSideBar}
                className="glyph-icon simple-icon-list cursor-pointer h5"
              />
            </div>
            <div className="d-inline-block"></div>
          </div>
        </div>
        <div className="col-4 px-0">
          <a
            className="navbar-logo"
            onClick={(event: any) => {
              if (getWindowAfterSSR()) {
                window.location.href = "/";
              }
            }}
          >
            <span className="d-xs-block text-center">
              <img
                src={AllImages.logo}
                alt="accnet logo"
                style={{ width: "auto", height: "20px" }}
              />
            </span>
          </a>
        </div>
        <div className="col-4">
          <div className="navbar-right">
            <Profile />
          </div>
        </div>
     </div>
      </nav>
    );
  }
}

function mapStateToProps(state: AppState) {
  return { setting: state.tikbedSetting };
}

const mapDispatchToProps = { changeSideBar };

export default connect(mapStateToProps, mapDispatchToProps)(GlobalHeader);
