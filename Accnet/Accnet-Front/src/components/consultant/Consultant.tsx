// ======================================= module
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";

// ======================================= component
import ConsultationType from "./consultation-type/ConsultationType";
import ConsultationBook from "./consultation-book/ConsultationBook";

// ======================================= redux
import { AppState } from "../../redux-logic/Store";

// ======================================= css
import "./style.scss";

interface PropsType {
  visible: boolean;
  closeAble: boolean;
  type: "MANAGEMENT" | "CLIENT";
  onVisible: Function;
  showMessageBox : boolean
  current_step: "Set Consultation Details" | null
  isSurveyRelated : boolean
}
class Consultant extends Component<PropsType> {
  current_step:
    | "Choose Consultation Type"
    | "Set Consultation Details" = "Choose Consultation Type";
  consultation_duration: 15 | 60 = 15;
  date: string = "";
  update: boolean = true



  componentDidUpdate = () =>{
    if(this.props.current_step === "Set Consultation Details"){
      if(this.update){
        this.current_step = "Set Consultation Details";
        this.consultation_duration = 15
        this.update = false
        this.forceUpdate()
      }
    }
  }

  closeModal = () => {
    this.date = "";
    this.current_step = "Choose Consultation Type";
    this.consultation_duration = 15
    this.update = true
    this.forceUpdate()
    this.props.onVisible();
  };
  render() {
    const { visible, closeAble } = this.props;
    return (
      <Modal
        title={this.current_step}
        visible={visible}
        className="calendar-modal"
        maskClosable={false}
        destroyOnClose
        width={750}
        footer={null}
        onCancel={() => this.closeModal()}
        closable={closeAble}
      >
        <Fragment>
          {this.current_step === "Choose Consultation Type" ? (
            <ConsultationType
              onChange={(event: 15 | 60) => {
                this.consultation_duration = event;
                this.current_step = "Set Consultation Details";
                this.forceUpdate();
              }}
              type={this.props.type}
            />
          ) : null}
       
          {this.current_step === "Set Consultation Details" ? (
            <ConsultationBook
              date={this.date}
              isSurveyRelated={this.props.isSurveyRelated}
              showMessage={this.props.showMessageBox}
              duration={this.consultation_duration}
              onVisible={this.closeModal}
              onPrevious={() => {
                this.current_step = "Choose Consultation Type";
                this.forceUpdate();
              }}
              type={this.props.type}
            />
          ) : null}
        </Fragment>
      </Modal>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Consultant);
