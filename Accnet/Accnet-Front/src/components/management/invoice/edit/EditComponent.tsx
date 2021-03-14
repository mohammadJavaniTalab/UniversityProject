// ======================================= modules
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";
import Select from "antd/lib/select";

// ======================================= component
import SelectUser from "../../../generals/select/user/SelectUser";

// ======================================= redux
import {
  InvoiceEditModel,
  InvoiceListModel,
  InvoiceStatusType
} from "../../../../redux-logic/invoice/Type";
import { UserModel } from "../../../../redux-logic/user/Type";
import { invoiceEdit } from "../../../../redux-logic/invoice/Action";
import { getNotification } from "../../../../service/notification";
import SelectInvoiceStatus from "../../../generals/select/invoice/SelectInvoiceStatus";

// ============================================================

const initialize: InvoiceEditModel = {
  title: "",
  description: "",
  amount: -0,
  status: 1,
  enabled: false,
  id: ""
};

interface PropType {
  visible: boolean;
  onVisible: Function;
  invoiceEdit: Function;
  editValue: InvoiceListModel;
}

class EditComponent extends Component<PropType> {
  requestBody: InvoiceEditModel = { ...initialize };
  userName: string = "";

  componentDidUpdate = () => {
    const { visible, editValue } = this.props;
    if (visible) {
      if (editValue.id !== this.requestBody.id) {
        this.requestBody.id = editValue.id;
        this.requestBody.title = editValue.title;
        this.requestBody.description = editValue.description;
        this.requestBody.amount = editValue.amount;
        this.requestBody.status = editValue.status;
        this.requestBody.enabled = editValue.enabled;
        this.forceUpdate();
      }
    }
  };

  handleSubmit = () => {
    if (this.requestBody.title === "") {
      getNotification("Please enter invoice title");
      return;
    }
    if (this.requestBody.description === "") {
      getNotification("Please enter invoice description");
      return;
    }

    if (this.requestBody.amount === -0) {
      getNotification("Please enter invoice amount");
      return;
    }
    this.props.invoiceEdit(this.requestBody);
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
        title="Edit invoice"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="mb-2 btn btn-outline-success"
            >
              Edit
            </button>
          </div>
        }
        onCancel={this.closeModal}
      >
        <Fragment>
          <div className="container">
            <div className="row">
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
                    type="text"
                    pattern="[0-9]*"
                    maxLength={15}
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
          </div>
        </Fragment>
      </Modal>
    );
  }
}

function mapStateToProps(state: any) {
  // AppState
  return {};
}

const mapDispatchToProps = { invoiceEdit };

export default connect(mapStateToProps, mapDispatchToProps)(EditComponent);
