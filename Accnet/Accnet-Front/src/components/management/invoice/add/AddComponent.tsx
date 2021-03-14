// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";
import Select from "antd/lib/select";

// ======================================= component
import SelectUser from "../../../generals/select/user/SelectUser";

// ======================================= redux
import {
  InvoiceAddModel,
  invoiceStatusObject,
  InvoiceStatusType
} from "../../../../redux-logic/invoice/Type";
import { UserModel } from "../../../../redux-logic/user/Type";
import { invoiceAdd } from "../../../../redux-logic/invoice/Action";
import { getNotification } from "../../../../service/notification";
import SelectInvoiceStatus from "../../../generals/select/invoice/SelectInvoiceStatus";

// ============================================================

const initialize: InvoiceAddModel = {
  title: "",
  description: "",
  amount: -0,
  status: 1,
  enabled: false,
  userId: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  invoiceAdd: Function;
}

class AddComponent extends Component<PropType> {
  requestBody: InvoiceAddModel = { ...initialize };
  userName: string = "";

  handleSubmit = () => {
    if (this.requestBody.title === "") {
      getNotification("Please enter invoice title");
      return;
    }
    if (this.requestBody.description === "") {
      getNotification("Please enter invoice description");
      return;
    }
    if (this.requestBody.userId === "") {
      getNotification("Please enter invoice user");
      return;
    }

    if (this.requestBody.amount === -0) {
      getNotification("Please enter invoice amount");
      return;
    }
    this.props.invoiceAdd(this.requestBody);
    this.closeModal();
  };

  closeModal = () => {
    this.requestBody = { ...initialize };
    this.userName = "";
    this.props.onVisible();
    this.forceUpdate();
  };

  render() {
    const { Option } = Select;
    return (
      <Modal
        title="Add invoice"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Add
            </button>
          </div>
        }
        onCancel={this.closeModal}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>User</label>
                <div>
                  <SelectUser
                    value={this.userName}
                    onChange={(event: UserModel) => {
                      this.requestBody.userId = event.id;
                      this.userName = event.username;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Status</label>
                <div>
                  <SelectInvoiceStatus
                    value={this.requestBody.status}
                    onChange={(event: InvoiceStatusType) => {
                      this.requestBody.status = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Title</label>
                <input
                  value={this.requestBody.title}
                  onChange={e => {
                    this.requestBody.title = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter title"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Amount</label>
                <input
                  value={
                    this.requestBody.amount === -0
                      ? undefined
                      : this.requestBody.amount
                  }
                  onChange={e => {
                    this.requestBody.amount =
                      e.target.value === "" ? -0 : Number(e.target.value);
                    this.forceUpdate();
                  }}
                  min="0"
                  pattern="[0-9]*"
                  maxLength={15}
                  type="text"
                                    className="form-control"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>Invoice Description</label>
                <textarea
                  style={{ height: "120px", resize: "none" }}
                  value={this.requestBody.description}
                  onChange={e => {
                    this.requestBody.description = e.target.value;
                    this.forceUpdate();
                  }}
                  className="form-control"
                  placeholder="Enter description"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label>Show to user</label>
                <div>
                  <Switch
                    checked={this.requestBody.enabled}
                    onChange={(event: boolean) => {
                      this.requestBody.enabled = event;
                      this.forceUpdate();
                    }}
                  />
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
  // AppState
  return {};
}

const mapDispatchToProps = { invoiceAdd };

export default connect(mapStateToProps, mapDispatchToProps)(AddComponent);
