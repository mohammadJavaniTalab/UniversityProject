// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";

// ======================================= component
import LayoutManagement from "../../../components/management/layout/LayoutManagement";
import ConsultationException from "../../../components/management/consultation-exception/ConsultationException";

// ======================================= redux
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { AppState } from "../../../redux-logic/Store";
import { consultationExceptionList, consultationExceptionDelete } from "../../../redux-logic/consultation-exception/Action";
import {
  ConsultationExceptionListResponse,
  ConsultationExceptionModel,
} from "../../../redux-logic/consultation-exception/Type";

// ======================================= services
import { checkFieldIsOk, getTimeAndDate } from "../../../service/public";
import AllImages from "../../../assets/images/images";
import { Pagination, Button } from "antd";
import { pathProject } from "../../../service/constants/defaultValues";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";

// =====================================================

interface PropsType {
  consultationExceptionList: Function;
  consultationExceptionDelete : Function 
  consultationExceptionResponse: ConsultationExceptionListResponse;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
  };

  consultation_exception: CrudObject = {
    visible: false,
    update: false,
    edit: false,
    value: {},
    valueIndex: 0,
  };

  componentDidMount = () => {
    this.props.consultationExceptionList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { consultationExceptionResponse } = this.props;
    if (consultationExceptionResponse.updateList) {
      this.props.consultationExceptionList(this.requestBody);
    }
  };

  renderResult = () => {
    const { consultationExceptionResponse } = this.props;
    return (
      <tbody>
        {consultationExceptionResponse.items.map(
          (consultation: ConsultationExceptionModel) => (
            <tr key={JSON.stringify(consultation)}>
              <td>
                <span>
                  <span>{getTimeAndDate(consultation.fromDate, "DATE")}</span>
                  <span className="mx-2"></span>
                  <span>{getTimeAndDate(consultation.fromDate, "TIME")}</span>
                </span>
              </td>
              <td>
                <span>
                  <span>{getTimeAndDate(consultation.toDate, "DATE")}</span>
                  <span className="mx-2"></span>
                  <span>{getTimeAndDate(consultation.toDate, "TIME")}</span>
                </span>
              </td>
              <td>
                <button
                  className="btn-icon glyph-icon simple-icon-note"
                  onClick={() => {
                    this.consultation_exception.visible = true;
                    this.consultation_exception.edit = true;
                    this.consultation_exception.update = true;
                    this.consultation_exception.value = consultation;
                    this.forceUpdate();
                  }}
                />
              </td>
              <td>
                <Button type="link" onClick={() => {
                  this.props.consultationExceptionDelete(consultation.id)
                }}>Delete</Button>
              </td>
            </tr>
          )
        )}
      </tbody>
    );
  };

  render() {
    const { consultationExceptionResponse } = this.props;
    return (
      <LayoutManagement
        pagePath={pathProject.management.consultation_Exception}
      >
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-6 text-left">
              <h3 className="mt-2 grid-title">Consultation Exception</h3>
            </div>
            <div className="col-sm-12 col-md-3 align-right f-right mb-3"></div>
            <div className="col-sm-12 col-md-3 text-md-right">
              <button
                className="btn btn-outline-primary mb-3 add-item-btn"
                onClick={() => {
                  this.consultation_exception.visible = true;
                  this.consultation_exception.update = false;
                  this.consultation_exception.edit = false;
                  this.forceUpdate();
                }}
              >
                <span className="glyph-icon simple-icon-plus m-2" />
              </button>
            </div>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">FROM DATE/TIME</th>
                    <th scope="col">TO DATE/TIME</th>
                    <th scope="col">EDIT</th>
                    <th scope="col">DELETE</th>
                  </tr>
                </thead>
                {this.renderResult()}
              </table>
              {!consultationExceptionResponse.loading &&
              consultationExceptionResponse.items.length === 0 ? (
                <div className="text-center">
                  <Empty
                    description={<span>No Consultation Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}

              {consultationExceptionResponse.loading ? (
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
                this.props.consultationExceptionList(this.requestBody);
              }}
              total={consultationExceptionResponse.totalCount}
            />
          </div>
          <ConsultationException
            consultationDetails={this.consultation_exception}
            onChange={(event: CrudObject) => {
              this.consultation_exception = event;
              this.forceUpdate();
            }}
          />
        </Fragment>
      </LayoutManagement>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    consultationExceptionResponse: state.consultationExceptionReducer,
  };
}

const mapDispatchToProps = { consultationExceptionList, consultationExceptionDelete };

export default connect(mapStateToProps, mapDispatchToProps)(index);
