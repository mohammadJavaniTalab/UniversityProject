// ======================================= modules
import React, { Component } from "react";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import { connect } from "react-redux";
import { navigate } from "gatsby";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { halfProfile } from "../../../redux-logic/auth/profile/Action";
import { ProfileResponse } from "../../../redux-logic/auth/profile/Type";
import { logout } from "../../../redux-logic/auth/generate-token/Action";

// ======================================= services
import AllImages from "../../../assets/images/images";
import {
  blobDownload,
  pathProject
} from "../../../service/constants/defaultValues";

// ======================================= css
import "./style.scss";

// ======================================================
interface PropType {
  halfProfile: Function;
  logout: Function;
  profileResponse: ProfileResponse;
}

class Profile extends Component<PropType> {
  componentDidMount = () => {
    const { halfProfile } = this.props;
    halfProfile();
  };

  selectMenu = (event: any) => {
    switch (event.key) {
      case "profile":
        navigate(pathProject.client.profile);
        break;
      case "logout":
        this.props.logout();
        break;

      default:
        break;
    }
  };

  render() {
    const { profileResponse } = this.props;
    return (
      <div className="account-block profile-dropdown">
        {profileResponse.success ? (
          <Dropdown
            overlay={
              <Menu onClick={this.selectMenu}>
                <Menu.Item key="profile">
                  <span>Profile</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                  <span>Logout</span>
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <span className="cursor-pointer">
              <span className="d-inline-block">
                <span>{profileResponse.data.firstname}</span>
                <span className="mx-1">{profileResponse.data.lastname}</span>
              </span>
              {profileResponse.data.avatarId === null ? (
                <img
                  className="avatar-default-user"
                  src={AllImages.avatar}
                  alt="Default-user-picture"
                />
              ) : (
                <span
                  style={{
                    backgroundImage: `url(${blobDownload}${profileResponse.data.avatarId})`
                  }}
                  className="avatar-user"
                />
              )}
            </span>
          </Dropdown>
        ) : ( 
          <img
            className="avatar-default-user"
            src={AllImages.avatar}
            alt="Default-user-picture"
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    profileResponse: state.smallProfileReducer
  };
}

const mapDispatchToProps = {
  halfProfile,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
