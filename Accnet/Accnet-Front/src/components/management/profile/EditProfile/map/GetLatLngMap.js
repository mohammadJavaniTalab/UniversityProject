import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

class GetLatLngMap extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        onDragend={(mapProps, map, er) => {}}
      >
        <Marker 
        onClick={this.onMarkerClick} 
        name={"Current location"} 
        position={{lat: undefined, lng: undefined}}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDhm276YkAgmraW5sMUm9VUcO5OKJwCEsI"
})(GetLatLngMap);
