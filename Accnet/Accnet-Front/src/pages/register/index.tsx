// ======================================= modules
import React, { Component } from "react";
import { connect } from "react-redux";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Checkbox from "antd/lib/checkbox";
import Select from "antd/lib/select";
import Modal from "antd/lib/modal";
import { navigate, Link } from "gatsby";

// ======================================= redux
import { AppState } from "../../redux-logic/Store";
import {
  register,
  RegisterReset,
} from "../../redux-logic/auth/register/Action";
import { RegisterResponse } from "../../redux-logic/auth/register/Type";

// ======================================= services
import AllImages from "../../assets/images/images";
import { getWindowAfterSSR } from "../../service/public";
import { pathProject } from "../../service/constants/defaultValues";

// ======================================= css
import "./style.scss";
import ReCAPTCHA from "react-google-recaptcha";

interface PropsType {
  form: any;
  registerResponse: RegisterResponse;
  register: Function;
  RegisterReset: Function;
}
class index extends Component<PropsType> {
  confirmDirty: boolean = false;
  agreeTermAndCondition: boolean = false;
  agreePrivacyAndPolicy : boolean = false

  componentDidUpdate = () => {
    const { registerResponse } = this.props;
    if (registerResponse.success) {
      this.goToDashboardPage();
    }
  };

  goToDashboardPage = () => {
    const { registerResponse } = this.props;
    Modal.confirm({
      content: (
        <div>
          <div>
            <b className="text-success">Your Registration Was Successful</b>
          </div>
          <div>
            <span>Your User Name in Our System Will Be : </span>
            <b className="text-danger">{registerResponse.data.username}</b>
          </div>
        </div>
      ),
      okText: "Go To Dashboard!",
      onOk: () => {
        Modal.destroyAll();
        navigate(pathProject.client.taxes);
        this.props.RegisterReset();
      },
      onCancel: () => {
        this.goToLogin();
      },
    });
  };

