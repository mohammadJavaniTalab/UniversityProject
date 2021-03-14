// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "antd/lib/date-picker";
import Pagination from "antd/lib/pagination";
import Empty from "antd/lib/empty";

// ======================================= component
import AddTicket from "../../../components/client/ticket/send-ticket/AddComponent";
import AddComment from "../../../components/management/comment/add/AddComponent";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { ticketList } from "../../../redux-logic/ticket/Action";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";

// ======================================= css
import "./style.scss";
import AllImages from "../../../assets/images/images";

import {
  TicketListResponse,
  TicketListModel,
  CommentModel,
} from "../../../redux-logic/ticket/Type";
import { pathProject } from "../../../service/constants/defaultValues";
import { getTimeAndDate, checkFieldIsOk } from "../../../service/public";
import BlobDownload from "../../../components/file/BlobDownload";
import SelectUser from "../../../components/generals/select/user/SelectUser";
import moment from "moment";
import { UserModel } from "../../../redux-logic/user/Type";

// ======================================= interface

interface PropsType {
  ticketList: Function;
  ticketResponse: TicketListResponse;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
    CreationDate: "",
    UserId: "",
  };
  userName: string = "";
  addTicketVisible: boolean = false;
  addCommentVisible: boolean = false;
  editVisible: boolean = false;
  current_comment = {
    start: 0,
  };

  componentDidMount = () => {
    this.props.ticketList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { ticketResponse } = this.props;
    if (ticketResponse.updateList) {
      this.props.ticketList(this.requestBody);
    }
  };

  onVisible = (visible: "addTicketVisible" | "addCommentVisible") => {
    this[visible] = !this[visible];
    this.forceUpdate();
  };

  render() {
    const { ticketResponse, ticketList } = this.props;
    return (
      <LayoutManagement pagePath={pathProject.management.ticket}>
        <div className="container pt-3 ticket-management">
          <div className="">
            <h3 className="mt-2 grid-title">Ticket Management</h3>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-4 col-xl-3 mb-3 mb-lg-0">
              <div className="ticket-information card">
                <div className="ticket-heading p-3 border-bottom font-weight-bold">
                  <span className="float-left">Tickets </span>
                </div>
                {ticketResponse.items.map(
                  (ticket: TicketListModel, index: number) => (
                    <div
                      key={`${JSON.stringify(ticket)}${index}`}
                      className="ticket-list-item p-3 border-bottom cursor-pointer"
                      onClick={() => {
                        this.current_comment.start = index;
                        this.forceUpdate();
                      }}
                    >
                      {index === this.current_comment.start ? (
                        <span className="glyph-icon simple-icon-bubbles current-comment" />
                      ) : null}
                      <div className="pb-2">
                        <span className="text-muted">
                          <span>(</span>
                          <span className="mx-2">
                            {checkFieldIsOk(ticket.user)
                              ? ticket.user.username
                              : ""}
                          </span>
                          <span>)</span>
                        </span>
                      </div>
                      <div className="font-weight-bold h6">
                        <span className="ddd">{ticket.title}</span>
                      </div>
                      <div className="text-muted">
                        <span className="ddd">{ticket.text}</span>
                      </div>
                      <div>
                        <span>
                          {getTimeAndDate(ticket.creationDate, "DATE")}
                        </span>
                        <span> - </span>
                        <span>
                          {getTimeAndDate(ticket.creationDate, "TIME")}
                        </span>
                      </div>
                    </div>
                  )
                )}

                {ticketResponse.loading ? (
                  <div className="text-center py-3">
                    <img
                      src={AllImages.icon.rosary}
                      style={{
                        width: "auto",
                        height: "50px",
                      }}
                    />
                  </div>
                ) : null}

                {!ticketResponse.loading &&
                ticketResponse.items.length === 0 ? (
                  <div className="text-center">
                    <Empty
                      description={<span>No Ticket Found yet.</span>}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="col-md-12 col-lg-8 col-xl-9">
              <div className="row mb-1">
                <div className="col-12 col-sm-5 mb-2 mb-sm-0">
                  <DatePicker
                    className="form-control border-0"
                    placeholder="Select creation ticket date."
                    allowClear={false}
                    value={
                      checkFieldIsOk(this.requestBody.CreationDate)
                        ? moment(
                            checkFieldIsOk(this.requestBody.CreationDate)
                              ? this.requestBody.CreationDate
                              : undefined
                          )
                        : null
                    }
                    onChange={(date, dateString) => {
                      this.requestBody.CreationDate = dateString;
                      this.forceUpdate();
                    }}
                  />
                </div>
                <div className="col-12 col-sm-5 mb-2 mb-sm-0">
                  <div>
                    <SelectUser
                      value={this.userName}
                      onChange={(event: UserModel) => {
                        this.userName = event.username;
                        this.requestBody.UserId = event.id;
                        this.forceUpdate();
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-2 text-center px-0 pt-2">
                  {checkFieldIsOk(this.requestBody.CreationDate) ||
                  checkFieldIsOk(this.requestBody.UserId) ? (
                    <button
                      onClick={() => {
                        this.requestBody.CreationDate = "";
                        this.requestBody.UserId = "";
                        this.userName = "";
                        ticketList(this.requestBody);
                        this.forceUpdate();
                      }}
                      className="simple-icon-reload btn-icon h4 mx-3"
                    />
                  ) : null}
                  <button
                    onClick={() => ticketList(this.requestBody)}
                    className="simple-icon-magnifier btn-icon h4"
                  />
                </div>
              </div>
              <div className="ticket-answer">
                <button
                  onClick={() => this.onVisible("addCommentVisible")}
                  className="p-3 w-100 text-left answer-button"
                  disabled={
                    ticketResponse.loading || ticketResponse.items.length === 0
                  }
                >
                  <span className="glyph-icon simple-icon-pencil mx-2" />
                  <span>Answer</span>
                </button>
              </div>
              {ticketResponse.items.map(
                (ticket: TicketListModel, index: number) =>
                  index === this.current_comment.start
                    ? checkFieldIsOk(ticket.comment)
                      ? ticket.comment.map((comment: CommentModel) => (
                          <div
                            key={`${JSON.stringify(ticket)}${JSON.stringify(
                              comment
                            )}`}
                            className="card answer-information mt-3"
                          >
                            <div className="answer-heading p-3 font-weight-bold">
                              <b>
                                {checkFieldIsOk(comment.user)
                                  ? comment.user.username
                                  : ""}
                              </b>
                              <span>
                                <span> ( </span>
                                <span>
                                  {getTimeAndDate(comment.creationDate, "DATE")}
                                </span>
                                <span> - </span>
                                <span>
                                  {getTimeAndDate(comment.creationDate, "TIME")}
                                </span>
                                <span> ) </span>
                              </span>
                            </div>
                            <div className="ticket-list-item p-3">
                              <div className="py-3 border-bottom">
                                {comment.text}
                              </div>
                              <div className="py-3 ">
                                <BlobDownload blobId={comment.blobId} />
                              </div>
                            </div>
                          </div>
                        ))
                      : null
                    : null
              )}
              {ticketResponse.items.map(
                (ticket: TicketListModel, index: number) =>
                  index === this.current_comment.start ? (
                    checkFieldIsOk(ticket.comment) &&
                    ticket.comment.length === 0 ? (
                      <div className="border p-3 card mt-3 font-weight-bold text-center comment-not-found">
                        No comments have been posted on current ticket yet
                      </div>
                    ) : null
                  ) : null
              )}
              {!ticketResponse.loading && ticketResponse.items.length === 0 ? (
                <div className="border p-3 card mt-3 font-weight-bold text-center comment-not-found">
                  No comments have been posted on current ticket yet
                </div>
              ) : null}
              {ticketResponse.loading ? (
                <div className="text-center py-5">
                  <img
                    src={AllImages.icon.rosary}
                    style={{
                      width: "auto",
                      height: "100px",
                    }}
                  />
                </div>
              ) : null}
            </div>
            <AddTicket
              visible={this.addTicketVisible}
              onVisible={() => this.onVisible("addTicketVisible")}
              type="MANAGER"
            />
            <AddComment
              visible={this.addCommentVisible}
              onVisible={() => {
                this.current_comment.start = 0;
                this.onVisible("addCommentVisible");
              }}
              ticketId={
                ticketResponse.items.length > this.current_comment.start
                  ? ticketResponse.items[this.current_comment.start].id
                  : ""
              }
            />
          </div>
          <hr />
          <div className="text-center mt-2">
            <Pagination
              current={this.requestBody.PageNumber + 1}
              onChange={(event: number) => {
                this.requestBody.PageNumber = event - 1;
                this.forceUpdate();
                ticketList(this.requestBody);
              }}
              total={ticketResponse.totalCount}
            />
          </div>
        </div>
      </LayoutManagement>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    ticketResponse: state.ticketReducer,
  };
}

const mapDispatchToProps = { ticketList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
