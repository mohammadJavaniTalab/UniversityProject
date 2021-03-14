// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";
import Pagination from "antd/lib/pagination";
// ======================================= component
import MessageDetails from "../../../components/client/message/details/MessageDetails";
import LayoutClient from "../../../components/client/layout/LayoutClient";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import {
  MessageResponse,
  MessageModel,
} from "../../../redux-logic/message/Type";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { messageList } from "../../../redux-logic/message/Action";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";

// ======================================= services
import AllImages from "../../../assets/images/images";
import { checkFieldIsOk } from "../../../service/public";
import {
  pathProject,
  dashboard_Type,
} from "../../../service/constants/defaultValues";

// ======================================= css
import "./styles.scss";
// =======================================================
interface PropsType {
  messageList: Function;
  messageResponse: MessageResponse;
}
class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    Keyword: "",
    PageNumber: 0,
    PageSize: 10,
  };

  componentDidMount = () => {
    this.props.messageList(this.requestBody);
  };

  messageDetails: CrudObject = {
    visible: false,
    update: false,
    edit: false,
    value: {},
    valueIndex: 0,
  };

  messageDetailsOnChange = (event: CrudObject) => {
    this.messageDetails = { ...event };
    this.forceUpdate();
  };

  render() {
    const { messageResponse } = this.props;
    return (
      <LayoutClient
        path={pathProject.client.messages}
        name={dashboard_Type.messages}
        selectBar={true}
      >
        <div className="container mt-5 pt-4">
          <div className="row mt-5 mb-3">
            <div className="col-6">
              <h3>
                <strong>Messages ( {messageResponse.items.length} )</strong>
              </h3>
            </div>
            <div className="col-6 text-right">
              <input
                value={this.requestBody.Keyword}
                onChange={(event) => {
                  this.requestBody.Keyword = event.target.value;
                  this.forceUpdate();
                  this.props.messageList(this.requestBody);
                }}
                className="form-control input-custom-width float-right rounded-10"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="card rounded-20">
            <div className="card-body">
              <div className="table-wrapper">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th scope="col" className="text-muted">
                        TO USER
                      </th>
                      <th scope="col" className="text-muted">
                        TITLE
                      </th>
                      <th scope="col" className="text-muted">
                        BODY
                      </th>
                      <th scope="col" className="text-muted">
                        PRIORITY
                      </th>
                      <th scope="col" className="text-muted">
                        DETAILS
                      </th>
                      <th scope="col" className="text-muted">
                        ENABLE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {messageResponse.items.map((message: MessageModel) => (
                      <tr key={`${JSON.stringify(message)}`}>
                        <td>
                          {checkFieldIsOk(message.toUser)
                            ? message.toUser.username
                            : ""}
                        </td>
                        <td>{message.title}</td>
                        <td>{message.body}</td>
                        <td>
                          <button className="btn btn-secondary btn-sm">
                            Low
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-icon simple-icon-notebook h4"
                            onClick={() => {
                              const update = {
                                ...this.messageDetails,
                                visible: true,
                                value: message,
                              };
                              this.messageDetailsOnChange(update);
                            }}
                          />
                        </td>
                        <td>
                          {message.enabled ? (
                            <span className="glyph-icon simple-icon-check h4 text-success" />
                          ) : (
                            <span className="glyph-icon simple-icon-close h4 text-danger" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!messageResponse.loading &&
                messageResponse.items.length === 0 ? (
                  <div className="text-center">
                    <Empty
                      description={<span>No Message Found yet.</span>}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                ) : null}
                {messageResponse.loading ? (
                  <div className="text-center">
                    <Empty
                      description={<span>Please wait ...</span>}
                      image={AllImages.loading}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <Pagination
              current={this.requestBody.PageNumber + 1}
              onChange={(event: number) => {
                this.requestBody.PageNumber = event - 1;
                this.forceUpdate();
              }}
              total={messageResponse.totalCount}
            />
          </div>
          <MessageDetails
            value={this.messageDetails}
            onChange={this.messageDetailsOnChange}
          />
        </div>
      </LayoutClient>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    messageResponse: state.messageReducer,
  };
}

const mapDispatchToProps = { messageList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
