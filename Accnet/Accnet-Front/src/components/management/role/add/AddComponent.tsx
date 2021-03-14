// ======================================= module
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Badge from "antd/lib/badge";

// ======================================= component
import SelectFeature from "../../../generals/select/feature/SelectFeature";

// ======================================= redux
import { RoleAddEditModel } from "../../../../redux-logic/role/Type";
import { roleAdd } from "../../../../redux-logic/role/Action";
import { NameIdModel } from "../../../../redux-logic/essentials-tools/type/Basic-Object-type";
import { FeatureModel } from "../../../../redux-logic/feature/Type";

// ======================================= service
import { getNotification } from "../../../../service/notification";
import { getFieldValueFromList } from "../../../../service/public";

const initialize: RoleAddEditModel = {
  name: "",
  feature: []
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  roleAdd: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: RoleAddEditModel = { ...initialize };
  featureList: Array<NameIdModel> = [];
  feature: NameIdModel = {
    name: "",
    id: ""
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
    this.props.roleAdd(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.featureList = [];
    this.feature = {
      name: "",
      id: ""
    };
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title="Add Role"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-right">
            <button onClick={this.handleSubmit} className="btn btn-primary">
              Add
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
      >
        <div className="container px-0">
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
              <div className="form-group mb-0">
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
                <div className="text-right">
                  <button
                    onClick={() => {
                      const temp = { ...this.feature };
                      this.featureList.push(temp);
                      this.feature.id = "";
                      this.feature.name = "";
                      this.forceUpdate();
                    }}
                    className="mt-3 btn btn-outline-primary"
                    disabled={this.feature.name === ""}
                  >
                    Add Feature
                  </button>
                </div>
                <div className="my-3 empty-item" style={{lineHeight: "45px"}}>
                  {this.featureList.map((fea: NameIdModel, index: number) => (
                    <span className="border mx-2 py-2 px-4">
                      <Badge
                        key={JSON.stringify(`${fea}${index}`)}
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
                        <span>{fea.name}</span>
                      </Badge>
                    </span>
                  ))}
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

const mapDispatchToProps = { roleAdd };
export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