  goToLogin = () => {
    Modal.confirm({
      content: "",
      title:
        "If you choose to not go to dashboard now, you can always see your dashboard by using login section. are you sure you want to cancel?",
      okText: "Yes , I login Later.",
      cancelText: "No , Take Me To Dashboard",
      onOk: () => {
        navigate(pathProject.login);
        this.props.RegisterReset();
      },
      onCancel: () => {
        navigate(pathProject.client.taxes);
        this.props.RegisterReset();
      },
    });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const update: any = {
          lastname: values.lastname,
          password: values.password,
          firstname: values.firstname,
          email: values.email,
          mobile: values.mobile,
          gender: values.gender,
          captcha: this.googleVerificationCode,
        };
        this.props.register(update);
      }
    });
  };
  googleVerificationCode: string | null = "";

  checkForCapitalLetter = (password: string) => {
    let passwordArray = password.split("");
    for (let i = 0; i < passwordArray.length; i++) {
      if (/[a-zA-Z]/.test(passwordArray[i])) {
        if (/[A-Z]/.test(passwordArray[i])) {
          return true;
        }
      }
    }
    return false;
  };

  checkForStrongPassword = (rule: any, value: any, callback: any) => {
    let password = String(value);
    let containsCapital: boolean = this.checkForCapitalLetter(password);
    let containsNumeric: boolean = /\d/.test(password);
    if (containsCapital && containsNumeric) {
      return true;
    }
    return false;
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

  compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback(" ");
    } else {
      callback();
    }
  };

  render() {
    const { Option } = Select;
    const {
      form: { getFieldDecorator },
      registerResponse,
    } = this.props;
    return (
      <div className="register-form">
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
          <div className="col-md-7 form-content bg-white">
            <div className="welcome-to-accnet">
              <span>Create Account in AccNet Online</span>
            </div>
            <Form onSubmit={this.handleSubmit}>
              <div className="form-row mx-0">
                <div className="form-group col-md-6 select-gender pl-0 pt-0 custom-px-0">
                  <Form.Item>
                    {getFieldDecorator("gender", { initialValue: "Mr" })(
                      <Select className="w-100">
                        <Option value="Mr">Mr</Option>
                        <Option value="Mrs">Mrs</Option>
                        <Option value="Ms">Ms</Option>
                        <Option value="Miss">Miss</Option>
                        <Option value="Unknown">Unknown</Option>
                      </Select>
                    )}
                  </Form.Item>
                </div>
                <div className="form-group col-md-7 pr-0 custom-px-0"></div>
              </div>
              <div className="form-row mx-0">
                <div className="form-group col-lg-6 pl-0 pr-md-0 pr-lg-3 custom-px-0">
                  <Form.Item>
                    {getFieldDecorator("firstname", {
                      rules: [
                        {
                          required: true,
                          message: "Please fill your first name",
                        },
                      ],
                    })(
                      <Input
                        className="form-control input-login-form"
                        placeholder="First name"
                        maxLength={32}
                      />
                    )}
                  </Form.Item>
                </div>
                <div className="form-group col-lg-6 pr-0 pl-md-0 pl-lg-3 custom-px-0">
                  <Form.Item>
                    {getFieldDecorator("lastname", {
                      rules: [
                        {
                          required: true,
                          message: "Please fill your last name",
                        },
                      ],
                    })(
                      <Input
                        className="form-control input-login-form"
                        placeholder="Last name"
                        maxLength={32}
                      />
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className="form-row mx-0">
                <div className="form-group col-lg-6 pl-0 pr-md-0 pr-lg-3 custom-px-0">
                  <Form.Item>
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          type: "email",
                          message: "This E-mail is not valid",
                        },
                        {
                          required: true,
                          message: " ",
                        },
                      ],
                    })(
                      <Input
                        className="form-control input-login-form"
                        placeholder="Email"
                        maxLength={32}
                      />
                    )}
                  </Form.Item>
                </div>
                <div className="form-group col-lg-6 pr-0 pl-md-0 pl-lg-3 custom-px-0">
                  <Form.Item>
                    {getFieldDecorator("mobile", {
                      rules: [
                        {
                          required: true,
                          message: "Please fill your mobile",
                        },
                      ],
                    })(
                      <Input
                        className="form-control input-login-form"
                        placeholder="Mobile"
                        // pattern="[0-9]*"
                        // maxLength={15}
                      />
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className="form-row mx-0">
                <div className="form-group col-lg-6 pl-0 pr-md-0 pr-lg-3 custom-px-0">
                  <Form.Item hasFeedback>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Include",
                        },
                        {
                          validator: this.checkForStrongPassword,
                          message: "(A-Z , a-z , 0-9)",
                        },
                      ],
                    })(
                      <Input.Password
                        className="form-control input-login-form"
                        placeholder="password"
                        maxLength={15}
                      />
                    )}
                  </Form.Item>
                </div>
                <div className="form-group col-lg-6 pr-0 pl-md-0 pl-lg-3 custom-px-0">
                  <Form.Item hasFeedback>
                    {getFieldDecorator("confirm", {
                      rules: [
                        {
                          required: true,
                          message: "Please fill your confirm password",
                        },
                        {
                          validator: this.compareToFirstPassword,
                        },
                      ],
                    })(
                      <Input.Password
                        className="form-control input-login-form"
                        placeholder="Confirm"
                        maxLength={15}
                        onBlur={this.handleConfirmBlur}
                      />
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className="form-group">
                <div className="form-check my-3 pl-0">
                  <div className="font-weight-bold w-100 text-center">
                    <span>Already Have An Account? </span>
                    <span className="text-check-color">
                      <Link to={pathProject.login}>Login!</Link>
                    </span>
                  </div>
                </div>
              </div>
           
              <div className="form-group">
                <div className="w-100 text-center">
                  <Checkbox
                    checked={this.agreeTermAndCondition}
                    onChange={() => {
                      this.agreeTermAndCondition = !this.agreeTermAndCondition;
                      this.forceUpdate();
                    }}
                  >
                    <span>I Agree To All Accnet</span>
                    <span className="text-check-color">
                      <Link className="px-2" to={pathProject.term}>
                        Terms and Conditions 
                      </Link>
                      and
                      <Link className="px-2" to={pathProject.policy}>
                        Privacy Policies
                      </Link>
                    </span>
                  </Checkbox>
                </div>
              </div>
        
              <Form.Item>
                <div className="ml-3 mb-3 w-100 text-center">
                  <ReCAPTCHA
                    sitekey={"6LewOu4UAAAAAKXx3f0SZ-twVtWmzsWh3IiVpzCz"}
                    onChange={(token: string | null) => {
                      this.googleVerificationCode = token;
                      this.forceUpdate();
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    !(
                      this.agreeTermAndCondition === true &&
                      this.googleVerificationCode !== ""
                    )
                  }
                  className="btn btn-primary btn-register-login mb-0 mt-2"
                >
                  {registerResponse.loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <span>REGISTER NOW</span>
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
    registerResponse: state.registerReducer,
  };
}

const mapDispatchToProps = { register, RegisterReset };

const WrappedRegistrationForm = Form.create({ name: "register" })(index);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedRegistrationForm);
