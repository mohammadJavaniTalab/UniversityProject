// ======================================= modules
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

// ======================================= component
import AddComponent from "../../../components/management/tax/add/AddComponent";
import EditComponent from "../../../components/management/tax/edit/EditComponent";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";

// ======================================= redux
import { AppState } from "../../../redux-logic/Store";
import { taxList } from "../../../redux-logic/tax/Action";
import {
  TaxResponse,
  TaxModel,
  BasicTaxModel,
  ExtraTaxFile,
} from "../../../redux-logic/tax/Type";
import { PaginationRequestBody } from "../../../redux-logic/essentials-tools/type/Request-type";

// ======================================= services
import {
  pathProject,
  surveyBlobDownload,
  hostName,
} from "../../../service/constants/defaultValues";
import { Collapse, Table, Button, Modal } from "antd";
import BlobSurveyDownload from "../../../components/file/BlobSurveyDownload";
import TaxFiles from "../../../components/client/taxes/tax-files/TaxFiles";
import { getWindowAfterSSR } from "../../../service/public";
import {
  PaginationConfig,
  SorterResult,
  TableCurrentDataSource,
} from "antd/lib/table";

// =======================================================

interface PropsType {
  taxList: Function;
  taxResponse: TaxResponse;
}
class index extends Component<PropsType> {
  requestBody: PaginationRequestBody = {
    PageNumber: 0,
    PageSize: 10,
  };
  addVisible: boolean = false;
  editVisible: boolean = false;
  editValue: any = {};
  downloadUserSignedDocs: boolean = false;
  extraFiles: Array<ExtraTaxFile> = [];

