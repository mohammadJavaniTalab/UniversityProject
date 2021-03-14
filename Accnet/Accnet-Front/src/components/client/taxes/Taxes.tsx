// ======================================= modules
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";

// ======================================= component
import EditProfile from "../../profile/EditProfile/EditProfile";
// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { taxList } from "../../../redux-logic/tax/Action";
import {
  TaxResponse,
  TaxModel,
  BasicTaxModel,
} from "../../../redux-logic/tax/Type";
import { ProfileResponse } from "../../../redux-logic/auth/profile/Type";

import {
  EngagementResponse,
  getEngagementRedirectUrl,
} from "../../../redux-logic/docusign/engagement/Action";
import {
  TaxFormResponse,
  getTaxFormRedirectUrl,
} from "../../../redux-logic/docusign/tax-form/Action";

// ======================================= services
import {
  getWindowAfterSSR,
} from "../../../service/public";

// ======================================= css
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";
import { CrudObject } from "../../../redux-logic/essentials-tools/type/Basic-Object-type";

import {  Table } from "antd";
import Consultant from "../../consultant/Consultant";
import TaxFiles from "./tax-files/TaxFiles";
import { initialUserModel } from "../../../redux-logic/auth/profile/InitialResponse";
import CalculateMyTaxes from "../UserSurvey/survey-related/CalculateMyTaxes";


// ======================================= interface
interface PropsType {
  taxList: Function;
  taxResponse: TaxResponse;
  profileResponse: ProfileResponse;
  getTaxFormRedirectUrl: any;
  getEngagementRedirectUrl: any;
  engagementResponse: EngagementResponse;
  taxFormResponse: TaxFormResponse;
}

