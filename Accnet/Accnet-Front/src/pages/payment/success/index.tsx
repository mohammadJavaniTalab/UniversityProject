import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Empty from "antd/lib/empty";
import { AppState } from "../../../redux-logic/Store";
import LayoutClient from "../../../components/client/layout/LayoutClient";
import {
  pathProject,
  dashboard_Type,
  amountSign,
} from "../../../service/constants/defaultValues";
import {
  PayPalCaptureOrderModel,
  PayPalCaptureOrderResponseModel,
} from "../../../redux-logic/payPal/Type";
import { payPalCaptureOrder } from "../../../redux-logic/payPal/Action";
import {
  getValueFromParam,
  getTimeAndDate,
  checkFieldIsOk,
  getWindowAfterSSR,
} from "../../../service/public";
import AllImages from "../../../assets/images/images";
import "./styles.scss";
import { Button } from "antd";
import { navigate } from "gatsby";

interface PropsType {
  payPalCaptureOrder: Function;
  paymentResponse: PayPalCaptureOrderResponseModel;
}
class index extends Component<PropsType> {
  componentDidMount = () => {
    const { payPalCaptureOrder } = this.props;
    const requestBody: PayPalCaptureOrderModel = {
      invoiceId: getValueFromParam("invoiceId"),
      payerId: getValueFromParam("token"),
      token: getValueFromParam("PayerID"),
    };
    payPalCaptureOrder(requestBody);
  };
  render() {
    const { paymentResponse } = this.props;
    return (
      <LayoutClient
        path={pathProject.payment.failed}
        name={dashboard_Type.payment_success}
        selectBar={false}
      >
        <div className="payment-success">
          <div className="container width-container">
            <div className="card rounded-20 mt-4">
              <div className="card-body text-center">
                {!paymentResponse.loading && paymentResponse.success ? (
                  <Fragment>
                    <div className="success-payment-icon">
                      <span className="fa fa-check-circle text-success success-icon" />
                      <span className="success-payment-text">
                        Successful Payment
                      </span>
                    </div>
                    <div className="text-left mt-4">
                      <div className="px-4 my-2">
                        <span>
                          Thank you for the payment. Your request will now be
                          worked on by one of our professionals.
                        </span>
                      </div>
                      <div className="px-4 my-2">
                        <b className="text-muted">Amount : </b>
                        <span className="mx-2">
                          {checkFieldIsOk(paymentResponse.data) ? (
                            <span>
                              <span className="mx-2">{amountSign}</span>
                              <span>{paymentResponse.data.amount}</span>
                            </span>
                          ) : null}
                        </span>
                      </div>
                      <div className="px-4 my-2">
                        <b className="text-muted">Confirmation ID : </b>
                        <span>
                          {checkFieldIsOk(paymentResponse.data)
                            ? paymentResponse.data.id
                            : null}
                        </span>
                      </div>
                      <div className="px-4 my-2 w-100 text-center">
                      <Button
                        type="link"
                        onClick={() => {
                          if (getWindowAfterSSR()) {
                            navigate("/client/taxes" , {replace : true})
                          }
                        }}
                      >
                        Go to Dashboard!
                      </Button>
                      </div>
                    </div>
                  </Fragment>
                ) : null}
                {!paymentResponse.loading && !paymentResponse.success ? (
                  <Fragment>
                    <div className="success-payment-icon">
                      <span className="fa fa-check-circle text-success success-icon" />
                      <span className="success-payment-text">
                        Successful Payment
                      </span>
                    </div>
                    <div className="mt-5">
                      <b className="d-block">
                        There seems to be an issue with connection to server,
                        please reload the page if the problem persist contact
                        support team.
                      </b>
                    </div>
                    <div className="px-4 my-2">
                      <Button
                        type="link"
                        onClick={() => {
                          if (getWindowAfterSSR()) {
                            navigate("/client/taxes" , {replace : true})
                          }
                        }}
                      >
                        Go to Dashboard!
                      </Button>
                    </div>
                  </Fragment>
                ) : null}
                {paymentResponse.loading ? (
                  <div className="text-center py-3">
                    <Empty
                      description={<span>Please wait ...</span>}
                      image={AllImages.loading}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </LayoutClient>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    paymentResponse: state.payPalCaptureOrderReducer,
  };
}

const mapDispatchToProps = { payPalCaptureOrder };

export default connect(mapStateToProps, mapDispatchToProps)(index);
