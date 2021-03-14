// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";
import Pagination  from "antd/lib/pagination";

// ======================================= redux
import AddComponent from "../../../components/management/feature/add/AddComponent";
import EditComponent from "../../../components/management/feature/edit/EditComponent";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { featureList } from "../../../redux-logic/feature/Action";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { ApplicationListResponse } from "../../../redux-logic/essentials-tools/type/Response-type";
import { FeatureModel } from "../../../redux-logic/feature/Type";

import AllImages from "../../../assets/images/images";
import { pathProject } from "../../../service/constants/defaultValues";

// ======================================= interface
interface PropsType {
  featureList: Function;
  featureResponse: ApplicationListResponse;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };
  addVisible: boolean = false;
  editVisible: boolean = false;
  editValue: FeatureModel = {
    name: "",
    permissions: [],
    id: ""
  };

  componentDidMount = () => {
    this.props.featureList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { featureResponse } = this.props;
    if (featureResponse.updateList) {
      this.props.featureList(this.requestBody);
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

  render() {
    const { featureResponse } = this.props;
    return ( 
      <LayoutManagement pagePath={pathProject.management.feature}>
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-3 text-left">
              <h3 className="mt-2 grid-title">Feature Management</h3>
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
                <span>Add Feature</span>
              </button>
            </div>
          </div>
          <div className="card">
            <div className="crud-theme-one">
              <table className="table theme-one-grid">
                <thead>
                  <tr>
                    <th scope="col">NAME</th>
                    <th scope="col">EDIT</th>
                  </tr>
                </thead>
                <tbody>
                  {featureResponse.items.map((feature: FeatureModel) => (
                    <tr key={JSON.stringify(feature)}>
                      <td>{feature.name}</td>
                      <td>
                        <button
                          className="btn-icon glyph-icon simple-icon-note"
                          onClick={() => {
                            this.editValue = feature;
                            this.editOnVisible();
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!featureResponse.loading &&
              featureResponse.items.length === 0 ? (
                <div className="text-center">
                  <Empty
                    description={<span>No Feature Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}

              {featureResponse.loading ? (
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
                this.props.featureList(this.requestBody);
              }}
              total={featureResponse.totalCount}
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
    featureResponse: state.featureReducer
  };
}

const mapDispatchToProps = { featureList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
