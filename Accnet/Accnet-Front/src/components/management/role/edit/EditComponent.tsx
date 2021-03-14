// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Badge from "antd/lib/badge";

// ======================================= component
import SelectFeature from "../../../generals/select/feature/SelectFeature";

// ======================================= redux
import { RoleAddEditModel, RoleModel } from "../../../../redux-logic/role/Type";
import { roleEdit } from "../../../../redux-logic/role/Action";
import { FeatureModel } from "../../../../redux-logic/feature/Type";

// ======================================= services
import { getNotification } from "../../../../service/notification";
import { getFieldValueFromList } from "../../../../service/public";

// ==========================================================

const initialize: RoleAddEditModel = {
  name: "",
  feature: [],
  id: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  roleEdit: Function;
  editValue: RoleModel;
}

class EditComponent extends Component<PropType> {
  requestBody: RoleAddEditModel = { ...initialize };
  featureList: Array<FeatureModel> = [];
  feature: FeatureModel = {
    name: "",
    permissions: [],
    id: ""
  };

  componentDidUpdate = () => {
    const { visible, editValue } = this.props;
    if (visible) {
      if (editValue.id !== this.requestBody.id) {
        this.featureList = [...editValue.feature];
        this.requestBody.id = editValue.id;
        this.requestBody.name = editValue.name;
        this.requestBody.feature = [];
        this.forceUpdate();
      }
    }
  };

  handleSubmit = () => {
    if (this.requestBody.name === "") {
      getNotification("Please enter role name");
      return;
    }
    this.requestBody.feature = getFieldValueFromList(this.featureList, "id");
    if (this.requestBody.feature.length === 0) {
      getNotification("Please enter feature");
      return;
    }
    this.props.roleEdit(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.featureList = [];
    this.feature = {
      name: "",
      permissions: [],
      id: ""
    };
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title="Edit Role"
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
                  placeholder="Enter role name"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Feature</label>
                <div>
                  <SelectFeature
                    value={this.feature.name}
                    onChange={(event: FeatureModel) => {
                      this.feature.name = event.name;
                      this.feature.id = event.id ? event.id : "";
                      this.forceUpdate();
                    }}
                  />
                </div>
                <div className="text-center ">
                  <button
                    onClick={() => {
                      const temp = { ...this.feature };
                      this.featureList.push(temp);
                      this.feature.id = "";
                      this.feature.name = "";
                      this.forceUpdate();
                    }}
                    className="mt-3 btn btn-primary btn-xs"
                    disabled={this.feature.name === ""}
                  >
                    Add Feature
                  </button>
                </div>
                <div className="my-3" style={{lineHeight: "45px"}}>
                  {this.featureList.map(
                    (feature: FeatureModel, index: number) => (
                      <span className="border mx-2 py-2 px-4">
                        <Badge
                          key={JSON.stringify(`${feature}${index}`)}
                          count={
                            <button
                              onClick={() => {
                                this.featureList.splice(index, 1);
                                this.forceUpdate();
                              }}
                              className="btn-icon glyph-icon simple-icon-close"
                            />
                          }
                          offset={[10, 0]}
                        >
                          <span>{feature.name}</span>
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

const mapDispatchToProps = { roleEdit };
export default connect(mapStateToProps, mapDispatchToProps)(EditComponent);
