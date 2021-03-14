import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";
import { getNotification } from "../../../../service/notification";

const initialize: any = {
  name: "",
  lastName: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: any = { ...initialize };

  handleSubmit = () => {
    if (this.requestBody.name === "") {
      getNotification("dfghjkl")
      return;
    }
    // thid.props.add(this.requestBody)
    this.closeModal()
  };

  closeModal = () =>{
    this.requestBody = { ...initialize };
    this.forceUpdate();
    this.props.onVisible();
  }

  render() {
    return (
      <Modal
        title="Add user"
        visible={this.props.visible}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Add or Edit
            </button>
          </div>
        }
        onCancel={() => this.closeModal()}
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
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
