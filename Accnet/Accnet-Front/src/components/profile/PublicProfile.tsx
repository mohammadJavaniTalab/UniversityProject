// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

// ======================================= component
import EditProfile from "./EditProfile/EditProfile";
import ChangePassword from "./change-password/ChangePassword";

// ======================================= redux
import { AppState } from "../../redux-logic/Store";
import { profile } from "../../redux-logic/auth/profile/Action";
import { ProfileResponse } from "../../redux-logic/auth/profile/Type";
import { updateProfile } from "../../redux-logic/auth/profile/update-profile/Action";

// ======================================= services
import { blobDownload } from "../../service/constants/defaultValues";
import {
  getWindowAfterSSR,
  checkFieldIsOk,
  getTimeAndDate,
  publicCheckArray,
} from "../../service/public";
import AllImages from "../../assets/images/images";

// ======================================= css
import "./styles.scss";
import { CrudObject } from "../../redux-logic/essentials-tools/type/Basic-Object-type";

interface PropsType {
  profile: Function;
  profileResponse: ProfileResponse;
}
class PublicProfile extends Component<PropsType> {
  
  editProfile: CrudObject = {
    visible: false,
    update: false,
    edit: false,
    value: {},
    valueIndex: 0,
  };

  changePassword: CrudObject = {
    visible: false,
    update: false,
    edit: false,
    value: {},
    valueIndex: 0,
  };

  shouldUpdateProfile : boolean = true

  componentDidUpdate(){
    if (this.shouldUpdateProfile){
      this.shouldUpdateProfile = false
      this.props.profile()
    }
  }

  onChange = (name: "changePassword" | "editProfile", value: CrudObject) => {
    this[name] = value;
    this.forceUpdate();
  };

  render() {
    if (this.shouldUpdateProfile){
      this.shouldUpdateProfile = false
      this.props.profile()
    }

    const { profileResponse } = this.props;
    const urlAvatar = checkFieldIsOk(profileResponse.data.avatarId)
      ? `${blobDownload}${profileResponse.data.avatarId}`
      : AllImages.avatar;
    return (
      <div className="profile-component">
        <article className="container pt-2 padding-layout">
          {profileResponse.loading ? (
            <div className="text-center py-5">
              <img
                src={AllImages.icon.rosary}
                style={{ height: "100px" }}
                className="my-4"
              />
            </div>
          ) : (
            <Fragment>
              <h2 className="text-secondary pb-2">User Profile </h2>
              <div className="card profile-content">
                <div
                  style={{ backgroundImage: `url(${urlAvatar})` }}
                  className="user-profile"
                />
                <div className="text-right mt-3 px-2">
                  <span
                    onClick={() => {
                      const update: CrudObject = {
                        ...this.changePassword,
                        visible: true,
                        update: true,
                      };
                      this.onChange("editProfile", update);
                    }}
                    className="cursor-pointer d-block"
                  >
                    <span className="glyph-icon simple-icon-pencil" />
                    <span className="mx-2">Edit</span>
                  </span>
                  <span
                    onClick={() => {
                      const update: CrudObject = {
                        ...this.changePassword,
                        visible: true,
                      };
                      this.onChange("changePassword", update);
                    }}
                    className="cursor-pointer d-block"
                  >
                    <span className="glyph-icon simple-icon-pencil" />
                    <span className="mx-2">Change password</span>
                  </span>
                </div>

                <div className="card-body profile-data-content">
                  <div className="container-fluid">
                    <div className="text-center mb-5">
                      <span className="h4 text-secondary">
                        <span>{profileResponse.data.gender}</span>
                        <span className="mx-2">
                          {profileResponse.data.firstname}
                        </span>
                        <span>{profileResponse.data.lastname}</span>
                      </span>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">BirthDate : </span>
                      <b>
                        {getTimeAndDate(
                          profileResponse.data.dateOfBirth,
                          "DATE"
                        )}
                      </b>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">Email : </span>
                      <b> {profileResponse.data.email}</b>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">Phone NO : </span>
                      <b> {profileResponse.data.mobile}</b>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">Unit Number : </span>
                      <b> {profileResponse.data.unitNumber}</b>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">Address : </span>
                      <b> {profileResponse.data.address}</b>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">Province : </span>
                      <b> {profileResponse.data.province}</b>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">City : </span>
                      <b> {profileResponse.data.city}</b>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">Postal Code : </span>
                      <b> {profileResponse.data.postalCode}</b>
                    </div>
                    <div className="profile-data h6 py-2">
                      <span className="text-muted mr-2">PO BOX : </span>
                      <b> {profileResponse.data.poBox}</b>
                    </div>
                    
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </article>
        <EditProfile
          profileCrud={this.editProfile}
          onChange={(event: CrudObject) => this.onChange("editProfile", event)}
          onSave={() => {
            this.shouldUpdateProfile = true
            this.forceUpdate()
          }}
          closeAble={true}
        />
        <ChangePassword
          password={this.changePassword}
          onChange={(event: CrudObject) =>
            this.onChange("changePassword", event)
          }
        />
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    profileResponse: state.profileReducer,
  };
}

const mapDispatchToProps = { profile, updateProfile };
export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile);
