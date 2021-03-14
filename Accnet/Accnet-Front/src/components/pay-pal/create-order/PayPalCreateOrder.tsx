import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import { AppState } from "../../../redux-logic/Store";
import { payPalCreateOrder } from "../../../redux-logic/payPal/Action";
import { PayPalCreateOrderResponseModel } from "../../../redux-logic/payPal/Type";
import { getWindowAfterSSR } from "../../../service/public";
import AllImages from "../../../assets/images/images";

interface PropsType {
  payPalCreateOrder: Function;
  id: string;
  payPalResponse: PayPalCreateOrderResponseModel;
}
class PayPalCreateOrder extends Component<PropsType> {
  currentId: string = "";
  componentDidUpdate = () => {
    const { payPalResponse } = this.props;
    if (payPalResponse.success) {
      if (getWindowAfterSSR()) {
        window.location.href = payPalResponse.data;
      }
    }
  };
  render() {
    const { payPalCreateOrder, id, payPalResponse } = this.props;
    return (
      <Fragment>
        <span className="d-block">
          {payPalResponse.loading && this.currentId === id ? (
            <span>
              <span
                className="spinner-border spinner-border-sm m-2"
                role="status"
                aria-hidden="true"
              />
            </span>
          ) : payPalResponse.loading ? (
            <div className="row">
              <div className="col p-0">
                <img
                  src={AllImages.icon.master}
                  alt="pay-pal icon"
                  style={{ width: "50px" }}
                  className="cursor-not-allowed"
                />
              </div>
              <div className="col p-0">
                <img
                  src={AllImages.icon.visa}
                  alt="pay-pal icon"
                  style={{ width: "50px" }}
                  className="cursor-not-allowed"
                />
              </div>
              <div className="col p-0">
                <img
                  src={AllImages.icon.apex}
                  alt="pay-pal icon"
                  style={{ width: "50px" }}
                  className="cursor-not-allowed"
                />
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col p-0">
                <img
                  src={AllImages.icon.master}
                  alt="pay-pal icon"
                  style={{ width: "50px" }}
                  className="cursor-pointer"
                  onClick={() => {
                    this.currentId = id;
                    this.forceUpdate();
                    payPalCreateOrder({ id });
                  }}
                />
              </div>
              <div className="col p-0">
                <img
                  src={AllImages.icon.visa}
                  alt="pay-pal icon"
                  style={{ width: "50px" }}
                  className="cursor-pointer"
                  onClick={() => {
                    this.currentId = id;
                    this.forceUpdate();
                    payPalCreateOrder({ id });
                  }}
                />
              </div>
              <div className="col p-0">
                <img
                  src={AllImages.icon.apex}
                  alt="pay-pal icon"
                  style={{ width: "50px" }}
                  className="cursor-pointer"
                  onClick={() => {
                    this.currentId = id;
                    this.forceUpdate();
                    payPalCreateOrder({ id });
                  }}
                />
              </div>
            </div>
          )}
        </span>
        <span
          className="cursor-pointer d-block"
          onClick={() => {
            Modal.info({
              title: `Don't want to use your credit card? Call us toll free at +1(866)-528-8007 for alternate payment options. We ask you to complete the payment before we work on your tax return. Thank you.`,
              content: null,
              onOk() {},
            });
          }}
        >
          In Person
        </span>
      </Fragment>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    payPalResponse: state.payPalCreateOrderReducer,
  };
}

const mapDispatchToProps = { payPalCreateOrder };

export default connect(mapStateToProps, mapDispatchToProps)(PayPalCreateOrder);
