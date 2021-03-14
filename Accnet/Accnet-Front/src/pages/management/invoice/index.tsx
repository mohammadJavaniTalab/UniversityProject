// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";
import Pagination from "antd/lib/pagination";

// ======================================= redux
import AddComponent from "../../../components/management/invoice/add/AddComponent";
import EditComponent from "../../../components/management/invoice/edit/EditComponent";
import InvoiceDetails from "../../../components/generals/invoice/details/InvoiceDetails";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { invoiceList } from "../../../redux-logic/invoice/Action";
import {
  InvoiceListResponse,
  InvoiceListModel,
  invoiceStatusObject,
} from "../../../redux-logic/invoice/Type";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";

// ======================================= service
import { getTimeAndDate } from "../../../service/public";
import AllImages from "../../../assets/images/images";
import {
  pathProject,
  amountSign,
} from "../../../service/constants/defaultValues";

interface PropsType {
  invoiceList: Function;
  invoiceResponse: InvoiceListResponse;
}
class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
  };

  addVisible: boolean = false;
  editVisible: boolean = false;
  detailsVisible: boolean = false;
  editValue: any = {};

  componentDidMount = () => {
    this.props.invoiceList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { invoiceResponse } = this.props;
    if (invoiceResponse.updateList) {
      this.props.invoiceList(this.requestBody);
    }
  };

  onVisible = (value: "addVisible" | "editVisible" | "detailsVisible") => {
    this[value] = !this[value];
    this.forceUpdate();
  };

  renderResult = () => {
    const { invoiceResponse } = this.props;
    return (
      <tbody>
        {invoiceResponse.items.map((invoice: InvoiceListModel) => (
          <tr key={JSON.stringify(invoice)}>
            <td>{invoice.user.username}</td>
            <td>
              <span>{getTimeAndDate(invoice.creationDate, "DATE")}</span>
              <span> - </span>
              <span>{getTimeAndDate(invoice.creationDate, "TIME")}</span>
            </td>
            <td>{invoice.title}</td>
            <td>
              <div
                className="text-nowrap overflow-hidden"
                style={{ width: "200px", textOverflow: "ellipsis" }}
              >
                <span>{invoice.description}</span>
              </div>
            </td>
            <td>
              <span className="mx-2">{amountSign}</span>
              <span>{invoice.amount}</span>
            </td>
            <td>{invoiceStatusObject[invoice.status]}</td>
            <td>
              {invoice.enabled ? (
                <span className="glyph-icon simple-icon-check h4 text-success" />
              ) : (
                <span className="glyph-icon simple-icon-close h4 text-danger" />
              )}
            </td>
            <td>
              <button
                className="btn-icon glyph-icon simple-icon-note"
                onClick={() => {
                  this.editValue = invoice;
                  this.onVisible("editVisible");
                }}
              />
            </td>
            <td>
              <button
                className="btn-icon glyph-icon iconsminds-file-clipboard-file---text"
                onClick={() => {
                  this.editValue = invoice;
                  this.onVisible("detailsVisible");
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  render() {
    const { invoiceResponse } = this.props;
    return (
      <LayoutManagement pagePath={pathProject.management.invoice}>
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-3 text-left">
              <h3 className="mt-2 grid-title">Invoice Management</h3>
            </div>
            <div className="col-sm-12 col-md-6 align-right f-right mb-3"></div>
            <div className="col-sm-12 col-md-3 text-md-right">
              <button
                className="btn btn-outline-primary mb-3 add-item-btn"
                onClick={() => this.onVisible("addVisible")}
              >
                <span className="glyph-icon simple-icon-plus mr-1"></span>
                <span>Add Invoice</span>
              </button>
            </div>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">USER</th>
                    <th scope="col">CREATION DATE</th>
                    <th scope="col">TITLE</th>
                    <th scope="col">DESCRIPTION</th>
                    <th scope="col">AMOUNT</th>
                    <th scope="col">STATUS</th>
                    <th scope="col">ENABLE</th>
                    <th scope="col">EDIT</th>
                    <th scope="col">DETAILS</th>
                  </tr>
                </thead>
                {this.renderResult()}
              </table>
              {!invoiceResponse.loading &&
              invoiceResponse.items.length === 0 ? (
                <div className="text-center py-3">
                  <Empty
                    description={<span>No Invoice Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}
              {invoiceResponse.loading ? (
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
                this.props.invoiceList(this.requestBody);
              }}
              total={invoiceResponse.totalCount}
            />
          </div>
          <AddComponent
            visible={this.addVisible}
            onVisible={() => this.onVisible("addVisible")}
          />
          <EditComponent
            visible={this.editVisible}
            onVisible={() => this.onVisible("editVisible")}
            editValue={this.editValue}
          />
          <InvoiceDetails
            visible={this.detailsVisible}
            onVisible={() => this.onVisible("detailsVisible")}
            editValue={this.editValue}
          />
        </Fragment>
      </LayoutManagement>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    invoiceResponse: state.invoiceReducer,
  };
}

const mapDispatchToProps = { invoiceList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
