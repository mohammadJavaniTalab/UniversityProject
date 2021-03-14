// ======================================= modules
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";
import Pagination  from "antd/lib/pagination";

// ======================================= component
import AddComponent from "../../../components/management/role/add/AddComponent";
import EditComponent from "../../../components/management/role/edit/EditComponent";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { roleList } from "../../../redux-logic/role/Action";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { RoleModel, RoleListResponse } from "../../../redux-logic/role/Type";
import { FeatureModel } from "../../../redux-logic/feature/Type";

// ======================================= services
import AllImages from "../../../assets/images/images";
import { pathProject } from "../../../service/constants/defaultValues";

// ======================================= css
import "./style.scss";


// ======================================= interface

interface PropsType {
  roleList: Function;
  roleResponse: RoleListResponse;
}

class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10
  };
  addVisible: boolean = false;
  editVisible: boolean = false;
  editValue: RoleModel = {
    name: "",
    feature: [],
    id: ""
  };

  componentDidMount = () => {
    this.props.roleList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { roleResponse } = this.props;
    if (roleResponse.updateList) {
      this.props.roleList(this.requestBody);
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
    const { roleResponse } = this.props;
    return (
      <tbody>
        {roleResponse.items.map((role: RoleModel) => (
          <tr key={JSON.stringify(role)}>
            <td>{role.name}</td>
            <td>
              <button
                className="btn-icon glyph-icon simple-icon-note"
                onClick={() => {
                  this.editValue = role;
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
    const { roleResponse } = this.props;
    return (
      <LayoutManagement pagePath={pathProject.management.role}> 
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-3 text-left">
              <h3 className="mt-2 grid-title">Role Management</h3>
            </div>
            <div className="col-sm-12 col-md-6 align-right f-right mb-3"></div>
            <div className="col-sm-12 col-md-3 text-md-right">
              <button
                className="btn btn-outline-primary mb-3 add-item-btn"
                onClick={() => {
                  this.addOnVisible();
                }}
              >
                <span className="fa fa-plus mr-1"></span>
                <span>Add Role</span>
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
                {this.renderResult()}
              </table>
              {!roleResponse.loading && roleResponse.items.length === 0 ? (
                <div className="text-center">
                  <Empty
                    description={<span>No Role Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}
              {roleResponse.loading ? (
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
                this.props.roleList(this.requestBody);
              }}
              total={roleResponse.totalCount}
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
    roleResponse: state.roleReducer
  };
}

const mapDispatchToProps = { roleList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
