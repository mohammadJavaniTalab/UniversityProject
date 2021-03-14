// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";

// ======================================= component
import Profile from "../../select-profile/Profile";

// ======================================= modules
import { AppState } from "../../../../redux-logic/Store";

// ======================================= services
import AllImages from "../../../../assets/images/images";
import { getWindowAfterSSR } from "../../../../service/public";
// =================================================

interface PropsType {
  page: string
}
class Header extends Component<PropsType> {
  visible: boolean = false;

  onVisible = () => {
    this.visible = !this.visible;
    this.forceUpdate();
  };

  render() {
    const { page } = this.props;
    return (
      <div className="top-bar px-3">
        <div className="row a-i-center">
          <div className="col-12 col-sm-4 text-left d-none d-md-block">
            <nav aria-label="breadcrumb" className="breadcrumb-nav">
              <ol className="breadcrumb py-0 px-0 my-0">
                <li className="breadcrumb-item">
                  <span className="color-theme-1">Home</span>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <span
                    onClick={() => {
                      if (getWindowAfterSSR()) {
                        location.reload();
                      }
                    }}
                    className="color-theme-2 cursor-pointer"
                  >
                    {page}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          <div className="col-6 col-md-4 text-sm-left text-md-center ">
            <img
              className="cursor-pointer"
              onClick={() => {
                if (getWindowAfterSSR()) {
                  window.location.href = "/";
                }
              }}
              src={AllImages.logo}
              alt="accnet logo"
              style={{ width: "auto", height: "20px" }}
            />
          </div>
          <div className="col-6 col-md-4 text-right py-2">
            <Profile />
          </div> 
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return { };
}

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(Header);
