import React, { Component } from 'react';
import { connect } from "react-redux";
import { AppState } from "../../../../redux-logic/Store";
import SideBar from './SideBar';
import { changeSideBar } from "../../../../redux-logic/management/sidebar/Action"


interface PropsType {
    setting: any
    changeSideBar: Function
}
 
class SidebarLayout extends Component<PropsType> {
    changeSideBar = () => {
        const {
          setting: { sideBar },
        } = this.props
        this.props.changeSideBar(sideBar)
      }
    render() {
        const { children, setting: { sideBar } } = this.props;   
        return (
            <div className={sideBar}>
                <SideBar changeSideBar={this.changeSideBar}/>
                {children}
            </div>
        )
    }
} 


function mapStateToProps(state: AppState) {
    return { setting: state.tikbedSetting,}
}

export default connect(
    mapStateToProps, {changeSideBar}
)(SidebarLayout)
