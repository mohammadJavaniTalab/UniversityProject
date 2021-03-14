// ======================================= redux
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";
import Tabs from "antd/lib/tabs";
import Pagination from "antd/lib/pagination";
import Modal from "antd/lib/modal";

// ======================================= component
import AddComponent from "../../../components/management/user/add/AddComponent";
import EditComponent from "../../../components/management/user/edit/EditComponent";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { userList, userDelete } from "../../../redux-logic/user/Action";
import {
  UserModel,
  UserListResponse,
  UserPaginationRequestBody,
} from "../../../redux-logic/user/Type";

// ======================================= services
import AllImages from "../../../assets/images/images";
import { pathProject } from "../../../service/constants/defaultValues";

// ======================================= css
import "./style.scss";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";

// ======================================= interface
interface PropType {
  userList: Function;
  userDelete: Function;
  userResponse: UserListResponse;
}

class index extends Component<PropType> {
  requestBody: UserPaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
    RoleId: "1ff961f7-f99a-48ad-8feb-729bb86789cd",
  };
  addVisible: boolean = false;
  editVisible: boolean = false;
  editValue: any = {};
  current_user: string = "MasterAdmin";
  surveyDetails: CrudObject = {
    visible: false,
    update: false,
    edit: false,
    value: "",
    valueIndex: 0,
  };

  componentDidMount = () => {
    const { userList } = this.props;
    userList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { userResponse } = this.props;
    if (userResponse.updateList) {
      this.props.userList(this.requestBody);
    }
  };

  addOnVisible = () => {
    this.addVisible = !this.addVisible;
    this.forceUpdate();
  };

  editOnVisible = () => {
    this.editVisible = !this.editVisible;
    this.forceUpdate();
  };

  render() {
    const { userResponse, userDelete, userList } = this.props;
    const { TabPane } = Tabs;
    return (
      <LayoutManagement pagePath={pathProject.management.user}>
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-3 text-left">
              <h3 className="mt-2 grid-title">User Management</h3>
            </div>
            <div className="col-sm-12 col-md-6 align-right f-right mb-3"></div>
            <div className="col-sm-12 col-md-3 text-md-right">
              <button
                className="btn btn-outline-primary mb-3 add-item-btn"
                onClick={() => {
                  this.addOnVisible();
                }}
              >
                <span className="glyph-icon simple-icon-plus mr-1"></span>
                <span>Add User</span>
              </button>
            </div>
          </div>
          <div className="user-list-filter">
            <Tabs
              activeKey={this.current_user}
              onChange={(event: string) => {
                if (event === "MasterAdmin") {
                  this.requestBody.RoleId =
                    "1ff961f7-f99a-48ad-8feb-729bb86789cd";
                } else {
                  this.requestBody.RoleId =
                    "6c98c773-5cf8-4993-b78b-32af01858111";
                }
                userList(this.requestBody);
                this.current_user = event;
                this.forceUpdate();
              }}
            >
              <TabPane tab={<span>Admin user</span>} key="MasterAdmin" />
              <TabPane tab={<span>Client User</span>} key="NormalUser" />
            </Tabs>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">FIRST NAME</th>
                    <th scope="col">LAST NAME</th>
                    <th scope="col">USER NAME</th>
                    <th scope="col">STATUS</th>
                    {/* {this.current_user === "MasterAdmin" ? null : (
                      <th scope="col">SURVEY DETAILS</th>
                    )} */}
                    <th scope="col">EDIT</th>
                    {this.current_user === "NormalUser" ? (
                      <th scope="col">DELETE</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {userResponse.items.map((user: UserModel) => (
                    <tr key={JSON.stringify(user)}>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div
                            className="text-nowrap overflow-hidden"
                            style={{ width: "200px", textOverflow: "ellipsis" }}
                          >
                            {user.firstname}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div
                            className="text-nowrap overflow-hidden"
                            style={{ width: "200px", textOverflow: "ellipsis" }}
                          >
                            {user.lastname}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div
                            className="text-nowrap overflow-hidden"
                            style={{ width: "200px", textOverflow: "ellipsis" }}
                          >
                            {user.username}
                          </div>
                        </div>
                      </td>
                      <td>
                        {user.enabled ? (
                          <span className="glyph-icon simple-icon-check h4 text-success" />
                        ) : (
                          <span className="glyph-icon simple-icon-close h4 text-danger" />
                        )}
                      </td>

                      {/* {this.current_user !== "MasterAdmin" ? (
                        <td>
                          <button
                            className="btn-icon glyph-icon iconsminds-file-zip"
                            onClick={() => {
                              this.surveyDetails.visible = true;
                              this.surveyDetails.value = user.id;
                              this.forceUpdate();
                            }}
                          />
                        </td>
                      ) : null} */}
                      <td>
                        <button
                          className="btn-icon glyph-icon simple-icon-note"
                          onClick={() => {
                            this.editValue = user;
                            this.editOnVisible();
                          }}
                        />
                      </td>
                      {this.current_user === "NormalUser" ? (
                        <td>
                          <button
                            className="btn-icon glyph-icon simple-icon-trash"
                            onClick={() => {
                              Modal.confirm({
                                title: "Are you sure delete this user?",
                                okText: "Yes",
                                okType: "danger",
                                cancelText: "No",
                                onOk() {
                                  userDelete({ id: user.id });
                                },
                                onCancel() {},
                              });
                            }}
                          />
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center py-3">
                {!userResponse.loading && userResponse.items.length === 0 ? (
                  <Empty
                    description={<span>No User Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : null}
                {userResponse.loading ? (
                  <Empty
                    description={<span>Please wait ...</span>}
                    image={AllImages.loading}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <Pagination
              current={this.requestBody.PageNumber + 1}
              onChange={(event: number) => {
                this.requestBody.PageNumber = event - 1;
                this.forceUpdate();
                this.props.userList(this.requestBody);
              }}
              total={userResponse.totalCount}
            />
          </div>
          <AddComponent
            visible={this.addVisible}
            onVisible={this.addOnVisible}
          />

          <EditComponent
            visible={this.editVisible}
            onVisible={this.editOnVisible}
            editValue={this.editValue}
          />
          {/* {this.surveyDetails.visible ? (
            <SurveyDetails
              surveyDetails={this.surveyDetails}
              onVisible={() => {
                this.surveyDetails.visible = !this.surveyDetails.visible;
                this.forceUpdate();
              }}
            />
          ) : null} */}
        </Fragment>
      </LayoutManagement>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    userResponse: state.userReducer,
  };
}

const mapDispatchToProps = { userList, userDelete };

export default connect(mapStateToProps, mapDispatchToProps)(index);
