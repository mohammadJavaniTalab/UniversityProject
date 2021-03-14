// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";

// ======================================= component
import Profile from "../../profile/Profile";

// ======================================= modules
import { AppState } from "../../../../redux-logic/Store";
import { pages } from "../sideBar/ManagementPages";

// ======================================= services
import AllImages from "../../../../assets/images/images";
// =================================================

interface PropsType {
  page: string;
}
class Header extends Component<PropsType> {
  visible: boolean = false;

  onVisible = () => {
    this.visible = !this.visible;
    this.forceUpdate();
  };

  findPage = () =>{
    let temp = ""
    for(let index in pages){
      if(pages[index].path === this.props.page){
        temp = pages[index].name
      }
    }
    return temp
  }

  render() {
    return (
      <div className="top-bar px-3">
        <div className="row a-i-center">
          <div className="col-12 col-sm-4 text-left d-none d-md-block">
            <nav aria-label="breadcrumb" className="breadcrumb-nav">
              <ol className="breadcrumb py-0 px-0 my-0">
                <li className="breadcrumb-item">
                  <span className="color-theme-1">Home</span>
                </li>
                <li className="breadcrumb-item">
                  <span className="color-theme-1">Management</span>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <span className="color-theme-2">
                    {this.findPage()}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          <div className="col-6 col-md-4 text-sm-left text-md-center ">
            <img
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
  return {  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
