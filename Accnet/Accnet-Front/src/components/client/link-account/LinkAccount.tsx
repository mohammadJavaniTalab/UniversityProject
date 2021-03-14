// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";

// ======================================= component
import SearchUser from "../../generals/select/user/SearchUser";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { ProfileResponse } from "../../../redux-logic/auth/profile/update-profile/Type";
import { IdModel } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";
import { linkUserJoinRequest } from "../../../redux-logic/link_user/Action";
import { UserModel } from "../../../redux-logic/user/Type";

// ======================================= services
import AllImages from "../../../assets/images/images";
import { blobDownload } from "../../../service/constants/defaultValues";
import { getNotification } from "../../../service/notification";

// ======================================= css
import "./styles.scss";

interface PropsType {
  profileResponse: ProfileResponse;
  linkUserJoinRequest: Function;
}
class LinkAccount extends Component<PropsType> {
  joinRequest: IdModel = { id: "" };
  userName: string = "";

  render() {
    const { profileResponse } = this.props;
    return (
      <div className="link-account-wrapper">
        <h3 className="section-title mt-5 mb-3">
          <strong>Link Account</strong>
        </h3>
        <div className="link-account-group">
          <div className="left-box px-4 py-4">
            <span className="text-muted d-block mb-1 mt-45">Your Username</span>
            <div className="user-item text-left">
              <span className="user-avatar mr-2">
                <img
                  src={
                    profileResponse.data.avatarId === null ||
                    profileResponse.data.avatarId === undefined
                      ? AllImages.avatar
                      : `${blobDownload}${profileResponse.data.avatarId}`
                  }
                  width="35"
                  height="35"
                />
              </span> 
              <span className="username">
                <strong> {profileResponse.data.lastname} </strong>
                <strong> {profileResponse.data.firstname} </strong>
              </span>
            </div>
          </div>
          <div className="right-box px-4 py-4 mb-0 bg-white">
            <div className="text-left">
              <div className="form-group mb-0 organization-join-request">
                <div>
                  <h3>
                    <strong>Link Account</strong>
                  </h3>
                </div>
                <SearchUser
                  value={this.userName}
                  onChange={(event: UserModel) => {
                    this.joinRequest.id = event.id;
                    this.userName = event.username;
                    this.forceUpdate();
                  }}
                />
                <button
                  onClick={() => {
                    if (this.joinRequest.id === "") {
                      getNotification("Please enter user");
                      return;
                    }
                    this.props.linkUserJoinRequest(this.joinRequest);
                  }}
                  className="btn custom-btn btn-block rounded mt-3"
                >
                  <span className="fa fa-plus"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state: AppState) {
  return {
    profileResponse: state.smallProfileReducer
  };
}

const mapDispatchToProps = { linkUserJoinRequest };

export default connect(mapStateToProps, mapDispatchToProps)(LinkAccount);
