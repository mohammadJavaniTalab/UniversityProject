// ======================================= modules
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";
import Pagination from "antd/lib/pagination";

// ======================================= component
import LayoutManagement from "../../../components/management/layout/LayoutManagement";
import AddComponent from "../../../components/management/message/add/AddComponent";
import EditComponent from "../../../components/management/message/edit/EditComponent";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { messageList } from "../../../redux-logic/message/Action";
import {
  MessageResponse,
  MessageModel
} from "../../../redux-logic/message/Type";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";

// ======================================= services
import AllImages from "../../../assets/images/images";
import { pathProject } from "../../../service/constants/defaultValues";
import { checkFieldIsOk } from "../../../service/public";
// =============================================================

interface PropsType {
  messageList: Function;
  messageResponse: MessageResponse;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };
  addVisible: boolean = false;
  editVisible: boolean = false;
  editValue: any = {};

  componentDidMount = () => {
    this.props.messageList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { messageResponse } = this.props;
    if (messageResponse.updateList) {
      this.props.messageList(this.requestBody);
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

  renderResult = () => {
    const { messageResponse } = this.props;
    return (
      <tbody>
        {messageResponse.items.map((message: MessageModel) => (
          <tr key={JSON.stringify(message)}>
            <td>
              {checkFieldIsOk(message.fromUser)
                ? message.fromUser.username
                : ""}
            </td>
            <td>
              {checkFieldIsOk(message.toUser) ? message.toUser.username : ""}
            </td>
            <td>
              <b>{message.title}</b>
            </td>
            <td>{message.body}</td>
            <td>
              {message.enabled ? (
                <span className="glyph-icon simple-icon-check h4 text-success" />
              ) : ( 
                <span className="glyph-icon simple-icon-close h4 text-danger" />
              )}
            </td>
            <td>
              <button
                className="btn-icon glyph-icon simple-icon-note"
                onClick={() => {
                  this.editValue = message;
                  this.editOnVisible();
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  render() {
    const { messageResponse } = this.props;
    return (
      <LayoutManagement pagePath={pathProject.management.message}>
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-3 text-left">
              <h3 className="mt-2 grid-title">Message Management</h3>
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
                <span>Add Message</span>
              </button>
            </div>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">FROM USER</th>
                    <th scope="col">TO USER</th>
                    <th scope="col">TITLE</th>
                    <th scope="col">BODY</th>
                    <th scope="col">ENABLE</th>
                    <th scope="col">EDIT</th>
                  </tr>
                </thead>
                {this.renderResult()}
              </table>
              {!messageResponse.loading &&
              messageResponse.items.length === 0 ? (
                <div className="text-center py-3">
                  <Empty
                    description={<span>No Message Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}
              {messageResponse.loading ? (
                <div className="text-center py-3">
                  <Empty
                    description={<span>Please wait ...</span>}
                    image={AllImages.loading}
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
                this.props.messageList(this.requestBody);
              }}
              total={messageResponse.totalCount}
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
    messageResponse: state.messageReducer
  };
}

const mapDispatchToProps = { messageList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