class Taxes extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageSize: 10,
    PageNumber: 0,
  };
  visible: boolean = false;

  editProfile: CrudObject = {
    visible: false,
    update: false,
    edit: false,
    value: {},
    valueIndex: 0,
  };

  firstView: boolean = true;
  surveyCloseAble: boolean = true;

  componentDidMount = () => {
    this.props.taxList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { profileResponse } = this.props;
    if (!profileResponse.loading) {
      if (profileResponse.success) {
        if (!profileResponse.data.hasDoneSurvey) {
          if (this.firstView) {
            this.firstView = false;
            this.newUser();
          }
        }
      }
    }

    if (this.props.taxResponse.updateList) {
      this.editTaxFiles = false;
      this.selectedTaxModel = {
        ...this.initialTaxModel,
      };
      this.props.taxList(this.requestBody);
    }
  };

  onVisible = () => {
    this.visible = !this.visible;
    this.forceUpdate();
  };

  onChange = (name: "editProfile", value: CrudObject) => {
    if (!value.visible) {
      this.visible = true;
    }
    this[name] = value;
    this.forceUpdate();
  };

  getTotalAmount = (list: Array<TaxModel>): number => {
    let total: number = 0;
    for (let i = 0; i < list.length; i++) {
      let tax = list[i];
      for (let j = 0; j < tax.taxes.length; j++) {
        total += tax.taxes[j].amount;
      }
    }
    return total;
  };

  newUser = () => {
    const self = this;
    const {
      profileResponse: { data },
    } = this.props;
    const okText = data.completedProfile
      ? "Complete Survey"
      : "Complete Profile";
    Modal.info({
      title: (
        <div className="text-justify pr-4">
          <span>
            {data.completedProfile
              ? "Welcome to AccNet Online. Please complete your first Income Tax Survey in order to use taxation services."
              : "Welcome to AccNet Online. Please complete your user profile so we can accurately complete your taxation services."}
          </span>
        </div>
      ),
      content: null,
      okText,
      onOk() {
        if (data.completedProfile) {
          self.onVisible();
        } else {
          const update: CrudObject = {
            ...self.editProfile,
            visible: true,
            update: true,
          };
          self.onChange("editProfile", update);
        }
      },
    });
  };

  renderTakeSurveyButton = () => {
    return (
      <button
        onClick={this.onVisible}
        className="mb-3 btn btn-outline-secondary rounded-10"
      >
        {this.checkTaxesAmount() ? "Do Income Tax" : "Get Started"}
      </button>
    );
  };

  checkTaxesAmount = () => {
    if (
      this.props.taxResponse.success &&
      this.props.taxResponse.items !== undefined &&
      this.props.taxResponse.items !== null
    ) {
      let taxes = this.props.taxResponse.items;
      if (taxes.length > 0) {
        return true;
      }
    }

    return false;
  };

  convertMainStatusNumber = (statusNumber: number) => {
    switch (statusNumber) {
      case 1:
        return "Setting Consultation";
      case 2:
        return "Pending Consultation";
      case 3:
        return "Payment Pending";
      case 4:
        return "Processing Tax File";
      case 5:
        return "Sign Documents";
      case 6:
        return "AccNet E-Filing";
      case 7:
        return "E-Filing on your own";
    }
  };

  convertStatusNumber = (tax: BasicTaxModel) => {
    switch (tax.status) {
      case 1:
        return "Click to set consultation";
      case 2:
        return "Pending Consultation";
      case 3:
        return "Click to pay pending invoices";
      case 4:
        return "Processing Tax File";
      case 5:
        return "Click to sign documents";
      case 6:
        return "AccNet E-Filing to CRA";
      case 7:
        return "E-Filing to CRA by yourself";
    }
  };

  mainTableColumnNames = [
    {
      title: "User Name",
      dataIndex: "mainUser",
      render: (mainUser: any) => `${mainUser.username}`,
    },
    {
      title: "Title",
      dataIndex: "surveyName",
      key: "surveyName",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) => {
        return `${this.convertMainStatusNumber(status)}`;
      },
    },
  ];

  consultationVisible: boolean = false;

  onConsultationVisible = () => {
    this.consultationVisible = !this.consultationVisible;
    this.forceUpdate();
  };

  editTaxFiles: boolean = false;
  initialTaxModel: BasicTaxModel = {
    amount: 0,
    creationDate: "",
    description: "",
    enabled: false,
    id: "",
    status: 1,
    taxFile: {
      userSignedEngagementId: "",
      userSignedTaxFormId: "",
      engagementBlobId: "",
      taxFormBlobId: "",
      extraTaxFile: [],
    },
    relationType: "",
    title: "",
    user: {
      ...initialUserModel,
    },
  };
  selectedTaxModel: BasicTaxModel = {
    ...this.initialTaxModel,
  };

  onEditTaxFiles = (taxModel: BasicTaxModel) => {
    if (!this.editTaxFiles) {
      this.editTaxFiles = true;
      this.selectedTaxModel = {
        ...taxModel,
      };
      this.forceUpdate();
    }
  };

  checkSigned = (tax: BasicTaxModel) => {
    if (tax.status === 5) {
      if (tax.taxFile !== undefined && tax.taxFile !== null) {
        if (
          tax.taxFile.userSignedEngagementId !== undefined &&
          tax.taxFile.userSignedEngagementId !== null &&
          tax.taxFile.userSignedEngagementId !== ""
        ) {
          return true;
        }
      }
    }
    return false;
  };

  render() {
    const { taxResponse } = this.props;

    return (
      <div className="tax-dashboard-component">
        {!taxResponse.loading && taxResponse.items.length === 0 ? (
          <div className="text-center">
            <div className="text-left">
              <h3>
                <strong>Taxes</strong>
              </h3>
            </div>
            {!taxResponse.loading && taxResponse.items.length === 0 ? (
              <div className="alert alert-secondary">
                Start Using Accnet By Calculating Your First Income Tax
              </div>
            ) : null}

            <div className="">{this.renderTakeSurveyButton()}</div>
          </div>
        ) : null}

        {taxResponse.loading || taxResponse.items.length !== 0 ? (
          <Fragment>
            <div className="row mt-5">
              <div className="col-sm-12 col-md-4">
                <h3 className="section-title">Income Tax Files</h3>
              </div>
              <div className="col-sm-12 col-md-8 text-right">
                {this.renderTakeSurveyButton()}
              </div>
            </div>
            <div className="card rounded-20">
              <div className="card-body">
                <div className="table-wrapper tax-table-wrapper">
                  <Table
                    columns={this.mainTableColumnNames}
                    loading={taxResponse.loading}
                    expandedRowRender={(tax: TaxModel) => {
                      return (
                        <table className="table theme-one-grid">
                          <thead>
                            <tr>
                              <th scope="col">Title</th>
                              <th scope="col">First Name</th>
                              <th scope="col">Last Name</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tax.taxes.map((basicTaxModel: BasicTaxModel) => {
                              return (
                                <tr
                                  className={
                                    this.checkSigned(basicTaxModel) ||
                                    basicTaxModel.status === 6 ||
                                    basicTaxModel.status === 7
                                      ? "green-color-accent"
                                      : "red-color-accent"
                                  }
                                  onClick={() => {
                                    switch (basicTaxModel.status) {
                                      case 1:
                                        this.onConsultationVisible();
                                        break;
                                      case 3:
                                        if (getWindowAfterSSR()) {
                                          window.open(
                                            `${window.location.origin}/client/invoice`
                                          );
                                        }
                                        break;
                                      case 5:
                                        this.onEditTaxFiles(basicTaxModel);

                                        break;
                                    }
                                  }}
                                >
                                  <td>
                                    {basicTaxModel.user !== undefined &&
                                    basicTaxModel.user !== null &&
                                    basicTaxModel.user.gender !== undefined &&
                                    basicTaxModel.user.gender !== null
                                      ? basicTaxModel.user.gender
                                      : ""}
                                  </td>
                                  <td>
                                    {basicTaxModel.user !== undefined &&
                                    basicTaxModel.user !== null &&
                                    basicTaxModel.user.firstname !==
                                      undefined &&
                                    basicTaxModel.user.firstname !== null &&
                                    basicTaxModel.user.firstname !== ""
                                      ? basicTaxModel.user.firstname
                                      : ""}
                                  </td>
                                  <td>
                                    {basicTaxModel.user !== undefined &&
                                    basicTaxModel.user !== null &&
                                    basicTaxModel.user.lastname !== undefined &&
                                    basicTaxModel.user.lastname !== null &&
                                    basicTaxModel.user.lastname !== ""
                                      ? basicTaxModel.user.lastname
                                      : ""}
                                  </td>
                                  <td>
                                    {this.convertStatusNumber(basicTaxModel)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      );
                    }}
                    expandIcon={({ expanded, onExpand, record }) =>
                      expanded ? (
                        <span className="fa fa-chevron-up" />
                      ) : (
                        <span className="fa fa-chevron-down" />
                      )
                    }
                    expandRowByClick={true}
                    dataSource={this.props.taxResponse.items}
                    pagination={false}
                  />
                </div>
              </div>
            </div>
          </Fragment>
        ) : null}

        <EditProfile
          profileCrud={this.editProfile}
          onSave={() => {}}
          onChange={(event: CrudObject) => this.onChange("editProfile", event)}
          closeAble={true}
        />

        <CalculateMyTaxes
          visible={this.visible}
          onVisible={this.onVisible}
          closeAble={this.surveyCloseAble}
        />

        <TaxFiles
          editValue={this.selectedTaxModel}
          onSaveFiles={() => {
            this.onEditTaxFiles(this.initialTaxModel);
          }}
          onCancel={() => {
            this.selectedTaxModel = {
              ...this.initialTaxModel,
            };
            this.editTaxFiles = false;
            this.forceUpdate();
          }}
          showModal={this.editTaxFiles}
        />

        <Consultant
          isSurveyRelated={true}
          showMessageBox={false}
          visible={this.consultationVisible}
          onVisible={this.onConsultationVisible}
          closeAble={true}
          type="CLIENT"
          current_step={"Set Consultation Details"}
        />
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    taxResponse: state.taxReducer,
    profileResponse: state.smallProfileReducer,
    engagementResponse: state.fetchEngagementFormReducer,
    taxFormResponse: state.taxReducer,
  };
}

const mapDispatchToProps = {
  taxList,
  getTaxFormRedirectUrl,
  getEngagementRedirectUrl,
};
export default connect(mapStateToProps, mapDispatchToProps)(Taxes);
