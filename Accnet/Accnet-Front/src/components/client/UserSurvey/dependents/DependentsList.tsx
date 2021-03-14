import React, { Component } from "react";
import { Modal, Empty, Button } from "antd";
import {
  DependentsListResponse,
  Dependent_Add_Delete_Response,
} from "../../../../redux-logic/dependent/Type";
import {
  fetchDependentsListBySurveyId,
  addDependentByModel,
  addAlreadyAccNetUser,
  deleteDependentById
} from "../../../../redux-logic/dependent/Action";
import { LinkedUserModel } from "../../../../redux-logic/link_user/Type";
import AllImages from "../../../../assets/images/images";
import { AppState } from "../../../../redux-logic/Store";
import { connect } from "react-redux";
import DependentAdd from "./DependentAdd";
import { getNotification } from "../../../../service/notification";

interface DependentsListPropTypes {
  dependentsModalVisibility: boolean;
  dependentsListResponse: DependentsListResponse;
  add_delete_dependent_response: Dependent_Add_Delete_Response;
  deleteDependentById: any;
  addDependentByModel: any;
  addAlreadyAccNetUser: any;
  fetchDependentsListBySurveyId: any;
  surveyId: string;
  onSaveAll: any;
  onCancelAll: any;
}

class DependentsList extends Component<DependentsListPropTypes> {
  addDependentModalVisibility: boolean = false;
  needsListFetch: boolean = true;
  item_added_Deleted: boolean = false;

  checkListResponse = () => {
    if (
      this.props.dependentsListResponse !== undefined &&
      this.props.dependentsListResponse !== null &&
      this.props.dependentsListResponse.success
    ) {
      let list = this.props.dependentsListResponse;
      if (
        list.data !== undefined &&
        list.data !== null &&
        list.data !== [] &&
        list.data.length > 0
      ) {
        return true;
      }
    }

    return false;
  };
  check_add_delete_response = () => {
    if (this.props.add_delete_dependent_response.success) {
      return true;
    } else if (
      this.props.add_delete_dependent_response.message !== undefined &&
      this.props.add_delete_dependent_response.message !== null &&
      this.props.add_delete_dependent_response.message !== ""
    ) {
      getNotification("", this.props.add_delete_dependent_response.message, 4);
    } else if (
      this.props.add_delete_dependent_response.error !== undefined &&
      this.props.add_delete_dependent_response.error !== null &&
      this.props.add_delete_dependent_response.error.code !== undefined &&
      this.props.add_delete_dependent_response.error.code !== null &&
      this.props.add_delete_dependent_response.error.code !== 0
    ) {
      let message: string =
        "Could Not add person due to unknown error. please try again";
      if (
        this.props.add_delete_dependent_response.error.data !== [] &&
        this.props.add_delete_dependent_response.error.data.length > 0
      ) {
        message = this.props.add_delete_dependent_response.error.data[0];
      }
      getNotification("", message, 4);
    }
    return false;
  };

  render() {
    if (this.item_added_Deleted) {
      if (
        this.check_add_delete_response() &&
        !this.props.add_delete_dependent_response.loading
      ) {
        this.needsListFetch = true;
        this.item_added_Deleted = false;
      }
    }
    if (this.needsListFetch) {
      this.needsListFetch = false;
      this.props.fetchDependentsListBySurveyId(this.props.surveyId);
    }
    return (
      <Modal
        visible={this.props.dependentsModalVisibility}
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
                this.addDependentModalVisibility = true
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
                <th scope="col">Relation</th>
                <th scope="col">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {this.checkListResponse() &&
              this.props.dependentsListResponse.data !== [] &&
              this.props.dependentsListResponse.data.length > 0
                ? this.props.dependentsListResponse.data.map(
                    (linkedUsers: LinkedUserModel) => {
                      return (
                        <tr>
                          <td>{linkedUsers.firstUser.firstname}</td>
                          <td>{linkedUsers.firstUser.lastname}</td>
                          <td>{linkedUsers.relationType}</td>
                          <td>
                            <button
                              className="btn-icon glyph-icon simple-icon-trash"
                              onClick={() => {
                                const self = this;
                                Modal.confirm({
                                  title:
                                    "Are you sure you want to delete this dependent?",
                                  okText: "Yes, Delete!",
                                  cancelText: "No, Cancel",
                                  onOk() {
                                    self.props.deleteDependentById(
                                      linkedUsers.id,
                                      self.props.surveyId
                                    );
                                    self.item_added_Deleted = true;
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
          {this.props.dependentsListResponse.data !== undefined &&
          this.props.dependentsListResponse !== null ? (
            this.props.dependentsListResponse.data.length === 0 ||
            this.props.dependentsListResponse.data === [] ? (
              <div className="text-center">
                <Empty
                  description={<span>No Dependents Added Yet.</span>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : null
          ) : this.props.dependentsListResponse.loading ? (
            <div className="text-center py-3">
              <Empty
                description={<span>Please wait ...</span>}
                image={AllImages.loading}
              />
            </div>
          ) : null}
        </div>
    

          <DependentAdd
            dependentAddModalVisibility={this.addDependentModalVisibility}
            reloadList={() => {
              this.addDependentModalVisibility = false;
              this.needsListFetch = true;
              this.item_added_Deleted = false;
              this.forceUpdate()
            }}
        
            onCancel={() => {
              this.addDependentModalVisibility = false;
              this.forceUpdate();
            }}
            surveyId={this.props.surveyId}
          />
      </Modal>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    dependentsListResponse: state.dependentListReducer,
    add_delete_dependent_response: state.dependent_add_delete_reducer
  };
}

const mapDispatchToProps = {
  fetchDependentsListBySurveyId,
  addDependentByModel,
  deleteDependentById,
  addAlreadyAccNetUser
};

export default connect(mapStateToProps, mapDispatchToProps)(DependentsList);
