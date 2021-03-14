import React, { Component } from "react";
import { connect } from "react-redux";
import { getWindowAfterSSR, setLocalStorage } from "../../service/public";
import { AppState } from "../../redux-logic/Store";
import {
  redirectFromDocuSign,
  docuSignLocalStorageTaxName
} from "../../service/constants/defaultValues";

interface PropsType {
  id: string;
}
class SignEngagement extends Component<PropsType> {
  render() {
    const { id } = this.props;
    return (
      <button
        onClick={() => {
          if (getWindowAfterSSR()) {
            setLocalStorage(docuSignLocalStorageTaxName, id);
            window.location.href = `${`https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature&client_id=8d503a24-f2f9-4755-826d-9f1589d8e88a&redirect_uri=${redirectFromDocuSign}#/challenge/appconsent`}`;
          }
        }}
        className="glyph-icon iconsminds-redirect btn-icon h5"
      />
    );
  }
}

function mapStateToProps(state: AppState) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SignEngagement);
