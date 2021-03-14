import { TikbedSetting , Setting } from "./Type"

const initialFlightRulesState: Setting = {
  sideBar: "menu-default menu-sub-hidden main-hidden sub-hidden",
}

let currentStateValue: Setting = initialFlightRulesState

export const tikbedSetting = (state = initialFlightRulesState,action: TikbedSetting): Setting => {
  switch (action.type) {
    case "TIKBED_SETTING":
      currentStateValue = {
        ...action.response,
      }
      return currentStateValue
    default:
      return currentStateValue
  }
}
