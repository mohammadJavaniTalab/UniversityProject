// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Badge from "antd/lib/badge";

// ======================================= component
import SelectPermission from "../../../generals/select/permissions/SelectPermissions";

// ======================================= redux
import { FeatureAddEditModel } from "../../../../redux-logic/feature/Type";
import { featureAdd } from "../../../../redux-logic/feature/Action";

// ======================================= services
import { getNotification } from "../../../../service/notification";
import { PermissionModel } from "../../../../redux-logic/permission/Type";
import { getFieldValueFromList } from "../../../../service/public";

// ==================================================
const initialize: FeatureAddEditModel = {
  name: "",
  permissions: []
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  featureAdd: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: FeatureAddEditModel = { ...initialize };
  permissionList: Array<PermissionModel> = [];
  permission: PermissionModel = {
    name: "",
    id: -0
  };

  handleSubmit = () => {
    if (this.requestBody.name === "") {
      getNotification("please enter feature name");
      return;
    }
    this.requestBody.permissions = getFieldValueFromList(
      this.permissionList,
      "id"
    );
    if (this.requestBody.permissions.length === 0) {
      getNotification("please select permission");
      return;
    }
    this.props.featureAdd(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.permissionList = [];
    this.permission.id = -0;
    this.permission.name = "";
    this.props.onVisible();
    this.forceUpdate();
  };

  render() {
    return (
      <Modal
        title="Add Feature"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="btn btn-outline-success"
            >
              Add
            </button>
          </div>
        }
        onCancel={this.closeModal}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>Name</label>
                <input
                  value={this.requestBody.name}
                  onChange={e => {
                    this.requestBody.name = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter feature name"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Permissions</label>
                <div>
                  <SelectPermission
                    value={this.permission.name}
                    onChange={(event: PermissionModel) => {
                      this.permission.name = event.name;
                      this.permission.id = event.id;
                      this.forceUpdate();
                    }}
                  />
                </div>
                <div className="text-center ">
                  <button
                    onClick={() => {
                      this.permissionList.push({ ...this.permission });
                      this.permission.id = -0;
                      this.permission.name = "";
                      this.forceUpdate();
                    }}
                    className="mt-3 btn btn-primary btn-xs"
                    disabled={this.permission.id === -0}
                  >
                    Add Permission
                  </button>
                </div>
                <div className="my-3" style={{lineHeight: "45px"}}>
                  {this.permissionList.map(
                    (permission: PermissionModel, index: number) => (
                      <span className="border mx-2 py-2 px-4">
                        <Badge
                          key={JSON.stringify(`${permission}${index}`)}
                          count={
                            <button
                              onClick={() => {
                                this.permissionList.splice(index, 1);
                                this.forceUpdate();
                              }}
                              className="btn-icon glyph-icon simple-icon-close"
                            />
                          }
                          offset={[10, 0]}
                        >
                          <span>{permission.name}</span>
                        </Badge>
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}

const mapDispatchToProps = { featureAdd };
export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
