// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";

// ======================================= redux
import {
  InvoiceListModel,
  invoiceStatusObject 
} from "../../../../redux-logic/invoice/Type";

// ======================================= services
import { amountSign } from "../../../../service/constants/defaultValues";
import { checkFieldIsOk } from "../../../../service/public";

// ====================================================================

interface PropType {
  visible: boolean;
  onVisible: Function;
  editValue: InvoiceListModel;
}

class InvoiceDetails extends Component<PropType> {
  render() {
    const { editValue, onVisible } = this.props;
    return (
      <Modal
        title="Invoice details"
        visible={this.props.visible}
        destroyOnClose
        maskClosable={false}
        footer={null}
        onCancel={() => onVisible()}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <b>User : </b>
                <span className="mx-1">
                  {checkFieldIsOk(editValue.user)
                    ? editValue.user.username
                    : ""}
                </span>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <b>Status : </b>
                <span className="mx-1">
                  {invoiceStatusObject[editValue.status]}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <b>Title : </b>
                <span className="mx-1">{editValue.title}</span>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <b>Amount : </b>
                <span className="mx-2">{amountSign}</span>
                <span>{editValue.amount}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <b className="d-block">Invoice Description : </b>
                <span>{editValue.description}</span>
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

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceDetails);
