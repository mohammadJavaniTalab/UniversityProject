// ======================================= modules
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { navigate } from "gatsby";
import Empty from "antd/lib/empty";

// ======================================= component
import LayoutClient from "../../../components/client/layout/LayoutClient";
import MessageDetails from "../../../components/client/message/details/MessageDetails";

// ======================================= redux
import { messageList } from "../../../redux-logic/message/Action";
import { AppState } from "../../../redux-logic/Store";
import {
  MessageResponse,
  MessageModel,
} from "../../../redux-logic/message/Type";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";

// ======================================= services
import {
  dashboard_Type,
  pathProject,
} from "../../../service/constants/defaultValues";
import AllImages from "../../../assets/images/images";
import { checkFieldIsOk } from "../../../service/public";

// ======================================= css
import "./styles.scss";
import { Button } from "antd";

// ========================================================

interface PropsType {
  messageList: Function;
  messageResponse: MessageResponse;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
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

  componentDidMount = () => {
    this.props.messageList(this.requestBody);
  };

  truncateString = (text: string) => {
    let splitted = text.split("");
    let truncatedText: string = "";
    if (splitted.length < 71) {
      return text;
    } else {
      for (let i = 0; i < 70; i++) {
        truncatedText = truncatedText.concat(splitted[i]);
      }
      truncatedText = truncatedText.concat("...");
      return truncatedText;
    }
  };

  render() {
    const { messageResponse } = this.props;
    return (
      <LayoutClient
        path={pathProject.client.message}
        name={dashboard_Type.message}
        selectBar={true}
      >
        <Fragment>
          <div style={{ marginTop: "100px" }}></div>
          <article className="container mt-4">
            <Fragment>
              <div className="row mt-5 mb-3">
                <div className="col-6">
                  <h3 className="section-title">
                    <strong>Messages ({messageResponse.totalCount})</strong>
                  </h3>
                </div>
                <div className="col-6 text-right">
                  {messageResponse.totalCount > 3 ? (
                    <strong
                      onClick={() => navigate("/client/messages/")}
                      className="text-warning fs-20 cursor-pointer"
                    >
                      See All
                    </strong>
                  ) : null}
                </div>
              </div>
              <div className="card rounded-20">
                <div className="card-body">
                  <div className="table-wrapper">
                    <table className="table text-center">
                      <thead>
                        <tr>
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
                        </tr>
                      </thead>
                      <tbody>
                        {messageResponse.items
                          .slice(0, 3)
                          .map((message: MessageModel) => (
                            <tr key={`${JSON.stringify(message)}`}>
                              <td>{message.title}</td>
                              <td>
                                <div>{this.truncateString(message.body)}</div>
                              </td>
                              <td>
                                <span className="btn btn-secondary btn-sm">
                                  Low
                                </span>
                              </td>
                              <td>
                                <Button
                                  type="link"
                                  onClick={() => {
                                    const update = {
                                      ...this.messageDetails,
                                      visible: true,
                                      value: message,
                                    };
                                    this.messageDetailsOnChange(update);
                                  }}
                                >
                                  Read Message
                                </Button>
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
            </Fragment>
          </article>
          <MessageDetails
            value={this.messageDetails}
            onChange={this.messageDetailsOnChange}
          />
        </Fragment>
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
