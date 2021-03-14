import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../redux-logic/Store";
import { Form, Input, Button } from "antd";
import { login } from "../redux-logic/auth/generate-token/Action";

import "./style.scss";
import { Link, navigate } from "gatsby";
import { LoginResponse } from "../redux-logic/auth/generate-token/Type";
import AllImages from "../assets/images/images";
import { pathProject } from "../service/constants/defaultValues";
import { getWindowAfterSSR } from "../service/public";
import ReCAPTCHA from "react-google-recaptcha";

interface PropsType {
  form: any;
  login: Function;
  loginResponse: LoginResponse;
}
class index extends Component<PropsType> {
  confirmDirty: boolean = false;

  componentDidUpdate = () => {
    const { loginResponse } = this.props;
    if (loginResponse.success) {
      setTimeout(() => {
        switch (loginResponse.data.role.name) {
          case "MasterAdmin":
            if (getWindowAfterSSR()) {
              window.location.href = pathProject.management.tax;
            }
            break;
          case "NormalUser":
            if (getWindowAfterSSR()) {
              window.location.href = pathProject.client.taxes;
            }
            break;
          default:
            if (getWindowAfterSSR()) {
              window.location.href = pathProject.client.taxes;
            }
            break;
        }
      }, 500);
    }
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const update: any = {
          username: values.userName,
          password: values.password,
          captcha : this.googleVerificationCode
        };
        this.props.login(update);
      }
    });
  };

  validateToNextPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && this.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  handleConfirmBlur = (e: any) => {
    const { value } = e.target;
    this.confirmDirty = this.confirmDirty || !!value;
    this.forceUpdate();
  };

  googleVerificationCode: string | null = "";

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { loginResponse } = this.props;
    return (
      <div className="login-form">
        <div className="row m-0 h-100">
          <div className="col-md-5 p-0 background-block">
            <div className="image"></div>
            <div className="box-logo">
              <img
                src={AllImages.logo_back}
                alt="final-logo"
                className="final-logo w-100"
              />
            </div>
          </div>
          <div className="col-md-7 form-content bg-white pt-70 pb-70">
            <div className="welcome-to-accnet">
              <span>Welcome to AccNet Online</span>
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
                      className="form-control input-login-form"
                      placeholder="User name or Email"
                      maxLength={32}
                    />
                  )}
                </Form.Item>
              </div>
              <div className="form-group">
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: " ",
                      },
                    ],
                  })(
                    <Input
                      className="form-control input-login-form"
                      placeholder="Password"
                      type="password"
                      maxLength={15}
                    />
                  )}
                </Form.Item>
              </div>
              <div className="mb-3">
                <ReCAPTCHA
                  sitekey={"6LewOu4UAAAAAKXx3f0SZ-twVtWmzsWh3IiVpzCz"}
                  onChange={(token: string | null) => {
                    this.googleVerificationCode = token;
                    this.forceUpdate();
                  }}
                />
              </div>

              <div className="padding-x-15">
                <Form.Item>
                  <button
                    type="submit"
                    className="btn btn-primary btn-register-login mb-0 mt-0"
                    disabled={
                      loginResponse.loading ||
                      this.googleVerificationCode === null ||
                      this.googleVerificationCode === ""
                    }
                  >
                    {loginResponse.loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="login-txt">LOG IN</span>
                    )}
                  </button>
                </Form.Item>
                <div className="mt-3">
                  <Button
                    className="text-check-color w-100 text-center"
                    type="link"
                    onClick={() => {
                      navigate(pathProject.forgot_password);
                    }}
                  >
                    Forgot Password?{" "}
                  </Button>
                </div>
              </div>
              <div className="form-group text-center">
                <div className="w-100 my-3">
                  <span className="or">OR</span>
                </div>
                <span>
                  <span>New User?</span>
                  <Link to={pathProject.register}>
                    <span className="text-check-color"> Register Now! </span>
                  </Link>
                </span>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    loginResponse: state.loginReducer,
  };
}

const mapDispatchToProps = { login };

const WrappedRegistrationForm = Form.create({ name: "login" })(index);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedRegistrationForm);
