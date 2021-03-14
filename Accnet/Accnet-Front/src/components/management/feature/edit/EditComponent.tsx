// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Badge from "antd/lib/badge";

// ======================================= component
import SelectPermission from "../../../generals/select/permissions/SelectPermissions";

// ======================================= redux
import { FeatureModel } from "../../../../redux-logic/feature/Type";
import { featureEdit } from "../../../../redux-logic/feature/Action";

// ======================================= services
import { getNotification } from "../../../../service/notification";
import { PermissionModel } from "../../../../redux-logic/permission/Type";

// ==================================================
const initialize: FeatureModel = {
  name: "",
  permissions: [],
  id: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  featureEdit: Function;
  editValue: FeatureModel;
}

class EditComponent extends Component<PropType> {
  requestBody: FeatureModel = { ...initialize };
  feature: PermissionModel = {
    name: "",
    id: -1000
  };

  componentDidUpdate = () => {
    const { visible, editValue } = this.props;
    if (visible) {
      if (this.requestBody.id !== editValue.id) {
        this.requestBody = editValue;
        this.forceUpdate();
      }
    }
  };

  handleSubmit = () => {
    if (this.requestBody.name === "") {
      getNotification("please enter feature name");
      return;
    }
    this.props.featureEdit(this.requestBody);
    this.requestBody = { ...initialize };
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title="Edit Feature"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="btn btn-outline-success"
            >
              Edit
            </button>
          </div>
        }
        onCancel={() => this.props.onVisible()}
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
                    value={this.feature.name}
                    onChange={(event: PermissionModel) => {
                      this.feature.name = event.name;
                      this.feature.id = event.id;
                      this.forceUpdate();
                    }}
                  />
                </div>
                <div className="text-center ">
                  <button
                    onClick={() => {
                      const temp = this.feature;
                      this.requestBody.permissions.push(temp);
                      this.forceUpdate();
                    }}
                    className="mt-3 btn btn-primary btn-xs"
                    disabled={this.feature.name === ""}
                  >
                    Add Permission
                  </button>
                </div>
                <div className="my-3" style={{ lineHeight: "45px" }}>
                  {this.requestBody.permissions.map(
                    (permission: PermissionModel, index: number) => (
                      <span className="border mx-2 py-2 px-4">
                        <Badge
                          key={JSON.stringify(`${permission}${index}`)}
                          count={
                            <button
                              onClick={() => {
                                this.requestBody.permissions.splice(index, 1);
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

const mapDispatchToProps = { featureEdit };
export default connect(mapStateToProps, mapDispatchToProps)(EditComponent);
