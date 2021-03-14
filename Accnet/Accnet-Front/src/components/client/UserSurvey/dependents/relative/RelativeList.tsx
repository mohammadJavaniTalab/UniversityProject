import React, { Component } from "react";
import { Modal, Button, Empty, DatePicker } from "antd";
import {
  RelativeListResponse,
  Relative_Add_Delete_Response,
  Relative
} from "../../../../../redux-logic/relative/Type";
import {
  addRelativeByModel,
  deleteRelativeById,
  fetchRelativesByToken
} from "../../../../../redux-logic/relative/Action";
import { AppState } from "../../../../../redux-logic/Store";
import { connect } from "react-redux";
import AllImages from "../../../../../assets/images/images";
import Moment from "moment";
import SelectRelationShip from "../../../../generals/select/relation-ship/SelectRelationShip";
import SinNumberInput from "../../../../generals/select/sin-number/SinNumberInput";
import { getTimeAndDate } from "../../../../../service/public";
import { getNotification } from "../../../../../service/notification";
import moment from "moment";

interface RelativeListPropTypes {
  surveyId: string;
  onSaveAll: any;
  onCancelAll: any;
  relativeModalVisibility: boolean;
  relativeListResponse: RelativeListResponse;
  relative_add_delete_response: Relative_Add_Delete_Response;
  fetchRelativesByToken: any;
  deleteRelativeById: any;
  addRelativeByModel: any;
}

class RelativeList extends Component<RelativeListPropTypes> {
  needsListFetch: boolean = true;
  item_added_Deleted: boolean = false;
  addRelativeModalVisibility: boolean = false;
  emptyRelative: Relative = {
    dateOfBirth: "",
    firstname: "",
    id: "",
    lastname: "",
    relationType: "",
    sinNumber: ""
  };
  relative: Relative = {
    ...this.emptyRelative
  };

  check_add_delete_response = () => {
    if (this.props.relative_add_delete_response.success) {
      return true;
    } else if (
      this.props.relative_add_delete_response.message !== undefined &&
      this.props.relative_add_delete_response.message !== null &&
      this.props.relative_add_delete_response.message !== ""
    ) {
      getNotification("", this.props.relative_add_delete_response.message, 4);
    } else if (
      this.props.relative_add_delete_response.error !== undefined &&
      this.props.relative_add_delete_response.error !== null &&
      this.props.relative_add_delete_response.error.code !== undefined &&
      this.props.relative_add_delete_response.error.code !== null &&
      this.props.relative_add_delete_response.error.code !== 0
    ) {
      let message: string =
        "Could Not add person due to unknown error. please try again";
      if (
        this.props.relative_add_delete_response.error.data !== [] &&
        this.props.relative_add_delete_response.error.data.length > 0
      ) {
        message = this.props.relative_add_delete_response.error.data[0];
      }
      getNotification("", message, 4);
    }
    return false;
  };

  checkListResponse = () => {
    if (this.props.relativeListResponse.success) {
      let listResponse = this.props.relativeListResponse;
      if (listResponse.data !== undefined && listResponse.data !== null) {
        return true;
      }
    }
    return false;
  };

