// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";

// ======================================= component
import AddTicket from "../../../components/client/ticket/send-ticket/AddComponent";
import AddComment from "../../../components/management/comment/add/AddComponent";
import LayoutClient from "../../../components/client/layout/LayoutClient";

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
  CommentModel
} from "../../../redux-logic/ticket/Type";
import {
  pathProject,
  dashboard_Type
} from "../../../service/constants/defaultValues";
import { getTimeAndDate, checkFieldIsOk } from "../../../service/public";
import BlobDownload from "../../../components/file/BlobDownload";

// ======================================= interface

interface PropsType {
  ticketList: Function;
  ticketResponse: TicketListResponse;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };
  addTicketVisible: boolean = false;
  addCommentVisible: boolean = false;
  editVisible: boolean = false;
  current_comment = {
    start: 0
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
    const { ticketResponse } = this.props;
    return (
      <LayoutClient
        path={pathProject.client.taxes}
        name={dashboard_Type.ticket}
        selectBar={false}
      >
        <div className="container pt-3 client-ticket-management">
          <div className="">
            <h3 className="mt-2 grid-title">Send Ticket</h3>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-4 col-xl-3 mb-3 mb-lg-0">
              <div className="ticket-information card">
                <div className="ticket-heading p-3 border-bottom font-weight-bold">
                  <span className="float-left">Tickets </span>
                  <span
                    className="float-right cursor-pointer"
                    onClick={() => this.onVisible("addTicketVisible")}
                  >
                    <span className="far fa-edit mx-2" />
                    <span>New</span>
                  </span>
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
                        height: "50px"
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
            <div className="col-md-12 col-lg-8 col-xl-9 padding-answer">
              <div className="ticket-answer">
                <button
                  onClick={() => this.onVisible("addCommentVisible")}
                  className="p-3 w-100 text-left answer-button"
                  disabled={ticketResponse.loading}
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
                        No comments have been posted on your current ticket yet
                      </div>
                    ) : null
                  ) : null
              )}

              {!ticketResponse.loading && ticketResponse.items.length === 0 ? (
                <div className="border p-3 card mt-3 font-weight-bold text-center comment-not-found">
                  No comments have been posted on your current ticket yet
                </div>
              ) : null}

              {ticketResponse.loading ? (
                <div className="text-center py-5">
                  <img
                    src={AllImages.icon.rosary}
                    style={{
                      width: "auto",
                      height: "100px"
                    }}
                  />
                </div>
              ) : null}
            </div>
            <AddTicket
              visible={this.addTicketVisible}
              onVisible={() => this.onVisible("addTicketVisible")}
              type="USER"
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
        </div>
      </LayoutClient>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    ticketResponse: state.ticketReducer
  };
}

const mapDispatchToProps = { ticketList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
