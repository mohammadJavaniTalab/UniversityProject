// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Pagination from "antd/lib/pagination";
import Empty from "antd/lib/empty";
import Modal from "antd/lib/modal";

// ======================================= component
import AddComponent from "../../../components/management/link-user/add/AddComponent";
import EditComponent from "../../../components/management/link-user/edit/EditComponent";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import {
  linkUserList,
  linkUserAcceptRequest,
  linkUserEdit
} from "../../../redux-logic/link_user/Action";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import {
  LinkedUserListResponse,
  LinkedUserModel,
  linkedUserStatusObject,
  LinkedUserEditModel
} from "../../../redux-logic/link_user/Type";

// ======================================= services
import AllImages from "../../../assets/images/images";
import { pathProject } from "../../../service/constants/defaultValues";
import { checkFieldIsOk } from "../../../service/public";
import { IdModel } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";

// =================================================
interface PropsType {
  linkUserList: Function;
  linkUserAcceptRequest: Function;
  linkUserEdit: Function;
  linkUserResponse: LinkedUserListResponse;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };
  addVisible: boolean = false;
  editVisible: boolean = false;
  editValue: any = [];

  componentDidMount = () => {
    this.props.linkUserList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { linkUserResponse } = this.props;
    if (linkUserResponse.updateList) {
      this.props.linkUserList(this.requestBody);
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

  acceptUser = (id: string) => {
    const self = this;
    const requestBody: IdModel = { id };
    Modal.confirm({
      title: "Do you want to accept this user ? ",
      content: null,
      okText: "Yes, accept!",
      cancelText: "No , accept",
      onOk() {
        self.props.linkUserAcceptRequest(requestBody);
      }
    });
  };

  declineUser = (organization: LinkedUserModel) => {
    const self = this;
    const updateLink: LinkedUserEditModel = {
      id: organization.id,
      status: 4
    };
    Modal.confirm({
      title: "Do you want to decline this user ? ",
      content: null,
      okText: "Yes, decline!",
      cancelText: "No , cancel",
      onOk() {
        self.props.linkUserEdit(updateLink);
      }
    });
  };

  renderResult = () => {
    const { linkUserResponse } = this.props;
    return (
      <tbody>
        {linkUserResponse.items.map((organization: LinkedUserModel) => (
          <tr key={JSON.stringify(organization)}>
            <td>
              {checkFieldIsOk(organization.firstUser)
                ? organization.firstUser.username
                : ""}
            </td>
            <td>
              {checkFieldIsOk(organization.secondUser)
                ? organization.secondUser.username
                : ""}
            </td>
            <td>
              <b>{linkedUserStatusObject[organization.status]}</b>
            </td>
            <td>
              <button
                className="btn-icon glyph-icon iconsminds-link"
                onClick={() => this.acceptUser(organization.id)}
              />
            </td>
            <td>
              <button
                className="btn-icon glyph-icon iconsminds-broken-link"
                onClick={() => this.declineUser(organization)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  render() {
    const { linkUserResponse } = this.props;
    return (
      <LayoutManagement pagePath={pathProject.management.linkedUser}>
        <Fragment>
          <div className="row">
            <div className="col-12 text-left">
              <h3 className="mt-2 grid-title">Link User Management</h3>
            </div>
            <div className="col-sm-12 col-md-6 align-right f-right mb-3">
              <div className="input-group user-list-search float-right"></div>
            </div>
            <div className="col-sm-12 col-md-3 text-md-right"></div>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">FIRST USER</th>
                    <th scope="col">SECOND USER</th>
                    <th scope="col">STATUS</th>
                    <th scope="col">ACCEPT</th>
                    <th scope="col">DECLINE</th>
                  </tr>
                </thead>
                {this.renderResult()}
              </table>
              {!linkUserResponse.loading &&
              linkUserResponse.items.length === 0 ? (
                <div className="text-center py-3">
                  <Empty
                    description={<span>No Link User Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}

              {linkUserResponse.loading ? (
                <div className="text-center py-3">
                  <Empty
                    image={AllImages.loading}
                    description={<span>Please wait ...</span>}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="text-center mt-2">
            <Pagination
              current={this.requestBody.PageNumber + 1}
              onChange={(event: number) => {
                this.requestBody.PageNumber = event - 1;
                this.forceUpdate();
                this.props.linkUserList(this.requestBody);
              }}
              total={linkUserResponse.totalCount}
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
        </Fragment>
      </LayoutManagement>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    linkUserResponse: state.organizationReducer
  };
}

const mapDispatchToProps = {
  linkUserList,
  linkUserAcceptRequest,
  linkUserEdit
};

export default connect(mapStateToProps, mapDispatchToProps)(index);
