// ======================================= modules
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";

// ======================================= component
import PayPalCreateOrder from "../../pay-pal/create-order/PayPalCreateOrder";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { invoiceList } from "../../../redux-logic/invoice/Action";
import {
  InvoiceListResponse,
  InvoiceListModel,
  invoiceStatusObject,
} from "../../../redux-logic/invoice/Type";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";

// ======================================= services
import AllImages from "../../../assets/images/images";
import { getTimeAndDate } from "../../../service/public";

// ======================================= css
import "./styles.scss";
import { amountSign } from "../../../service/constants/defaultValues";
import { MobileView, BrowserView, TabletView } from "react-device-detect";

interface PropsType {
  invoiceResponse: InvoiceListResponse;
  invoiceList: Function;
}

class PaidInvoice extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
  };

  componentDidMount = () => {
    this.props.invoiceList(this.requestBody);
  };

  convertString = (text: string) => {
    let tempString: String = text.replace("↵", "\n");
    return tempString;
  };

  renderResult = () => {
    const { invoiceResponse } = this.props;
    return (
      <tbody>
        {invoiceResponse.items.map((invoice: InvoiceListModel) => (
          <tr key={`${JSON.stringify(invoice)}`} className="text-center">
            <td>
              <span>{getTimeAndDate(invoice.creationDate, "DATE")}</span>
              <span> - </span>
              <span>{getTimeAndDate(invoice.creationDate, "TIME")}</span>
            </td>
            <td>{invoice.title}</td>
            <td style={{ whiteSpace: "pre" }}>
              <div className="des-cont">
                {this.convertString(invoice.description)}
              </div>
            </td>
            <td>
              <span className="mx-2">{amountSign}</span>
              <span>{invoice.amount}</span>
            </td>
            <td>{invoiceStatusObject[invoice.status]}</td>
            <td>
              {invoice.status === 1 ? (
                <PayPalCreateOrder id={invoice.id} />
              ) : (
                <span className="glyph-icon iconsminds-handshake h4" />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  render() {
    const { invoiceResponse } = this.props;
    return (
      <div>
        <BrowserView>
          <Fragment>
            <div className="row mt-5 mb-3">
              <div className="col-12">
                <h3 className="section-title">
                  <strong> Invoices</strong>
                </h3>
                <div className="nav-tabs-wrapper ml-3 ml-sm-0"></div>
              </div>
              <div className="col-6 text-right"></div>
            </div>
            <div className="tab-content">
              <div
                className="tab-pane active"
                id="invoice"
                role="tabpanel"
                aria-labelledby="invoice-tab"
              >
                <div className="card rounded-20 dashboard-paid-invoice border-style">
                  <div className="card-body">
                    <div className="invoice-table-wrapper">
                      <table className="table">
                        <thead>
                          <tr className="text-center">
                            <th scope="col" className="text-muted">
                              Date
                            </th>
                            <th scope="col" className="text-muted">
                              Title
                            </th>
                            <th scope="col" className="text-muted">
                              Description
                            </th>
                            <th scope="col" className="text-muted">
                              Amount
                            </th>
                            <th scope="col" className="text-muted">
                              Status
                            </th>
                            <th scope="col" className="text-muted">
                              Payment
                            </th>
                          </tr>
                        </thead>

                        {this.renderResult()}
                      </table>
                      {!invoiceResponse.loading &&
                      invoiceResponse.items.length === 0 ? (
                        <div className="text-center">
                          <Empty
                            description={<span>No Invoice Found yet.</span>}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        </div>
                      ) : null}
                      {invoiceResponse.loading ? (
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
              </div>
            </div>
          </Fragment>
        </BrowserView>
        <MobileView>
          <div className="row mt-5 mb-3">
            <div className="col-12">
              <h3 className="section-title">
                <strong> Invoices</strong>
              </h3>
              <div className="nav-tabs-wrapper ml-3 ml-sm-0"></div>
            </div>
            <div className="col-6 text-right"></div>
          </div>
          {this.props.invoiceResponse.items.map((invoice: InvoiceListModel) => {
            return (
              <div className="card rounded-20 dashboard-paid-invoice border-style">
                <div className="card-body">
                  <div className="row">
                    <div className="col-6">{invoice.title}</div>
                    <div className="col-6">
                      {" "}
                      <span>
                        {getTimeAndDate(invoice.creationDate, "DATE")}
                      </span>
                      <span> - </span>
                      <span>
                        {getTimeAndDate(invoice.creationDate, "TIME")}
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12">
                          <strong>Payment Status:</strong>
                          <div>{invoiceStatusObject[invoice.status]}</div>
                        </div>
                      </div>
                      <div className="row pt-3">
                        <div className="col-12">
                          <strong>Payment Details:</strong>
                          <div>{this.convertString(invoice.description)}</div>
                        </div>
                      </div>

                      <div className="row pt-3">
                        <div className="col-12">
                          <strong>Payment Amount:</strong>
                          <span className="mx-2">{amountSign}</span>
                          <span>{invoice.amount}</span>
                        </div>
                      </div>

                      <div className="row pt-3">
                        <div className="col-12">
                          <strong>Payment Method: </strong>
                            {invoice.status === 1 ? (
                              <PayPalCreateOrder id={invoice.id} />
                            ) : (
                              <span className="glyph-icon iconsminds-handshake h4" />
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {!invoiceResponse.loading && invoiceResponse.items.length === 0 ? (
            <div className="text-center">
              <Empty
                description={<span>No Invoice Found yet.</span>}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : null}
          {invoiceResponse.loading ? (
            <div className="text-center">
              <Empty
                description={<span>Please wait ...</span>}
                image={AllImages.loading}
              />
            </div>
          ) : null}
        </MobileView>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    invoiceResponse: state.invoiceReducer,
  };
}

const mapDispatchToProps = { invoiceList };

export default connect(mapStateToProps, mapDispatchToProps)(PaidInvoice);
