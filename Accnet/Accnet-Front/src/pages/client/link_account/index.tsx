import React, { Component, Fragment } from "react";
import LayoutClient from "../../../components/client/layout/LayoutClient";
import LinkAccount from "../../../components/client/link-account/LinkAccount";
import Pagination from "antd/lib/pagination";
import Empty from "antd/lib/empty";
import { connect } from "react-redux";
import "./styles.scss";
import {
  dashboard_Type,
  pathProject
} from "../../../service/constants/defaultValues";
import {
  linkUserAcceptRequest,
  linkUserEdit
} from "../../../redux-logic/link_user/Action";
import { linkUserList } from "../../../redux-logic/link_user/Action";
import {
  LinkedUserListResponse,
  LinkedUserModel,
  linkedUserStatusObject,
  LinkedUserEditModel
} from "../../../redux-logic/link_user/Type";
import AllImages from "../../../assets/images/images";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { checkFieldIsOk } from "../../../service/public";
import { IdModel } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";
import Modal from "antd/lib/modal";
import { AppState } from "../../../redux-logic/Store";

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


  componentDidMount() {
    this.props.linkUserList(this.requestBody)
  }

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

  declineUser = (organization: LinkedUserModel) => {
    const self = this;
    const updateLink: LinkedUserEditModel = {
      id: organization.id,
      status: 4
    };
    Modal.confirm({
      title: "Do you want to decline this connection ?",
      content: null,
      okText: "Yes, decline!",
      cancelText: "Cancel",
      onOk() {
        self.props.linkUserEdit(updateLink);
      }
    });
  };

  acceptUser = (id: string) => {
    const self = this;
    const requestBody: IdModel = { id };
    Modal.confirm({
      title: "Do you want to accept this connection ?",
      content: null,
      okText: "Yes, accept!",
      cancelText: "Cancel",
      onOk() {
        self.props.linkUserAcceptRequest(requestBody);
      }
    });
  };

  render() {
    const { linkUserResponse } = this.props;
    return (
      <LayoutClient
        path={pathProject.client.link_account}
        name={dashboard_Type.link_account}
        selectBar={true}
      >
        <Fragment>
          <div style={{ marginTop: "100px" }}></div>
          <article className="container mt-4">
            <LinkAccount />
            <div className="row">
              <div className="col-12 text-left">
                <h3 className="section-title mt-5 mb-3">
                  <strong>Pending Connections</strong>
                </h3>
              </div>
              <div className="col-sm-12 col-md-6 align-right f-right mb-3"></div>
              <div className="col-sm-12 col-md-3 text-md-right"></div>
            </div>
            <div className="card">
              <div className="crud-theme-one">
                <table className="table theme-one-grid">
                  <thead>
                    <tr>
                      <th scope="col">USER NAME</th>
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
          </article>
        </Fragment>
      </LayoutClient>
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
