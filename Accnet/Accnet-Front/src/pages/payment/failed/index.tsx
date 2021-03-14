import React, { Component, Fragment } from "react";

import LayoutClient from "../../../components/client/layout/LayoutClient";
import {
  pathProject,
  dashboard_Type,
} from "../../../service/constants/defaultValues";
import "./styles.scss";
import { Button } from "antd";
import { getWindowAfterSSR } from "../../../service/public";
import { navigate } from "gatsby";

export default class index extends Component {
  render() {
    return (
      <LayoutClient
        path={pathProject.payment.failed}
        name={dashboard_Type.payment_failed}
        selectBar={false}
      >
        <div className="payment-success">
          <div className="container width-container">
            <div className="card rounded-20 mt-4">
              <div className="card-body text-center"></div>
              <Fragment>
                <div className="success-payment-icon">
                  <span className="fa fa-times-circle text-danger success-icon" />
                  <span className="success-payment-text">
                    Payment Failed
                  </span>
                </div>
                <div className="mt-5">
                  <b className="d-block w-100 text-center">
                    Your payment got failed, If Any Error
                    Occurred During Payment Time Please Contact Our Support
                    Team!
                  </b>
                </div>
                <div className="px-4 my-2 w-100 text-center">
                  <Button
                    type="link"
                    onClick={() => {
                      if (getWindowAfterSSR()) {
                        navigate("/client/taxes", { replace: true });
                      }
                    }}
                  >
                    Go to Dashboard!
                  </Button>
                </div>
              </Fragment>
            </div>
          </div>
        </div>
      </LayoutClient>
    );
  }
}