  render() {
    const { surveyId } = this.props;
    if (this.item_added_Deleted) {
      if (
        this.check_add_delete_response() &&
        !this.props.relative_add_delete_response.loading
      ) {
        this.needsListFetch = true;
        this.item_added_Deleted = false;
      }
    }
    if (this.needsListFetch) {
      this.needsListFetch = false;
      this.props.fetchRelativesByToken(surveyId);
    }
    return (
      <div>
        <Modal
          visible={this.props.relativeModalVisibility}
          maskClosable={false}
          onCancel={() => {
            this.props.onCancelAll();
          }}
          closeIcon={<span className="fa fa-times" />}
          footer={[
            <Button
              type="primary"
              onClick={() => {
                this.props.onSaveAll();
              }}
            >
              Save
            </Button>
          ]}
        >
          <div className="mt-3">
            <div className="text-right">
              <Button
                shape="round"
                onClick={() => {
                  this.addRelativeModalVisibility = true;
                  this.forceUpdate();
                }}
              >
                Add Person
              </Button>
            </div>
            <table className="table mt-2">
              <thead>
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Age</th>
                  <th scope="col">Relation</th>
                  <th scope="col">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {this.checkListResponse() &&
                this.props.relativeListResponse.data !== [] &&
                this.props.relativeListResponse.data.length > 0
                  ? this.props.relativeListResponse.data.map(
                      (relative: Relative) => {
                        return (
                          <tr>
                            <td>{relative.firstname}</td>
                            <td>{relative.lastname}</td>
                            <td>
                              {getTimeAndDate(relative.dateOfBirth, "DATE")}
                            </td>
                            <td>{relative.relationType}</td>
                            <td>
                              <button
                                className="btn-icon glyph-icon simple-icon-trash"
                                onClick={() => {
                                  const self = this;
                                  Modal.confirm({
                                    title:
                                      "Are you sure you want to delete this relative?",
                                    okText: "Yes, Delete!",
                                    cancelText: "No, Cancel",
                                    onOk() {
                                      self.item_added_Deleted = true;
                                      self.props.deleteRelativeById(
                                        relative.id
                                      );
                                      self.forceUpdate();
                                    },
                                    onCancel() {}
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        );
                      }
                    )
                  : null}
              </tbody>
            </table>
            {this.props.relativeListResponse.data !== undefined &&
            this.props.relativeListResponse.data !== null ? (
              this.props.relativeListResponse.data.length === 0 ||
              this.props.relativeListResponse.data === [] ? (
                <div className="text-center">
                  <Empty
                    description={<span>No Person Added Yet.</span>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : null
            ) : this.props.relativeListResponse.loading ? (
              <div className="text-center py-3">
                <Empty
                  description={<span>Please wait ...</span>}
                  image={AllImages.loading}
                />
              </div>
            ) : null}
          </div>
        </Modal>

        <Modal
          visible={this.addRelativeModalVisibility}
          maskClosable={false}
          closable={true}
          closeIcon={<span className="fa fa-times" />}
          footer={[
            <Button
              type="primary"
              onClick={() => {
                this.addRelativeModalVisibility = false;
                let relativeUpdate = {
                  ...this.relative
                };
                this.item_added_Deleted = true;
                this.props.addRelativeByModel(
                  relativeUpdate,
                  this.props.surveyId
                );
                this.relative = {
                  ...this.emptyRelative
                };
              }}
            >
              Add Person
            </Button>
          ]}
          onCancel={() => {
            const self = this;
            Modal.confirm({
              title: "Are you sure you want to discard these information's?",
              okText: "Yes, discard!",
              cancelText: "No, dismiss",
              onOk() {
                self.addRelativeModalVisibility = false;
                self.relative = {
                  ...self.emptyRelative
                };
                self.forceUpdate();
              },
              onCancel() {}
            });
          }}
          destroyOnClose={true}
        >
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Relation with you</label>
                  <SelectRelationShip
                    isAbove19={false}
                    value={this.relative.relationType}
                    onChange={(event: string) => {
                      this.relative.relationType = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    value={this.relative.firstname}
                    onChange={e => {
                      this.relative.firstname = e.target.value;
                      this.forceUpdate();
                    }}
                    className="form-control"
                    placeholder="Enter first name"
                    maxLength={32}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    value={this.relative.lastname}
                    onChange={e => {
                      this.relative.lastname = e.target.value;
                      this.forceUpdate();
                    }}
                    className="form-control"
                    placeholder="Enter last name"
                    maxLength={32}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>BirthDate</label>
                  <div>
                    <DatePicker
                      placeholder="Select BirthDate"
                      className="w-100"
                      allowClear={false}
                      value={
                        this.relative.dateOfBirth === ""
                          ? undefined
                          : Moment(this.relative.dateOfBirth)
                      }
                      disabledDate={(d: any) => {
                        return (
                          !d ||
                          d.isAfter(moment(new Date())) ||
                          d.isSameOrBefore("1910-01-01")
                        );
                      }}
                      onChange={(date : any, dateString : any) => {
                        this.relative.dateOfBirth = dateString;
                        this.forceUpdate();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>SIN (For Fastest Results)</label>
                  <SinNumberInput
                    value={this.relative.sinNumber}
                    onChange={(event: string) => {
                      this.relative.sinNumber = event;
                      this.forceUpdate();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    relative_add_delete_response: state.relativeActionsReducer,
    relativeListResponse: state.relativeListReducer
  };
}

const mapDispatchToProps = {
  addRelativeByModel,
  deleteRelativeById,
  fetchRelativesByToken
};

export default connect(mapStateToProps, mapDispatchToProps)(RelativeList);
