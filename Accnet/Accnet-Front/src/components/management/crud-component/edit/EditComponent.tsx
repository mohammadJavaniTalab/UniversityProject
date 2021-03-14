import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";

const initialize: any = {
  name: "",
  lastName: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  editValue: any;
}

class EditComponent extends Component<PropType> {
  requestBody: any = { ...initialize };

  componentDidUpdate = () => {
    const { editValue } = this.props;
    if (editValue.name !== this.requestBody.name) {
      this.requestBody = { ...editValue };
      this.forceUpdate();
    }
  };

  handleSubmit = () => {
    if (this.requestBody.name === "") {
      alert("fill name");
      return;
    }
    // thid.props.add(this.requestBody)
    this.requestBody = { ...initialize };
    this.forceUpdate();
    this.props.onVisible();
  };

  render() {
    return (
      <Modal
        title="Add user"
        visible={this.props.visible}
        footer={null}
        onCancel={() => this.props.onVisible()}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>First Name</label>
                <input
                  value={this.requestBody.name}
                  onChange={e => {
                    this.requestBody.name = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="First Name"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Last Name</label>
                <input
                  value={this.requestBody.lastName}
                  onChange={e => {
                    this.requestBody.lastName = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Add or Edit
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  // AppState
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EditComponent);

