import configureStore from "./src/redux-logic/Store"
import React from "react"
import { Provider } from "react-redux"

export default ({ element }) => {
  const store = configureStore()
  return ( <Provider store={store}>{element}</Provider>)
}
