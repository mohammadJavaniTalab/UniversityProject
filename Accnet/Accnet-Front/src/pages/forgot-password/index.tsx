import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../redux-logic/Store";
import { Form, Input } from "antd";
import { forgotPassword } from "../../redux-logic/auth/forgot-password/Action";
import { Link } from "gatsby";
import { LoginResponse } from "../../redux-logic/auth/generate-token/Type";
import AllImages from "../../assets/images/images";

import "./style.scss";
import { pathProject } from "../../service/constants/defaultValues";

interface PropsType {
  form: any;
  forgotPassword: Function;
  forgotPasswordResponse: LoginResponse;
}
class index extends Component<PropsType> {
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const update: any = {
          keyword: values.userName,
        };
        this.props.forgotPassword(update);
      }
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { forgotPasswordResponse } = this.props;
    return (
      <div className="forgot-password">
        <div className="row m-0 h-100">
          <div className="col-md-5 p-0 background-block min-height-600">
            <div className="image"></div>
            <div className="box-logo">
              <img
                src={AllImages.logo_back}
                alt="final-logo"
                className="final-logo w-100"
              />
            </div>
          </div>
          <div className="col-md-7 form-content bg-white">
            <div className="welcome-to-accnet mt-md-5 mt-0 pt-md-4 pt-0">
              <span>Forgot Password</span>
            </div>

            <Form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("userName", {
                    rules: [
                      {
                        required: true,
                        message: " ",
                      },
                    ],
                  })(
                    <Input
                      className="form-control input-forgot-password"
                      placeholder="User name or Email"
                      maxLength={32}
                    />
                  )}
                </Form.Item>
              </div>
              <div className="form-group">
                <div className="form-check my-3 px-0 text-center">
                  <span>I Know My Password ! </span>
                  <Link to={pathProject.login}>
                    <span className="text-check-color"> Login </span>
                  </Link>
                </div>
              </div>
              <Form.Item>
                <button
                  type="submit"
                  className="btn btn-primary btn-register-login mb-0 mt-0"
                  disabled={forgotPasswordResponse.loading}
                >
                  {forgotPasswordResponse.loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <span>SEND PASSWORD IN MY EMAIL</span>
                  )}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    forgotPasswordResponse: state.forgotPasswordReducer,
  };
}

const mapDispatchToProps = { forgotPassword };

const WrappedRegistrationForm = Form.create({ name: "forgot-password" })(index);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedRegistrationForm);