  downloadTableColumns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Download",
      dataIndex: "",
      key: "x",
      render: (extraFile: ExtraTaxFile) => {
        return (
          <Button
            type="link"
            style={{ padding: "0px" }}
            onClick={() => {
              if (getWindowAfterSSR()) {
                window.open(
                  `${hostName}/api/blob/download/${extraFile.blobId}`
                );
              }
            }}
          >
            Download
          </Button>
        );
      },
    },
  ];

  removeAdminUploadedFiles = (extraFiles: Array<ExtraTaxFile>) => {
    let extraFilesByAdmin: Array<ExtraTaxFile> = [];
    for (let i = 0; i < extraFiles.length; i++) {
      if (!extraFiles[i].setByAdmin) {
        extraFilesByAdmin.push(extraFiles[i]);
      }
    }
    return extraFilesByAdmin;
  };
  componentDidMount = () => {
    this.props.taxList(this.requestBody);
  };

  componentDidUpdate = () => {
    const { taxResponse } = this.props;
    if (taxResponse.updateList) {
      this.props.taxList(this.requestBody);
    }
  };

  addOnVisible = () => {
    this.addVisible = !this.addVisible;
    this.forceUpdate();
  };

  editOnVisible = () => {
    this.editVisible = !this.editVisible;
    this.forceUpdate();
  };

  renderResult = () => {
    const { taxResponse } = this.props;
    return (
      <tbody>
        {taxResponse.items.map((tax: TaxModel) => (
          <tr key={JSON.stringify(tax)}>
            <Collapse>
              <td>
                {tax.mainUser !== undefined &&
                tax.mainUser !== null &&
                tax.mainUser.username !== undefined &&
                tax.mainUser.username !== null
                  ? tax.mainUser.username
                  : ""}
              </td>
              <td>{tax.surveyName}</td>

              <td>
                <button
                  className="btn-icon glyph-icon simple-icon-note"
                  onClick={() => {
                    this.editValue = tax;
                    this.editOnVisible();
                  }}
                />
              </td>
            </Collapse>
          </tr>
        ))}
      </tbody>
    );
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
        return (
          <Button
            type="link"
            style={{ padding: "0px" }}
          >{`${this.convertStatusNumber(status)}`}</Button>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (taxModel: TaxModel) => {
        return (
          <BlobSurveyDownload
            surveyId={taxModel.surveyId}
            userId={taxModel.mainUser.id}
            mainUserName={`${taxModel.mainUser.firstname}_${taxModel.mainUser.lastname}`}
          />
        );
      },
    },
  ];

  convertStatusNumber = (statusNumber: number) => {
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
        return "Documents Sign";
      case 6:
        return "AccNet E-Filing";
      case 7:
        return "E-Filing on your own";
    }
  };

  getTaxkeys = () => {
    const { taxResponse } = this.props;

    let taxesKey: Array<string> = [];
    if (taxResponse.items !== undefined && taxResponse.items !== null) {
      for (let i = 0; i < taxResponse.items.length; i++) {
        taxesKey.push(taxResponse.items[i].surveyId);
      }
    }
    return taxesKey;
  };

  checkFilesFromClient = (extraFiles: Array<ExtraTaxFile>) => {
    for (let i = 0; i < extraFiles.length; i++) {
      if (!extraFiles[i].setByAdmin) {
        return true;
      }
    }
    return false;
  };

  render() {
    const { taxResponse } = this.props;
    return (
      <LayoutManagement pagePath={pathProject.management.tax}>
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-3 text-left">
              <h3 className="mt-2 grid-title">Tax Management</h3>
            </div>
            <div className="col-sm-12 col-md-6 align-right f-right mb-3"></div>
          </div>
          <div className="card">
            <Table
              columns={this.mainTableColumnNames}
              loading={taxResponse.loading}
              // expandedRowKeys={this.getTaxkeys()}
              // expa

              onChange={(
                pagination: PaginationConfig,
                filters: any,
                sorter: SorterResult<any>,
                extra: TableCurrentDataSource<any>
              ) => {
                console.log("chie in" , pagination)
                this.requestBody = {
                  PageNumber : Number(pagination.current) - 1,
                  PageSize : 10
                }
                this.props.taxList(this.requestBody)
              }}
              
              pagination={{
                position: "bottom",
                total : this.props.taxResponse.totalCount,
                pageSize : 10,
              }}
              expandedRowRender={(tax: TaxModel) => {
                return (
                  <table className="table theme-one-grid">
                    <thead>
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Relation</th>
                        <th scope="col">Action</th>
                        <th scope="col">Main User</th>
                        <th scope="col">Uploaded Files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tax.taxes.map((basicTaxModel: BasicTaxModel) => {
                        return (
                          <tr>
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
                              basicTaxModel.user.firstname !== undefined &&
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
                              {basicTaxModel !== undefined &&
                              basicTaxModel !== null &&
                              basicTaxModel.relationType !== undefined &&
                              basicTaxModel.relationType !== null &&
                              basicTaxModel.relationType !== ""
                                ? basicTaxModel.relationType
                                : ""}
                            </td>
                            <td>
                              <Button
                                type="link"
                                style={{ padding: "0px" }}
                                onClick={() => {
                                  this.editValue = basicTaxModel;
                                  this.editOnVisible();
                                }}
                              >
                                Edit
                              </Button>
                            </td>
                            <td>
                              {basicTaxModel.user !== undefined &&
                              basicTaxModel.user !== null &&
                              basicTaxModel.user.id !== undefined &&
                              basicTaxModel.user.id !== null &&
                              tax.mainUser !== undefined &&
                              tax.mainUser !== null &&
                              tax.mainUser.id !== undefined &&
                              tax.mainUser.id !== null &&
                              basicTaxModel.user.id === tax.mainUser.id ? (
                                <span className="fa fa-star" />
                              ) : null}
                            </td>
                            <td>
                              {basicTaxModel.taxFile !== undefined &&
                              basicTaxModel.taxFile !== null &&
                              basicTaxModel.taxFile.extraTaxFile !==
                                undefined &&
                              basicTaxModel.taxFile.extraTaxFile !== null &&
                              basicTaxModel.taxFile.extraTaxFile.length > 0 &&
                              this.checkFilesFromClient(
                                basicTaxModel.taxFile.extraTaxFile
                              ) ? (
                                <Button
                                  type="default"
                                  onClick={() => {
                                    this.downloadUserSignedDocs = true;
                                    this.extraFiles =
                                      basicTaxModel.taxFile.extraTaxFile;
                                    this.forceUpdate();
                                  }}
                                >
                                  Download
                                </Button>
                              ) : null}
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
            />

            {/* {!taxResponse.loading && taxResponse.items.length === 0 ? (
                <div className="text-center">
                  <Empty
                    description={<span>No Tax Found yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null}
              {taxResponse.loading ? (
                <div className="text-center py-3">
                  <Empty
                    description={<span>Please wait ...</span>}
                    image={AllImages.loading}
                  />
                </div>
              ) : null} */}
          </div>
          <AddComponent
            visible={this.addVisible}
            onVisible={this.addOnVisible}
          />
          <EditComponent
            visible={this.editVisible}
            onVisible={this.editOnVisible}
            editValue={this.editValue}
          />

          <Modal
            visible={this.downloadUserSignedDocs}
            title={"Download User Signed Documents"}
            onCancel={() => {
              this.downloadUserSignedDocs = false;
              this.forceUpdate();
            }}
            footer={null}
          >
            <Table
              columns={this.downloadTableColumns}
              dataSource={this.removeAdminUploadedFiles(this.extraFiles)}
              pagination={false}
            />
          </Modal>
        </Fragment>
      </LayoutManagement>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    taxResponse: state.taxReducer,
  };
}

const mapDispatchToProps = { taxList };

export default connect(mapStateToProps, mapDispatchToProps)(index);
